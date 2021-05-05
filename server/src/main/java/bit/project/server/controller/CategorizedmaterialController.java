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
import bit.project.server.util.dto.ResourceLink;
import org.springframework.web.bind.annotation.*;
import bit.project.server.util.helper.PageHelper;
import org.springframework.data.domain.PageRequest;
import bit.project.server.util.helper.PersistHelper;
import bit.project.server.util.helper.CodeGenerator;
import bit.project.server.entity.Categorizedmaterial;
import bit.project.server.dao.CategorizedmaterialDao;
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
@RequestMapping("/categorizedmaterials")
public class CategorizedmaterialController{

    @Autowired
    private CategorizedmaterialDao categorizedmaterialDao;

    @Autowired
    private AccessControlManager accessControlManager;

    @Autowired
    private CodeGenerator codeGenerator;

    private static final Sort DEFAULT_SORT = Sort.by(Sort.Direction.DESC, "tocreation");
    private final CodeGenerator.CodeGeneratorConfig codeConfig;

    public CategorizedmaterialController(){
        codeConfig = new CodeGenerator.CodeGeneratorConfig("categorizedmaterial");
        codeConfig.setColumnName("code");
        codeConfig.setLength(10);
        codeConfig.setPrefix("CA");
        codeConfig.setYearlyRenew(true);
    }

    @GetMapping
    public Page<Categorizedmaterial> getAll(PageQuery pageQuery, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to get all categorizedmaterials", UsecaseList.SHOW_ALL_CATEGORIZEDMATERIALS);

        if(pageQuery.isEmptySearch()){
            return categorizedmaterialDao.findAll(PageRequest.of(pageQuery.getPage(), pageQuery.getSize(), DEFAULT_SORT));
        }

        String code = pageQuery.getSearchParam("code");

        List<Categorizedmaterial> categorizedmaterials = categorizedmaterialDao.findAll(DEFAULT_SORT);
        Stream<Categorizedmaterial> stream = categorizedmaterials.parallelStream();

        List<Categorizedmaterial> filteredCategorizedmaterials = stream.filter(categorizedmaterial -> {
            if(code!=null)
                if(!categorizedmaterial.getCode().toLowerCase().contains(code.toLowerCase())) return false;
            return true;
        }).collect(Collectors.toList());

        return PageHelper.getAsPage(filteredCategorizedmaterials, pageQuery.getPage(), pageQuery.getSize());

    }

    @GetMapping("/basic")
    public Page<Categorizedmaterial> getAllBasic(PageQuery pageQuery, HttpServletRequest request){
        accessControlManager.authorize(request, "No privilege to get all categorizedmaterials' basic data", UsecaseList.SHOW_ALL_CATEGORIZEDMATERIALS, UsecaseList.ADD_DRYERING, UsecaseList.UPDATE_DRYERING, UsecaseList.ADD_GRADEBATCH, UsecaseList.UPDATE_GRADEBATCH, UsecaseList.ADD_GRINDING, UsecaseList.UPDATE_GRINDING, UsecaseList.ADD_PERMENTING, UsecaseList.UPDATE_PERMENTING, UsecaseList.ADD_TASTING, UsecaseList.UPDATE_TASTING, UsecaseList.ADD_WITHERING, UsecaseList.UPDATE_WITHERING);
        return categorizedmaterialDao.findAllBasic(PageRequest.of(pageQuery.getPage(), pageQuery.getSize(), DEFAULT_SORT));
    }

    @GetMapping("/{id}")
    public Categorizedmaterial get(@PathVariable Integer id, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to get categorizedmaterial", UsecaseList.SHOW_CATEGORIZEDMATERIAL_DETAILS, UsecaseList.UPDATE_CATEGORIZEDMATERIAL);
        Optional<Categorizedmaterial> optionalCategorizedmaterial = categorizedmaterialDao.findById(id);
        if(optionalCategorizedmaterial.isEmpty()) throw new ObjectNotFoundException("Categorizedmaterial not found");
        return optionalCategorizedmaterial.get();
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Integer id, HttpServletRequest request){
        accessControlManager.authorize(request, "No privilege to delete categorizedmaterials", UsecaseList.DELETE_CATEGORIZEDMATERIAL);

        try{
            if(categorizedmaterialDao.existsById(id)) categorizedmaterialDao.deleteById(id);
        }catch (DataIntegrityViolationException | RollbackException e){
            throw new ConflictException("Cannot delete. Because this categorizedmaterial already used in another module");
        }
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ResourceLink add(@RequestBody Categorizedmaterial categorizedmaterial, HttpServletRequest request) throws InterruptedException {
        User authUser = accessControlManager.authorize(request, "No privilege to add new categorizedmaterial", UsecaseList.ADD_CATEGORIZEDMATERIAL);

        categorizedmaterial.setTocreation(LocalDateTime.now());
        categorizedmaterial.setCreator(authUser);
        categorizedmaterial.setId(null);


        EntityValidator.validate(categorizedmaterial);

        PersistHelper.save(()->{
            categorizedmaterial.setCode(codeGenerator.getNextId(codeConfig));
            return categorizedmaterialDao.save(categorizedmaterial);
        });

        return new ResourceLink(categorizedmaterial.getId(), "/categorizedmaterials/"+categorizedmaterial.getId());
    }

    @PutMapping("/{id}")
    public ResourceLink update(@PathVariable Integer id, @RequestBody Categorizedmaterial categorizedmaterial, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to update categorizedmaterial details", UsecaseList.UPDATE_CATEGORIZEDMATERIAL);

        Optional<Categorizedmaterial> optionalCategorizedmaterial = categorizedmaterialDao.findById(id);
        if(optionalCategorizedmaterial.isEmpty()) throw new ObjectNotFoundException("Categorizedmaterial not found");
        Categorizedmaterial oldCategorizedmaterial = optionalCategorizedmaterial.get();

        categorizedmaterial.setId(id);
        categorizedmaterial.setCode(oldCategorizedmaterial.getCode());
        categorizedmaterial.setCreator(oldCategorizedmaterial.getCreator());
        categorizedmaterial.setTocreation(oldCategorizedmaterial.getTocreation());


        EntityValidator.validate(categorizedmaterial);

        categorizedmaterial = categorizedmaterialDao.save(categorizedmaterial);
        return new ResourceLink(categorizedmaterial.getId(), "/categorizedmaterials/"+categorizedmaterial.getId());
    }

}