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
import bit.project.server.entity.Permenting;
import bit.project.server.dao.PermentingDao;
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
import bit.project.server.entity.Permentingpermentingmachine;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import bit.project.server.util.exception.DataValidationException;
import bit.project.server.util.exception.ObjectNotFoundException;

@CrossOrigin
@RestController
@RequestMapping("/permentings")
public class PermentingController{

    @Autowired
    private PermentingDao permentingDao;

    @Autowired
    private AccessControlManager accessControlManager;

    @Autowired
    private CodeGenerator codeGenerator;

    private static final Sort DEFAULT_SORT = Sort.by(Sort.Direction.DESC, "tocreation");
    private final CodeGenerator.CodeGeneratorConfig codeConfig;

    public PermentingController(){
        codeConfig = new CodeGenerator.CodeGeneratorConfig("permenting");
        codeConfig.setColumnName("code");
        codeConfig.setLength(10);
        codeConfig.setPrefix("PE");
        codeConfig.setYearlyRenew(true);
    }

    @GetMapping
    public Page<Permenting> getAll(PageQuery pageQuery, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to get all permentings", UsecaseList.SHOW_ALL_PERMENTINGS);

        if(pageQuery.isEmptySearch()){
            return permentingDao.findAll(PageRequest.of(pageQuery.getPage(), pageQuery.getSize(), DEFAULT_SORT));
        }

        String code = pageQuery.getSearchParam("code");

        List<Permenting> permentings = permentingDao.findAll(DEFAULT_SORT);
        Stream<Permenting> stream = permentings.parallelStream();

        List<Permenting> filteredPermentings = stream.filter(permenting -> {
            if(code!=null)
                if(!permenting.getCode().toLowerCase().contains(code.toLowerCase())) return false;
            return true;
        }).collect(Collectors.toList());

        return PageHelper.getAsPage(filteredPermentings, pageQuery.getPage(), pageQuery.getSize());

    }

    @GetMapping("/basic")
    public Page<Permenting> getAllBasic(PageQuery pageQuery, HttpServletRequest request){
        accessControlManager.authorize(request, "No privilege to get all permentings' basic data", UsecaseList.SHOW_ALL_PERMENTINGS);
        return permentingDao.findAllBasic(PageRequest.of(pageQuery.getPage(), pageQuery.getSize(), DEFAULT_SORT));
    }

    @GetMapping("/{id}")
    public Permenting get(@PathVariable Integer id, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to get permenting", UsecaseList.SHOW_PERMENTING_DETAILS, UsecaseList.UPDATE_PERMENTING);
        Optional<Permenting> optionalPermenting = permentingDao.findById(id);
        if(optionalPermenting.isEmpty()) throw new ObjectNotFoundException("Permenting not found");
        return optionalPermenting.get();
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Integer id, HttpServletRequest request){
        accessControlManager.authorize(request, "No privilege to delete permentings", UsecaseList.DELETE_PERMENTING);

        try{
            if(permentingDao.existsById(id)) permentingDao.deleteById(id);
        }catch (DataIntegrityViolationException | RollbackException e){
            throw new ConflictException("Cannot delete. Because this permenting already used in another module");
        }
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ResourceLink add(@RequestBody Permenting permenting, HttpServletRequest request) throws InterruptedException {
        User authUser = accessControlManager.authorize(request, "No privilege to add new permenting", UsecaseList.ADD_PERMENTING);

        permenting.setTocreation(LocalDateTime.now());
        permenting.setCreator(authUser);
        permenting.setId(null);

        for(Permentingpermentingmachine permentingpermentingmachine : permenting.getPermentingpermentingmachineList()) permentingpermentingmachine.setPermenting(permenting);

        EntityValidator.validate(permenting);

        PersistHelper.save(()->{
            permenting.setCode(codeGenerator.getNextId(codeConfig));
            return permentingDao.save(permenting);
        });

        return new ResourceLink(permenting.getId(), "/permentings/"+permenting.getId());
    }

    @PutMapping("/{id}")
    public ResourceLink update(@PathVariable Integer id, @RequestBody Permenting permenting, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to update permenting details", UsecaseList.UPDATE_PERMENTING);

        Optional<Permenting> optionalPermenting = permentingDao.findById(id);
        if(optionalPermenting.isEmpty()) throw new ObjectNotFoundException("Permenting not found");
        Permenting oldPermenting = optionalPermenting.get();

        permenting.setId(id);
        permenting.setCode(oldPermenting.getCode());
        permenting.setCreator(oldPermenting.getCreator());
        permenting.setTocreation(oldPermenting.getTocreation());

        for(Permentingpermentingmachine permentingpermentingmachine : permenting.getPermentingpermentingmachineList()) permentingpermentingmachine.setPermenting(permenting);

        EntityValidator.validate(permenting);

        permenting = permentingDao.save(permenting);
        return new ResourceLink(permenting.getId(), "/permentings/"+permenting.getId());
    }

}