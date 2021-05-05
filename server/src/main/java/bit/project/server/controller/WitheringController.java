package bit.project.server.controller;

import java.util.List;
import java.util.Optional;
import java.time.LocalDateTime;
import java.util.stream.Stream;
import java.util.stream.Collectors;
import bit.project.server.UsecaseList;
import bit.project.server.entity.User;
import bit.project.server.entity.Withering;
import bit.project.server.dao.WitheringDao;
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
import bit.project.server.entity.Witheringwitherline;
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
@RequestMapping("/witherings")
public class WitheringController{

    @Autowired
    private WitheringDao witheringDao;

    @Autowired
    private AccessControlManager accessControlManager;

    @Autowired
    private CodeGenerator codeGenerator;

    private static final Sort DEFAULT_SORT = Sort.by(Sort.Direction.DESC, "tocreation");
    private final CodeGenerator.CodeGeneratorConfig codeConfig;

    public WitheringController(){
        codeConfig = new CodeGenerator.CodeGeneratorConfig("withering");
        codeConfig.setColumnName("code");
        codeConfig.setLength(10);
        codeConfig.setPrefix("WI");
        codeConfig.setYearlyRenew(true);
    }

    @GetMapping
    public Page<Withering> getAll(PageQuery pageQuery, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to get all witherings", UsecaseList.SHOW_ALL_WITHERINGS);

        if(pageQuery.isEmptySearch()){
            return witheringDao.findAll(PageRequest.of(pageQuery.getPage(), pageQuery.getSize(), DEFAULT_SORT));
        }

        String code = pageQuery.getSearchParam("code");

        List<Withering> witherings = witheringDao.findAll(DEFAULT_SORT);
        Stream<Withering> stream = witherings.parallelStream();

        List<Withering> filteredWitherings = stream.filter(withering -> {
            if(code!=null)
                if(!withering.getCode().toLowerCase().contains(code.toLowerCase())) return false;
            return true;
        }).collect(Collectors.toList());

        return PageHelper.getAsPage(filteredWitherings, pageQuery.getPage(), pageQuery.getSize());

    }

    @GetMapping("/basic")
    public Page<Withering> getAllBasic(PageQuery pageQuery, HttpServletRequest request){
        accessControlManager.authorize(request, "No privilege to get all witherings' basic data", UsecaseList.SHOW_ALL_WITHERINGS);
        return witheringDao.findAllBasic(PageRequest.of(pageQuery.getPage(), pageQuery.getSize(), DEFAULT_SORT));
    }

    @GetMapping("/{id}")
    public Withering get(@PathVariable Integer id, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to get withering", UsecaseList.SHOW_WITHERING_DETAILS, UsecaseList.UPDATE_WITHERING);
        Optional<Withering> optionalWithering = witheringDao.findById(id);
        if(optionalWithering.isEmpty()) throw new ObjectNotFoundException("Withering not found");
        return optionalWithering.get();
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Integer id, HttpServletRequest request){
        accessControlManager.authorize(request, "No privilege to delete witherings", UsecaseList.DELETE_WITHERING);

        try{
            if(witheringDao.existsById(id)) witheringDao.deleteById(id);
        }catch (DataIntegrityViolationException | RollbackException e){
            throw new ConflictException("Cannot delete. Because this withering already used in another module");
        }
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ResourceLink add(@RequestBody Withering withering, HttpServletRequest request) throws InterruptedException {
        User authUser = accessControlManager.authorize(request, "No privilege to add new withering", UsecaseList.ADD_WITHERING);

        withering.setTocreation(LocalDateTime.now());
        withering.setCreator(authUser);
        withering.setId(null);

        for(Witheringwitherline witheringwitherline : withering.getWitheringwitherlineList()) witheringwitherline.setWithering(withering);

        EntityValidator.validate(withering);

        PersistHelper.save(()->{
            withering.setCode(codeGenerator.getNextId(codeConfig));
            return witheringDao.save(withering);
        });

        return new ResourceLink(withering.getId(), "/witherings/"+withering.getId());
    }

    @PutMapping("/{id}")
    public ResourceLink update(@PathVariable Integer id, @RequestBody Withering withering, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to update withering details", UsecaseList.UPDATE_WITHERING);

        Optional<Withering> optionalWithering = witheringDao.findById(id);
        if(optionalWithering.isEmpty()) throw new ObjectNotFoundException("Withering not found");
        Withering oldWithering = optionalWithering.get();

        withering.setId(id);
        withering.setCode(oldWithering.getCode());
        withering.setCreator(oldWithering.getCreator());
        withering.setTocreation(oldWithering.getTocreation());

        for(Witheringwitherline witheringwitherline : withering.getWitheringwitherlineList()) witheringwitherline.setWithering(withering);

        EntityValidator.validate(withering);

        withering = witheringDao.save(withering);
        return new ResourceLink(withering.getId(), "/witherings/"+withering.getId());
    }

}