package bit.project.server.controller;

import java.util.List;
import java.util.Optional;
import java.time.LocalDateTime;
import java.util.stream.Stream;
import java.util.stream.Collectors;
import bit.project.server.UsecaseList;
import bit.project.server.entity.User;
import bit.project.server.entity.Grinding;
import bit.project.server.dao.GrindingDao;
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
import bit.project.server.entity.Grindinggrindingmachine;
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
@RequestMapping("/grindings")
public class GrindingController{

    @Autowired
    private GrindingDao grindingDao;

    @Autowired
    private AccessControlManager accessControlManager;

    @Autowired
    private CodeGenerator codeGenerator;

    private static final Sort DEFAULT_SORT = Sort.by(Sort.Direction.DESC, "tocreation");
    private final CodeGenerator.CodeGeneratorConfig codeConfig;

    public GrindingController(){
        codeConfig = new CodeGenerator.CodeGeneratorConfig("grinding");
        codeConfig.setColumnName("code");
        codeConfig.setLength(10);
        codeConfig.setPrefix("GR");
        codeConfig.setYearlyRenew(true);
    }

    @GetMapping
    public Page<Grinding> getAll(PageQuery pageQuery, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to get all grindings", UsecaseList.SHOW_ALL_GRINDINGS);

        if(pageQuery.isEmptySearch()){
            return grindingDao.findAll(PageRequest.of(pageQuery.getPage(), pageQuery.getSize(), DEFAULT_SORT));
        }

        String code = pageQuery.getSearchParam("code");

        List<Grinding> grindings = grindingDao.findAll(DEFAULT_SORT);
        Stream<Grinding> stream = grindings.parallelStream();

        List<Grinding> filteredGrindings = stream.filter(grinding -> {
            if(code!=null)
                if(!grinding.getCode().toLowerCase().contains(code.toLowerCase())) return false;
            return true;
        }).collect(Collectors.toList());

        return PageHelper.getAsPage(filteredGrindings, pageQuery.getPage(), pageQuery.getSize());

    }

    @GetMapping("/basic")
    public Page<Grinding> getAllBasic(PageQuery pageQuery, HttpServletRequest request){
        accessControlManager.authorize(request, "No privilege to get all grindings' basic data", UsecaseList.SHOW_ALL_GRINDINGS);
        return grindingDao.findAllBasic(PageRequest.of(pageQuery.getPage(), pageQuery.getSize(), DEFAULT_SORT));
    }

    @GetMapping("/{id}")
    public Grinding get(@PathVariable Integer id, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to get grinding", UsecaseList.SHOW_GRINDING_DETAILS, UsecaseList.UPDATE_GRINDING);
        Optional<Grinding> optionalGrinding = grindingDao.findById(id);
        if(optionalGrinding.isEmpty()) throw new ObjectNotFoundException("Grinding not found");
        return optionalGrinding.get();
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Integer id, HttpServletRequest request){
        accessControlManager.authorize(request, "No privilege to delete grindings", UsecaseList.DELETE_GRINDING);

        try{
            if(grindingDao.existsById(id)) grindingDao.deleteById(id);
        }catch (DataIntegrityViolationException | RollbackException e){
            throw new ConflictException("Cannot delete. Because this grinding already used in another module");
        }
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ResourceLink add(@RequestBody Grinding grinding, HttpServletRequest request) throws InterruptedException {
        User authUser = accessControlManager.authorize(request, "No privilege to add new grinding", UsecaseList.ADD_GRINDING);

        grinding.setTocreation(LocalDateTime.now());
        grinding.setCreator(authUser);
        grinding.setId(null);

        for(Grindinggrindingmachine grindinggrindingmachine : grinding.getGrindinggrindingmachineList()) grindinggrindingmachine.setGrinding(grinding);

        EntityValidator.validate(grinding);

        PersistHelper.save(()->{
            grinding.setCode(codeGenerator.getNextId(codeConfig));
            return grindingDao.save(grinding);
        });

        return new ResourceLink(grinding.getId(), "/grindings/"+grinding.getId());
    }

    @PutMapping("/{id}")
    public ResourceLink update(@PathVariable Integer id, @RequestBody Grinding grinding, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to update grinding details", UsecaseList.UPDATE_GRINDING);

        Optional<Grinding> optionalGrinding = grindingDao.findById(id);
        if(optionalGrinding.isEmpty()) throw new ObjectNotFoundException("Grinding not found");
        Grinding oldGrinding = optionalGrinding.get();

        grinding.setId(id);
        grinding.setCode(oldGrinding.getCode());
        grinding.setCreator(oldGrinding.getCreator());
        grinding.setTocreation(oldGrinding.getTocreation());

        for(Grindinggrindingmachine grindinggrindingmachine : grinding.getGrindinggrindingmachineList()) grindinggrindingmachine.setGrinding(grinding);

        EntityValidator.validate(grinding);

        grinding = grindingDao.save(grinding);
        return new ResourceLink(grinding.getId(), "/grindings/"+grinding.getId());
    }

}