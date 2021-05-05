package bit.project.server.controller;

import java.util.List;
import java.util.Optional;
import java.time.LocalDateTime;
import java.util.stream.Stream;
import java.util.stream.Collectors;
import bit.project.server.UsecaseList;
import bit.project.server.entity.User;
import bit.project.server.entity.Product;
import bit.project.server.dao.ProductDao;
import org.springframework.http.HttpStatus;
import javax.persistence.RollbackException;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Page;
import javax.servlet.http.HttpServletRequest;
import bit.project.server.util.dto.PageQuery;
import bit.project.server.entity.Productstatus;
import bit.project.server.util.dto.ResourceLink;
import org.springframework.web.bind.annotation.*;
import bit.project.server.util.helper.PageHelper;
import bit.project.server.entity.Productmaterial;
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
@RequestMapping("/products")
public class ProductController{

    @Autowired
    private ProductDao productDao;

    @Autowired
    private AccessControlManager accessControlManager;

    @Autowired
    private CodeGenerator codeGenerator;

    private static final Sort DEFAULT_SORT = Sort.by(Sort.Direction.DESC, "tocreation");
    private final CodeGenerator.CodeGeneratorConfig codeConfig;

    public ProductController(){
        codeConfig = new CodeGenerator.CodeGeneratorConfig("product");
        codeConfig.setColumnName("code");
        codeConfig.setLength(10);
        codeConfig.setPrefix("PR");
        codeConfig.setYearlyRenew(true);
    }

    @GetMapping
    public Page<Product> getAll(PageQuery pageQuery, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to get all products", UsecaseList.SHOW_ALL_PRODUCTS);

        if(pageQuery.isEmptySearch()){
            return productDao.findAll(PageRequest.of(pageQuery.getPage(), pageQuery.getSize(), DEFAULT_SORT));
        }

        String code = pageQuery.getSearchParam("code");
        String name = pageQuery.getSearchParam("name");
        Integer productstatusId = pageQuery.getSearchParamAsInteger("productstatus");

        List<Product> products = productDao.findAll(DEFAULT_SORT);
        Stream<Product> stream = products.parallelStream();

        List<Product> filteredProducts = stream.filter(product -> {
            if(code!=null)
                if(!product.getCode().toLowerCase().contains(code.toLowerCase())) return false;
            if(name!=null)
                if(!product.getName().toLowerCase().contains(name.toLowerCase())) return false;
            if(productstatusId!=null)
                if(!product.getProductstatus().getId().equals(productstatusId)) return false;
            return true;
        }).collect(Collectors.toList());

        return PageHelper.getAsPage(filteredProducts, pageQuery.getPage(), pageQuery.getSize());

    }

    @GetMapping("/basic")
    public Page<Product> getAllBasic(PageQuery pageQuery, HttpServletRequest request){
        accessControlManager.authorize(request, "No privilege to get all products' basic data", UsecaseList.SHOW_ALL_PRODUCTS, UsecaseList.ADD_INVENTORY, UsecaseList.UPDATE_INVENTORY);
        return productDao.findAllBasic(PageRequest.of(pageQuery.getPage(), pageQuery.getSize(), DEFAULT_SORT));
    }

    @GetMapping("/{id}")
    public Product get(@PathVariable Integer id, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to get product", UsecaseList.SHOW_PRODUCT_DETAILS, UsecaseList.UPDATE_PRODUCT);
        Optional<Product> optionalProduct = productDao.findById(id);
        if(optionalProduct.isEmpty()) throw new ObjectNotFoundException("Product not found");
        return optionalProduct.get();
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Integer id, HttpServletRequest request){
        accessControlManager.authorize(request, "No privilege to delete products", UsecaseList.DELETE_PRODUCT);

        try{
            if(productDao.existsById(id)) productDao.deleteById(id);
        }catch (DataIntegrityViolationException | RollbackException e){
            throw new ConflictException("Cannot delete. Because this product already used in another module");
        }
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ResourceLink add(@RequestBody Product product, HttpServletRequest request) throws InterruptedException {
        User authUser = accessControlManager.authorize(request, "No privilege to add new product", UsecaseList.ADD_PRODUCT);

        product.setTocreation(LocalDateTime.now());
        product.setCreator(authUser);
        product.setId(null);
        product.setProductstatus(new Productstatus(1));;

        for(Productmaterial productmaterial : product.getProductmaterialList()) productmaterial.setProduct(product);

        EntityValidator.validate(product);

        PersistHelper.save(()->{
            product.setCode(codeGenerator.getNextId(codeConfig));
            return productDao.save(product);
        });

        return new ResourceLink(product.getId(), "/products/"+product.getId());
    }

    @PutMapping("/{id}")
    public ResourceLink update(@PathVariable Integer id, @RequestBody Product product, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to update product details", UsecaseList.UPDATE_PRODUCT);

        Optional<Product> optionalProduct = productDao.findById(id);
        if(optionalProduct.isEmpty()) throw new ObjectNotFoundException("Product not found");
        Product oldProduct = optionalProduct.get();

        product.setId(id);
        product.setCode(oldProduct.getCode());
        product.setCreator(oldProduct.getCreator());
        product.setTocreation(oldProduct.getTocreation());

        for(Productmaterial productmaterial : product.getProductmaterialList()) productmaterial.setProduct(product);

        EntityValidator.validate(product);

        product = productDao.save(product);
        return new ResourceLink(product.getId(), "/products/"+product.getId());
    }

}