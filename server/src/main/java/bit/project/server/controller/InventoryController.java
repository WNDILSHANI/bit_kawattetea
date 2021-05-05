package bit.project.server.controller;

import java.util.List;
import java.util.Optional;
import java.time.LocalDateTime;
import java.util.stream.Stream;
import java.util.stream.Collectors;
import bit.project.server.UsecaseList;
import bit.project.server.entity.User;
import bit.project.server.entity.Inventory;
import bit.project.server.dao.InventoryDao;
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
@RequestMapping("/inventories")
public class InventoryController{

    @Autowired
    private InventoryDao inventoryDao;

    @Autowired
    private AccessControlManager accessControlManager;

    @Autowired
    private CodeGenerator codeGenerator;

    private static final Sort DEFAULT_SORT = Sort.by(Sort.Direction.DESC, "tocreation");
    private final CodeGenerator.CodeGeneratorConfig codeConfig;

    public InventoryController(){
        codeConfig = new CodeGenerator.CodeGeneratorConfig("inventory");
        codeConfig.setColumnName("code");
        codeConfig.setLength(10);
        codeConfig.setPrefix("IN");
        codeConfig.setYearlyRenew(true);
    }

    @GetMapping
    public Page<Inventory> getAll(PageQuery pageQuery, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to get all inventories", UsecaseList.SHOW_ALL_INVENTORIES);

        if(pageQuery.isEmptySearch()){
            return inventoryDao.findAll(PageRequest.of(pageQuery.getPage(), pageQuery.getSize(), DEFAULT_SORT));
        }

        String code = pageQuery.getSearchParam("code");

        List<Inventory> inventories = inventoryDao.findAll(DEFAULT_SORT);
        Stream<Inventory> stream = inventories.parallelStream();

        List<Inventory> filteredInventories = stream.filter(inventory -> {
            if(code!=null)
                if(!inventory.getCode().toLowerCase().contains(code.toLowerCase())) return false;
            return true;
        }).collect(Collectors.toList());

        return PageHelper.getAsPage(filteredInventories, pageQuery.getPage(), pageQuery.getSize());

    }

    @GetMapping("/basic")
    public Page<Inventory> getAllBasic(PageQuery pageQuery, HttpServletRequest request){
        accessControlManager.authorize(request, "No privilege to get all inventories' basic data", UsecaseList.SHOW_ALL_INVENTORIES);
        return inventoryDao.findAllBasic(PageRequest.of(pageQuery.getPage(), pageQuery.getSize(), DEFAULT_SORT));
    }

    @GetMapping("/{id}")
    public Inventory get(@PathVariable Integer id, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to get inventory", UsecaseList.SHOW_INVENTORY_DETAILS, UsecaseList.UPDATE_INVENTORY);
        Optional<Inventory> optionalInventory = inventoryDao.findById(id);
        if(optionalInventory.isEmpty()) throw new ObjectNotFoundException("Inventory not found");
        return optionalInventory.get();
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Integer id, HttpServletRequest request){
        accessControlManager.authorize(request, "No privilege to delete inventories", UsecaseList.DELETE_INVENTORY);

        try{
            if(inventoryDao.existsById(id)) inventoryDao.deleteById(id);
        }catch (DataIntegrityViolationException | RollbackException e){
            throw new ConflictException("Cannot delete. Because this inventory already used in another module");
        }
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ResourceLink add(@RequestBody Inventory inventory, HttpServletRequest request) throws InterruptedException {
        User authUser = accessControlManager.authorize(request, "No privilege to add new inventory", UsecaseList.ADD_INVENTORY);

        inventory.setTocreation(LocalDateTime.now());
        inventory.setCreator(authUser);
        inventory.setId(null);


        EntityValidator.validate(inventory);

        PersistHelper.save(()->{
            inventory.setCode(codeGenerator.getNextId(codeConfig));
            return inventoryDao.save(inventory);
        });

        return new ResourceLink(inventory.getId(), "/inventories/"+inventory.getId());
    }

    @PutMapping("/{id}")
    public ResourceLink update(@PathVariable Integer id, @RequestBody Inventory inventory, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to update inventory details", UsecaseList.UPDATE_INVENTORY);

        Optional<Inventory> optionalInventory = inventoryDao.findById(id);
        if(optionalInventory.isEmpty()) throw new ObjectNotFoundException("Inventory not found");
        Inventory oldInventory = optionalInventory.get();

        inventory.setId(id);
        inventory.setCode(oldInventory.getCode());
        inventory.setCreator(oldInventory.getCreator());
        inventory.setTocreation(oldInventory.getTocreation());


        EntityValidator.validate(inventory);

        inventory = inventoryDao.save(inventory);
        return new ResourceLink(inventory.getId(), "/inventories/"+inventory.getId());
    }

}