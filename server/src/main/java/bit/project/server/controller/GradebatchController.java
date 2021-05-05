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
import bit.project.server.entity.Gradebatch;
import bit.project.server.dao.GradebatchDao;
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
@RequestMapping("/gradebatches")
public class GradebatchController{

    @Autowired
    private GradebatchDao gradebatchDao;

    @Autowired
    private AccessControlManager accessControlManager;

    @Autowired
    private CodeGenerator codeGenerator;

    private static final Sort DEFAULT_SORT = Sort.by(Sort.Direction.DESC, "tocreation");
    private final CodeGenerator.CodeGeneratorConfig codeConfig;

    public GradebatchController(){
        codeConfig = new CodeGenerator.CodeGeneratorConfig("gradebatch");
        codeConfig.setColumnName("code");
        codeConfig.setLength(10);
        codeConfig.setPrefix("GB");
        codeConfig.setYearlyRenew(true);
    }

    @GetMapping
    public Page<Gradebatch> getAll(PageQuery pageQuery, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to get all gradebatches", UsecaseList.SHOW_ALL_GRADEBATCHES);

        if(pageQuery.isEmptySearch()){
            return gradebatchDao.findAll(PageRequest.of(pageQuery.getPage(), pageQuery.getSize(), DEFAULT_SORT));
        }

        String code = pageQuery.getSearchParam("code");
        Integer gradeId = pageQuery.getSearchParamAsInteger("grade");
        String name = pageQuery.getSearchParam("name");

        List<Gradebatch> gradebatches = gradebatchDao.findAll(DEFAULT_SORT);
        Stream<Gradebatch> stream = gradebatches.parallelStream();

        List<Gradebatch> filteredGradebatches = stream.filter(gradebatch -> {
            if(code!=null)
                if(!gradebatch.getCode().toLowerCase().contains(code.toLowerCase())) return false;
            if(gradeId!=null)
                if(!gradebatch.getGrade().getId().equals(gradeId)) return false;
            if(name!=null)
                if(!gradebatch.getName().toLowerCase().contains(name.toLowerCase())) return false;
            return true;
        }).collect(Collectors.toList());

        return PageHelper.getAsPage(filteredGradebatches, pageQuery.getPage(), pageQuery.getSize());

    }

    @GetMapping("/basic")
    public Page<Gradebatch> getAllBasic(PageQuery pageQuery, HttpServletRequest request){
        accessControlManager.authorize(request, "No privilege to get all gradebatches' basic data", UsecaseList.SHOW_ALL_GRADEBATCHES);
        return gradebatchDao.findAllBasic(PageRequest.of(pageQuery.getPage(), pageQuery.getSize(), DEFAULT_SORT));
    }

    @GetMapping("/{id}")
    public Gradebatch get(@PathVariable Integer id, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to get gradebatch", UsecaseList.SHOW_GRADEBATCH_DETAILS, UsecaseList.UPDATE_GRADEBATCH);
        Optional<Gradebatch> optionalGradebatch = gradebatchDao.findById(id);
        if(optionalGradebatch.isEmpty()) throw new ObjectNotFoundException("Gradebatch not found");
        return optionalGradebatch.get();
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Integer id, HttpServletRequest request){
        accessControlManager.authorize(request, "No privilege to delete gradebatches", UsecaseList.DELETE_GRADEBATCH);

        try{
            if(gradebatchDao.existsById(id)) gradebatchDao.deleteById(id);
        }catch (DataIntegrityViolationException | RollbackException e){
            throw new ConflictException("Cannot delete. Because this gradebatch already used in another module");
        }
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ResourceLink add(@RequestBody Gradebatch gradebatch, HttpServletRequest request) throws InterruptedException {
        User authUser = accessControlManager.authorize(request, "No privilege to add new gradebatch", UsecaseList.ADD_GRADEBATCH);

        gradebatch.setTocreation(LocalDateTime.now());
        gradebatch.setCreator(authUser);
        gradebatch.setId(null);


        EntityValidator.validate(gradebatch);

        PersistHelper.save(()->{
            gradebatch.setCode(codeGenerator.getNextId(codeConfig));
            return gradebatchDao.save(gradebatch);
        });

        return new ResourceLink(gradebatch.getId(), "/gradebatches/"+gradebatch.getId());
    }

    @PutMapping("/{id}")
    public ResourceLink update(@PathVariable Integer id, @RequestBody Gradebatch gradebatch, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to update gradebatch details", UsecaseList.UPDATE_GRADEBATCH);

        Optional<Gradebatch> optionalGradebatch = gradebatchDao.findById(id);
        if(optionalGradebatch.isEmpty()) throw new ObjectNotFoundException("Gradebatch not found");
        Gradebatch oldGradebatch = optionalGradebatch.get();

        gradebatch.setId(id);
        gradebatch.setCode(oldGradebatch.getCode());
        gradebatch.setCreator(oldGradebatch.getCreator());
        gradebatch.setTocreation(oldGradebatch.getTocreation());


        EntityValidator.validate(gradebatch);

        gradebatch = gradebatchDao.save(gradebatch);
        return new ResourceLink(gradebatch.getId(), "/gradebatches/"+gradebatch.getId());
    }

}