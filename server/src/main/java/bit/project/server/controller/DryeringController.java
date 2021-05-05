package bit.project.server.controller;

import java.util.List;
import java.util.Optional;
import java.time.LocalDateTime;
import java.util.stream.Stream;
import java.util.stream.Collectors;
import bit.project.server.UsecaseList;
import bit.project.server.entity.User;
import bit.project.server.entity.Dryering;
import bit.project.server.dao.DryeringDao;
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
import bit.project.server.entity.Dryeringdryeringline;
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
@RequestMapping("/dryerings")
public class DryeringController{

    @Autowired
    private DryeringDao dryeringDao;

    @Autowired
    private AccessControlManager accessControlManager;

    @Autowired
    private CodeGenerator codeGenerator;

    private static final Sort DEFAULT_SORT = Sort.by(Sort.Direction.DESC, "tocreation");
    private final CodeGenerator.CodeGeneratorConfig codeConfig;

    public DryeringController(){
        codeConfig = new CodeGenerator.CodeGeneratorConfig("dryering");
        codeConfig.setColumnName("code");
        codeConfig.setLength(10);
        codeConfig.setPrefix("DR");
        codeConfig.setYearlyRenew(true);
    }

    @GetMapping
    public Page<Dryering> getAll(PageQuery pageQuery, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to get all dryerings", UsecaseList.SHOW_ALL_DRYERINGS);

        if(pageQuery.isEmptySearch()){
            return dryeringDao.findAll(PageRequest.of(pageQuery.getPage(), pageQuery.getSize(), DEFAULT_SORT));
        }

        String code = pageQuery.getSearchParam("code");

        List<Dryering> dryerings = dryeringDao.findAll(DEFAULT_SORT);
        Stream<Dryering> stream = dryerings.parallelStream();

        List<Dryering> filteredDryerings = stream.filter(dryering -> {
            if(code!=null)
                if(!dryering.getCode().toLowerCase().contains(code.toLowerCase())) return false;
            return true;
        }).collect(Collectors.toList());

        return PageHelper.getAsPage(filteredDryerings, pageQuery.getPage(), pageQuery.getSize());

    }

    @GetMapping("/basic")
    public Page<Dryering> getAllBasic(PageQuery pageQuery, HttpServletRequest request){
        accessControlManager.authorize(request, "No privilege to get all dryerings' basic data", UsecaseList.SHOW_ALL_DRYERINGS);
        return dryeringDao.findAllBasic(PageRequest.of(pageQuery.getPage(), pageQuery.getSize(), DEFAULT_SORT));
    }

    @GetMapping("/{id}")
    public Dryering get(@PathVariable Integer id, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to get dryering", UsecaseList.SHOW_DRYERING_DETAILS, UsecaseList.UPDATE_DRYERING);
        Optional<Dryering> optionalDryering = dryeringDao.findById(id);
        if(optionalDryering.isEmpty()) throw new ObjectNotFoundException("Dryering not found");
        return optionalDryering.get();
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Integer id, HttpServletRequest request){
        accessControlManager.authorize(request, "No privilege to delete dryerings", UsecaseList.DELETE_DRYERING);

        try{
            if(dryeringDao.existsById(id)) dryeringDao.deleteById(id);
        }catch (DataIntegrityViolationException | RollbackException e){
            throw new ConflictException("Cannot delete. Because this dryering already used in another module");
        }
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ResourceLink add(@RequestBody Dryering dryering, HttpServletRequest request) throws InterruptedException {
        User authUser = accessControlManager.authorize(request, "No privilege to add new dryering", UsecaseList.ADD_DRYERING);

        dryering.setTocreation(LocalDateTime.now());
        dryering.setCreator(authUser);
        dryering.setId(null);

        for(Dryeringdryeringline dryeringdryeringline : dryering.getDryeringdryeringlineList()) dryeringdryeringline.setDryering(dryering);

        EntityValidator.validate(dryering);

        PersistHelper.save(()->{
            dryering.setCode(codeGenerator.getNextId(codeConfig));
            return dryeringDao.save(dryering);
        });

        return new ResourceLink(dryering.getId(), "/dryerings/"+dryering.getId());
    }

    @PutMapping("/{id}")
    public ResourceLink update(@PathVariable Integer id, @RequestBody Dryering dryering, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to update dryering details", UsecaseList.UPDATE_DRYERING);

        Optional<Dryering> optionalDryering = dryeringDao.findById(id);
        if(optionalDryering.isEmpty()) throw new ObjectNotFoundException("Dryering not found");
        Dryering oldDryering = optionalDryering.get();

        dryering.setId(id);
        dryering.setCode(oldDryering.getCode());
        dryering.setCreator(oldDryering.getCreator());
        dryering.setTocreation(oldDryering.getTocreation());

        for(Dryeringdryeringline dryeringdryeringline : dryering.getDryeringdryeringlineList()) dryeringdryeringline.setDryering(dryering);

        EntityValidator.validate(dryering);

        dryering = dryeringDao.save(dryering);
        return new ResourceLink(dryering.getId(), "/dryerings/"+dryering.getId());
    }

}