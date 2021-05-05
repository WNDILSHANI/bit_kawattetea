package bit.project.server.controller;

import java.util.List;
import java.util.Optional;
import java.time.LocalDateTime;
import java.util.stream.Stream;
import java.util.stream.Collectors;
import bit.project.server.UsecaseList;
import bit.project.server.entity.User;
import bit.project.server.entity.Packing;
import bit.project.server.dao.PackingDao;
import org.springframework.http.HttpStatus;
import javax.persistence.RollbackException;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Page;
import javax.servlet.http.HttpServletRequest;
import bit.project.server.util.dto.PageQuery;
import bit.project.server.util.dto.ResourceLink;
import bit.project.server.entity.Packingproduct;
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
@RequestMapping("/packings")
public class PackingController{

    @Autowired
    private PackingDao packingDao;

    @Autowired
    private AccessControlManager accessControlManager;

    @Autowired
    private CodeGenerator codeGenerator;

    private static final Sort DEFAULT_SORT = Sort.by(Sort.Direction.DESC, "tocreation");
    private final CodeGenerator.CodeGeneratorConfig codeConfig;

    public PackingController(){
        codeConfig = new CodeGenerator.CodeGeneratorConfig("packing");
        codeConfig.setColumnName("code");
        codeConfig.setLength(10);
        codeConfig.setPrefix("PA");
        codeConfig.setYearlyRenew(true);
    }

    @GetMapping
    public Page<Packing> getAll(PageQuery pageQuery, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to get all packings", UsecaseList.SHOW_ALL_PACKINGS);

        if(pageQuery.isEmptySearch()){
            return packingDao.findAll(PageRequest.of(pageQuery.getPage(), pageQuery.getSize(), DEFAULT_SORT));
        }

        String code = pageQuery.getSearchParam("code");

        List<Packing> packings = packingDao.findAll(DEFAULT_SORT);
        Stream<Packing> stream = packings.parallelStream();

        List<Packing> filteredPackings = stream.filter(packing -> {
            if(code!=null)
                if(!packing.getCode().toLowerCase().contains(code.toLowerCase())) return false;
            return true;
        }).collect(Collectors.toList());

        return PageHelper.getAsPage(filteredPackings, pageQuery.getPage(), pageQuery.getSize());

    }

    @GetMapping("/basic")
    public Page<Packing> getAllBasic(PageQuery pageQuery, HttpServletRequest request){
        accessControlManager.authorize(request, "No privilege to get all packings' basic data", UsecaseList.SHOW_ALL_PACKINGS);
        return packingDao.findAllBasic(PageRequest.of(pageQuery.getPage(), pageQuery.getSize(), DEFAULT_SORT));
    }

    @GetMapping("/{id}")
    public Packing get(@PathVariable Integer id, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to get packing", UsecaseList.SHOW_PACKING_DETAILS, UsecaseList.UPDATE_PACKING);
        Optional<Packing> optionalPacking = packingDao.findById(id);
        if(optionalPacking.isEmpty()) throw new ObjectNotFoundException("Packing not found");
        return optionalPacking.get();
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Integer id, HttpServletRequest request){
        accessControlManager.authorize(request, "No privilege to delete packings", UsecaseList.DELETE_PACKING);

        try{
            if(packingDao.existsById(id)) packingDao.deleteById(id);
        }catch (DataIntegrityViolationException | RollbackException e){
            throw new ConflictException("Cannot delete. Because this packing already used in another module");
        }
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ResourceLink add(@RequestBody Packing packing, HttpServletRequest request) throws InterruptedException {
        User authUser = accessControlManager.authorize(request, "No privilege to add new packing", UsecaseList.ADD_PACKING);

        packing.setTocreation(LocalDateTime.now());
        packing.setCreator(authUser);
        packing.setId(null);

        for(Packingproduct packingproduct : packing.getPackingproductList()) packingproduct.setPacking(packing);

        EntityValidator.validate(packing);

        PersistHelper.save(()->{
            packing.setCode(codeGenerator.getNextId(codeConfig));
            return packingDao.save(packing);
        });

        return new ResourceLink(packing.getId(), "/packings/"+packing.getId());
    }

    @PutMapping("/{id}")
    public ResourceLink update(@PathVariable Integer id, @RequestBody Packing packing, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to update packing details", UsecaseList.UPDATE_PACKING);

        Optional<Packing> optionalPacking = packingDao.findById(id);
        if(optionalPacking.isEmpty()) throw new ObjectNotFoundException("Packing not found");
        Packing oldPacking = optionalPacking.get();

        packing.setId(id);
        packing.setCode(oldPacking.getCode());
        packing.setCreator(oldPacking.getCreator());
        packing.setTocreation(oldPacking.getTocreation());

        for(Packingproduct packingproduct : packing.getPackingproductList()) packingproduct.setPacking(packing);

        EntityValidator.validate(packing);

        packing = packingDao.save(packing);
        return new ResourceLink(packing.getId(), "/packings/"+packing.getId());
    }

}