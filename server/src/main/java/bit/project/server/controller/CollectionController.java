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
import bit.project.server.entity.Collection;
import bit.project.server.dao.CollectionDao;
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
@RequestMapping("/collections")
public class CollectionController{

    @Autowired
    private CollectionDao collectionDao;

    @Autowired
    private AccessControlManager accessControlManager;

    @Autowired
    private CodeGenerator codeGenerator;

    private static final Sort DEFAULT_SORT = Sort.by(Sort.Direction.DESC, "tocreation");
    private final CodeGenerator.CodeGeneratorConfig codeConfig;

    public CollectionController(){
        codeConfig = new CodeGenerator.CodeGeneratorConfig("collection");
        codeConfig.setColumnName("code");
        codeConfig.setLength(10);
        codeConfig.setPrefix("CO");
        codeConfig.setYearlyRenew(true);
    }

    @GetMapping
    public Page<Collection> getAll(PageQuery pageQuery, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to get all collections", UsecaseList.SHOW_ALL_COLLECTIONS);

        if(pageQuery.isEmptySearch()){
            return collectionDao.findAll(PageRequest.of(pageQuery.getPage(), pageQuery.getSize(), DEFAULT_SORT));
        }

        String code = pageQuery.getSearchParam("code");

        List<Collection> collections = collectionDao.findAll(DEFAULT_SORT);
        Stream<Collection> stream = collections.parallelStream();

        List<Collection> filteredCollections = stream.filter(collection -> {
            if(code!=null)
                if(!collection.getCode().toLowerCase().contains(code.toLowerCase())) return false;
            return true;
        }).collect(Collectors.toList());

        return PageHelper.getAsPage(filteredCollections, pageQuery.getPage(), pageQuery.getSize());

    }

    @GetMapping("/basic")
    public Page<Collection> getAllBasic(PageQuery pageQuery, HttpServletRequest request){
        accessControlManager.authorize(request, "No privilege to get all collections' basic data", UsecaseList.SHOW_ALL_COLLECTIONS, UsecaseList.ADD_CATEGORIZATION, UsecaseList.UPDATE_CATEGORIZATION, UsecaseList.ADD_SUPPLIERPAYMENT, UsecaseList.UPDATE_SUPPLIERPAYMENT);
        return collectionDao.findAllBasic(PageRequest.of(pageQuery.getPage(), pageQuery.getSize(), DEFAULT_SORT));
    }

    @GetMapping("/{id}")
    public Collection get(@PathVariable Integer id, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to get collection", UsecaseList.SHOW_COLLECTION_DETAILS, UsecaseList.UPDATE_COLLECTION);
        Optional<Collection> optionalCollection = collectionDao.findById(id);
        if(optionalCollection.isEmpty()) throw new ObjectNotFoundException("Collection not found");
        return optionalCollection.get();
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Integer id, HttpServletRequest request){
        accessControlManager.authorize(request, "No privilege to delete collections", UsecaseList.DELETE_COLLECTION);

        try{
            if(collectionDao.existsById(id)) collectionDao.deleteById(id);
        }catch (DataIntegrityViolationException | RollbackException e){
            throw new ConflictException("Cannot delete. Because this collection already used in another module");
        }
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ResourceLink add(@RequestBody Collection collection, HttpServletRequest request) throws InterruptedException {
        User authUser = accessControlManager.authorize(request, "No privilege to add new collection", UsecaseList.ADD_COLLECTION);

        collection.setTocreation(LocalDateTime.now());
        collection.setCreator(authUser);
        collection.setId(null);


        EntityValidator.validate(collection);

        PersistHelper.save(()->{
            collection.setCode(codeGenerator.getNextId(codeConfig));
            return collectionDao.save(collection);
        });

        return new ResourceLink(collection.getId(), "/collections/"+collection.getId());
    }

    @PutMapping("/{id}")
    public ResourceLink update(@PathVariable Integer id, @RequestBody Collection collection, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to update collection details", UsecaseList.UPDATE_COLLECTION);

        Optional<Collection> optionalCollection = collectionDao.findById(id);
        if(optionalCollection.isEmpty()) throw new ObjectNotFoundException("Collection not found");
        Collection oldCollection = optionalCollection.get();

        collection.setId(id);
        collection.setCode(oldCollection.getCode());
        collection.setCreator(oldCollection.getCreator());
        collection.setTocreation(oldCollection.getTocreation());


        EntityValidator.validate(collection);

        collection = collectionDao.save(collection);
        return new ResourceLink(collection.getId(), "/collections/"+collection.getId());
    }

}