package bit.project.server.controller;

import java.util.List;
import java.util.Optional;
import java.time.LocalDateTime;
import java.util.stream.Stream;
import java.util.stream.Collectors;
import bit.project.server.UsecaseList;
import bit.project.server.entity.User;
import bit.project.server.entity.Tasting;
import bit.project.server.dao.TastingDao;
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
@RequestMapping("/tastings")
public class TastingController{

    @Autowired
    private TastingDao tastingDao;

    @Autowired
    private AccessControlManager accessControlManager;

    @Autowired
    private CodeGenerator codeGenerator;

    private static final Sort DEFAULT_SORT = Sort.by(Sort.Direction.DESC, "tocreation");
    private final CodeGenerator.CodeGeneratorConfig codeConfig;

    public TastingController(){
        codeConfig = new CodeGenerator.CodeGeneratorConfig("tasting");
        codeConfig.setColumnName("code");
        codeConfig.setLength(10);
        codeConfig.setPrefix("TA");
        codeConfig.setYearlyRenew(true);
    }

    @GetMapping
    public Page<Tasting> getAll(PageQuery pageQuery, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to get all tastings", UsecaseList.SHOW_ALL_TASTINGS);

        if(pageQuery.isEmptySearch()){
            return tastingDao.findAll(PageRequest.of(pageQuery.getPage(), pageQuery.getSize(), DEFAULT_SORT));
        }

        String code = pageQuery.getSearchParam("code");

        List<Tasting> tastings = tastingDao.findAll(DEFAULT_SORT);
        Stream<Tasting> stream = tastings.parallelStream();

        List<Tasting> filteredTastings = stream.filter(tasting -> {
            if(code!=null)
                if(!tasting.getCode().toLowerCase().contains(code.toLowerCase())) return false;
            return true;
        }).collect(Collectors.toList());

        return PageHelper.getAsPage(filteredTastings, pageQuery.getPage(), pageQuery.getSize());

    }

    @GetMapping("/basic")
    public Page<Tasting> getAllBasic(PageQuery pageQuery, HttpServletRequest request){
        accessControlManager.authorize(request, "No privilege to get all tastings' basic data", UsecaseList.SHOW_ALL_TASTINGS);
        return tastingDao.findAllBasic(PageRequest.of(pageQuery.getPage(), pageQuery.getSize(), DEFAULT_SORT));
    }

    @GetMapping("/{id}")
    public Tasting get(@PathVariable Integer id, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to get tasting", UsecaseList.SHOW_TASTING_DETAILS, UsecaseList.UPDATE_TASTING);
        Optional<Tasting> optionalTasting = tastingDao.findById(id);
        if(optionalTasting.isEmpty()) throw new ObjectNotFoundException("Tasting not found");
        return optionalTasting.get();
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Integer id, HttpServletRequest request){
        accessControlManager.authorize(request, "No privilege to delete tastings", UsecaseList.DELETE_TASTING);

        try{
            if(tastingDao.existsById(id)) tastingDao.deleteById(id);
        }catch (DataIntegrityViolationException | RollbackException e){
            throw new ConflictException("Cannot delete. Because this tasting already used in another module");
        }
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ResourceLink add(@RequestBody Tasting tasting, HttpServletRequest request) throws InterruptedException {
        User authUser = accessControlManager.authorize(request, "No privilege to add new tasting", UsecaseList.ADD_TASTING);

        tasting.setTocreation(LocalDateTime.now());
        tasting.setCreator(authUser);
        tasting.setId(null);


        EntityValidator.validate(tasting);

        PersistHelper.save(()->{
            tasting.setCode(codeGenerator.getNextId(codeConfig));
            return tastingDao.save(tasting);
        });

        return new ResourceLink(tasting.getId(), "/tastings/"+tasting.getId());
    }

    @PutMapping("/{id}")
    public ResourceLink update(@PathVariable Integer id, @RequestBody Tasting tasting, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to update tasting details", UsecaseList.UPDATE_TASTING);

        Optional<Tasting> optionalTasting = tastingDao.findById(id);
        if(optionalTasting.isEmpty()) throw new ObjectNotFoundException("Tasting not found");
        Tasting oldTasting = optionalTasting.get();

        tasting.setId(id);
        tasting.setCode(oldTasting.getCode());
        tasting.setCreator(oldTasting.getCreator());
        tasting.setTocreation(oldTasting.getTocreation());


        EntityValidator.validate(tasting);

        tasting = tastingDao.save(tasting);
        return new ResourceLink(tasting.getId(), "/tastings/"+tasting.getId());
    }

}