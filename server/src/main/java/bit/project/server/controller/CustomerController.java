package bit.project.server.controller;

import java.util.List;
import java.util.Optional;
import java.time.LocalDateTime;
import java.util.stream.Stream;
import java.util.stream.Collectors;
import bit.project.server.UsecaseList;
import bit.project.server.entity.User;
import bit.project.server.entity.Customer;
import bit.project.server.dao.CustomerDao;
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
@RequestMapping("/customers")
public class CustomerController{

    @Autowired
    private CustomerDao customerDao;

    @Autowired
    private AccessControlManager accessControlManager;

    @Autowired
    private CodeGenerator codeGenerator;

    private static final Sort DEFAULT_SORT = Sort.by(Sort.Direction.DESC, "tocreation");
    private final CodeGenerator.CodeGeneratorConfig codeConfig;

    public CustomerController(){
        codeConfig = new CodeGenerator.CodeGeneratorConfig("customer");
        codeConfig.setColumnName("code");
        codeConfig.setLength(10);
        codeConfig.setPrefix("CU");
        codeConfig.setYearlyRenew(true);
    }

    @GetMapping
    public Page<Customer> getAll(PageQuery pageQuery, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to get all customers", UsecaseList.SHOW_ALL_CUSTOMERS);

        if(pageQuery.isEmptySearch()){
            return customerDao.findAll(PageRequest.of(pageQuery.getPage(), pageQuery.getSize(), DEFAULT_SORT));
        }

        String code = pageQuery.getSearchParam("code");
        Integer customertypeId = pageQuery.getSearchParamAsInteger("customertype");
        String name = pageQuery.getSearchParam("name");

        List<Customer> customers = customerDao.findAll(DEFAULT_SORT);
        Stream<Customer> stream = customers.parallelStream();

        List<Customer> filteredCustomers = stream.filter(customer -> {
            if(code!=null)
                if(!customer.getCode().toLowerCase().contains(code.toLowerCase())) return false;
            if(customertypeId!=null)
                if(!customer.getCustomertype().getId().equals(customertypeId)) return false;
            if(name!=null)
                if(!customer.getName().toLowerCase().contains(name.toLowerCase())) return false;
            return true;
        }).collect(Collectors.toList());

        return PageHelper.getAsPage(filteredCustomers, pageQuery.getPage(), pageQuery.getSize());

    }

    @GetMapping("/basic")
    public Page<Customer> getAllBasic(PageQuery pageQuery, HttpServletRequest request){
        accessControlManager.authorize(request, "No privilege to get all customers' basic data", UsecaseList.SHOW_ALL_CUSTOMERS, UsecaseList.ADD_SALE, UsecaseList.UPDATE_SALE);
        return customerDao.findAllBasic(PageRequest.of(pageQuery.getPage(), pageQuery.getSize(), DEFAULT_SORT));
    }

    @GetMapping("/{id}")
    public Customer get(@PathVariable Integer id, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to get customer", UsecaseList.SHOW_CUSTOMER_DETAILS, UsecaseList.UPDATE_CUSTOMER);
        Optional<Customer> optionalCustomer = customerDao.findById(id);
        if(optionalCustomer.isEmpty()) throw new ObjectNotFoundException("Customer not found");
        return optionalCustomer.get();
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Integer id, HttpServletRequest request){
        accessControlManager.authorize(request, "No privilege to delete customers", UsecaseList.DELETE_CUSTOMER);

        try{
            if(customerDao.existsById(id)) customerDao.deleteById(id);
        }catch (DataIntegrityViolationException | RollbackException e){
            throw new ConflictException("Cannot delete. Because this customer already used in another module");
        }
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ResourceLink add(@RequestBody Customer customer, HttpServletRequest request) throws InterruptedException {
        User authUser = accessControlManager.authorize(request, "No privilege to add new customer", UsecaseList.ADD_CUSTOMER);

        customer.setTocreation(LocalDateTime.now());
        customer.setCreator(authUser);
        customer.setId(null);


        EntityValidator.validate(customer);

        PersistHelper.save(()->{
            customer.setCode(codeGenerator.getNextId(codeConfig));
            return customerDao.save(customer);
        });

        return new ResourceLink(customer.getId(), "/customers/"+customer.getId());
    }

    @PutMapping("/{id}")
    public ResourceLink update(@PathVariable Integer id, @RequestBody Customer customer, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to update customer details", UsecaseList.UPDATE_CUSTOMER);

        Optional<Customer> optionalCustomer = customerDao.findById(id);
        if(optionalCustomer.isEmpty()) throw new ObjectNotFoundException("Customer not found");
        Customer oldCustomer = optionalCustomer.get();

        customer.setId(id);
        customer.setCode(oldCustomer.getCode());
        customer.setCreator(oldCustomer.getCreator());
        customer.setTocreation(oldCustomer.getTocreation());


        EntityValidator.validate(customer);

        customer = customerDao.save(customer);
        return new ResourceLink(customer.getId(), "/customers/"+customer.getId());
    }

}