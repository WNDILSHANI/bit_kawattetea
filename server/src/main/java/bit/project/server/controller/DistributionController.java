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
import bit.project.server.entity.Distribution;
import bit.project.server.dao.DistributionDao;
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
@RequestMapping("/distributions")
public class DistributionController{

    @Autowired
    private DistributionDao distributionDao;

    @Autowired
    private AccessControlManager accessControlManager;

    @Autowired
    private CodeGenerator codeGenerator;

    private static final Sort DEFAULT_SORT = Sort.by(Sort.Direction.DESC, "tocreation");
    private final CodeGenerator.CodeGeneratorConfig codeConfig;

    public DistributionController(){
        codeConfig = new CodeGenerator.CodeGeneratorConfig("distribution");
        codeConfig.setColumnName("code");
        codeConfig.setLength(10);
        codeConfig.setPrefix("DI");
        codeConfig.setYearlyRenew(true);
    }

    @GetMapping
    public Page<Distribution> getAll(PageQuery pageQuery, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to get all distributions", UsecaseList.SHOW_ALL_DISTRIBUTIONS);

        if(pageQuery.isEmptySearch()){
            return distributionDao.findAll(PageRequest.of(pageQuery.getPage(), pageQuery.getSize(), DEFAULT_SORT));
        }

        String code = pageQuery.getSearchParam("code");

        List<Distribution> distributions = distributionDao.findAll(DEFAULT_SORT);
        Stream<Distribution> stream = distributions.parallelStream();

        List<Distribution> filteredDistributions = stream.filter(distribution -> {
            if(code!=null)
                if(!distribution.getCode().toLowerCase().contains(code.toLowerCase())) return false;
            return true;
        }).collect(Collectors.toList());

        return PageHelper.getAsPage(filteredDistributions, pageQuery.getPage(), pageQuery.getSize());

    }

    @GetMapping("/basic")
    public Page<Distribution> getAllBasic(PageQuery pageQuery, HttpServletRequest request){
        accessControlManager.authorize(request, "No privilege to get all distributions' basic data", UsecaseList.SHOW_ALL_DISTRIBUTIONS);
        return distributionDao.findAllBasic(PageRequest.of(pageQuery.getPage(), pageQuery.getSize(), DEFAULT_SORT));
    }

    @GetMapping("/{id}")
    public Distribution get(@PathVariable Integer id, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to get distribution", UsecaseList.SHOW_DISTRIBUTION_DETAILS, UsecaseList.UPDATE_DISTRIBUTION);
        Optional<Distribution> optionalDistribution = distributionDao.findById(id);
        if(optionalDistribution.isEmpty()) throw new ObjectNotFoundException("Distribution not found");
        return optionalDistribution.get();
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Integer id, HttpServletRequest request){
        accessControlManager.authorize(request, "No privilege to delete distributions", UsecaseList.DELETE_DISTRIBUTION);

        try{
            if(distributionDao.existsById(id)) distributionDao.deleteById(id);
        }catch (DataIntegrityViolationException | RollbackException e){
            throw new ConflictException("Cannot delete. Because this distribution already used in another module");
        }
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ResourceLink add(@RequestBody Distribution distribution, HttpServletRequest request) throws InterruptedException {
        User authUser = accessControlManager.authorize(request, "No privilege to add new distribution", UsecaseList.ADD_DISTRIBUTION);

        distribution.setTocreation(LocalDateTime.now());
        distribution.setCreator(authUser);
        distribution.setId(null);


        EntityValidator.validate(distribution);

        PersistHelper.save(()->{
            distribution.setCode(codeGenerator.getNextId(codeConfig));
            return distributionDao.save(distribution);
        });

        return new ResourceLink(distribution.getId(), "/distributions/"+distribution.getId());
    }

    @PutMapping("/{id}")
    public ResourceLink update(@PathVariable Integer id, @RequestBody Distribution distribution, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to update distribution details", UsecaseList.UPDATE_DISTRIBUTION);

        Optional<Distribution> optionalDistribution = distributionDao.findById(id);
        if(optionalDistribution.isEmpty()) throw new ObjectNotFoundException("Distribution not found");
        Distribution oldDistribution = optionalDistribution.get();

        distribution.setId(id);
        distribution.setCode(oldDistribution.getCode());
        distribution.setCreator(oldDistribution.getCreator());
        distribution.setTocreation(oldDistribution.getTocreation());


        EntityValidator.validate(distribution);

        distribution = distributionDao.save(distribution);
        return new ResourceLink(distribution.getId(), "/distributions/"+distribution.getId());
    }

}