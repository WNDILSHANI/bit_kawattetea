package bit.project.server.controller;

import java.util.List;
import java.util.Optional;
import java.time.LocalDateTime;
import java.util.stream.Stream;
import java.util.stream.Collectors;
import bit.project.server.UsecaseList;
import bit.project.server.entity.User;
import org.springframework.http.HttpStatus;
import javax.persistence.RollbackException;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Page;
import javax.servlet.http.HttpServletRequest;
import bit.project.server.util.dto.PageQuery;
import bit.project.server.entity.Categorization;
import bit.project.server.dao.CategorizationDao;
import bit.project.server.util.dto.ResourceLink;
import org.springframework.web.bind.annotation.*;
import bit.project.server.util.helper.PageHelper;
import org.springframework.data.domain.PageRequest;
import bit.project.server.util.helper.PersistHelper;
import bit.project.server.util.helper.CodeGenerator;
import bit.project.server.util.validation.EntityValidator;
import bit.project.server.util.exception.ConflictException;
import bit.project.server.util.validation.ValidationErrorBag;
import bit.project.server.util.security.AccessControlManager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import bit.project.server.util.exception.DataValidationException;
import bit.project.server.util.exception.ObjectNotFoundException;

@CrossOrigin
@RestController
@RequestMapping("/categorizations")
public class CategorizationController{

    @Autowired
    private CategorizationDao categorizationDao;

    @Autowired
    private AccessControlManager accessControlManager;

    @Autowired
    private CodeGenerator codeGenerator;

    private static final Sort DEFAULT_SORT = Sort.by(Sort.Direction.DESC, "tocreation");
    private final CodeGenerator.CodeGeneratorConfig codeConfig;

    public CategorizationController(){
        codeConfig = new CodeGenerator.CodeGeneratorConfig("categorization");
        codeConfig.setColumnName("code");
        codeConfig.setLength(10);
        codeConfig.setPrefix("CA");
        codeConfig.setYearlyRenew(true);
    }

    @GetMapping
    public Page<Categorization> getAll(PageQuery pageQuery, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to get all categorizations", UsecaseList.SHOW_ALL_CATEGORIZATIONS);

        if(pageQuery.isEmptySearch()){
            return categorizationDao.findAll(PageRequest.of(pageQuery.getPage(), pageQuery.getSize(), DEFAULT_SORT));
        }

        String code = pageQuery.getSearchParam("code");

        List<Categorization> categorizations = categorizationDao.findAll(DEFAULT_SORT);
        Stream<Categorization> stream = categorizations.parallelStream();

        List<Categorization> filteredCategorizations = stream.filter(categorization -> {
            if(code!=null)
                if(!categorization.getCode().toLowerCase().contains(code.toLowerCase())) return false;
            return true;
        }).collect(Collectors.toList());

        return PageHelper.getAsPage(filteredCategorizations, pageQuery.getPage(), pageQuery.getSize());

    }

    @GetMapping("/basic")
    public Page<Categorization> getAllBasic(PageQuery pageQuery, HttpServletRequest request){
        accessControlManager.authorize(request, "No privilege to get all categorizations' basic data", UsecaseList.SHOW_ALL_CATEGORIZATIONS, UsecaseList.ADD_CATEGORIZEDMATERIAL, UsecaseList.UPDATE_CATEGORIZEDMATERIAL);
        return categorizationDao.findAllBasic(PageRequest.of(pageQuery.getPage(), pageQuery.getSize(), DEFAULT_SORT));
    }

    @GetMapping("/{id}")
    public Categorization get(@PathVariable Integer id, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to get categorization", UsecaseList.SHOW_CATEGORIZATION_DETAILS, UsecaseList.UPDATE_CATEGORIZATION);
        Optional<Categorization> optionalCategorization = categorizationDao.findById(id);
        if(optionalCategorization.isEmpty()) throw new ObjectNotFoundException("Categorization not found");
        return optionalCategorization.get();
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Integer id, HttpServletRequest request){
        accessControlManager.authorize(request, "No privilege to delete categorizations", UsecaseList.DELETE_CATEGORIZATION);

        try{
            if(categorizationDao.existsById(id)) categorizationDao.deleteById(id);
        }catch (DataIntegrityViolationException | RollbackException e){
            throw new ConflictException("Cannot delete. Because this categorization already used in another module");
        }
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ResourceLink add(@RequestBody Categorization categorization, HttpServletRequest request) throws InterruptedException {
        User authUser = accessControlManager.authorize(request, "No privilege to add new categorization", UsecaseList.ADD_CATEGORIZATION);

        categorization.setTocreation(LocalDateTime.now());
        categorization.setCreator(authUser);
        categorization.setId(null);


        EntityValidator.validate(categorization);

        PersistHelper.save(()->{
            categorization.setCode(codeGenerator.getNextId(codeConfig));
            return categorizationDao.save(categorization);
        });

        return new ResourceLink(categorization.getId(), "/categorizations/"+categorization.getId());
    }

    @PutMapping("/{id}")
    public ResourceLink update(@PathVariable Integer id, @RequestBody Categorization categorization, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to update categorization details", UsecaseList.UPDATE_CATEGORIZATION);

        Optional<Categorization> optionalCategorization = categorizationDao.findById(id);
        if(optionalCategorization.isEmpty()) throw new ObjectNotFoundException("Categorization not found");
        Categorization oldCategorization = optionalCategorization.get();

        categorization.setId(id);
        categorization.setCode(oldCategorization.getCode());
        categorization.setCreator(oldCategorization.getCreator());
        categorization.setTocreation(oldCategorization.getTocreation());


        EntityValidator.validate(categorization);

        categorization = categorizationDao.save(categorization);
        return new ResourceLink(categorization.getId(), "/categorizations/"+categorization.getId());
    }

}