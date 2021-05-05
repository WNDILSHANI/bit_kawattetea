package bit.project.server.dao;

import bit.project.server.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource(exported=false)
public interface ProductDao extends JpaRepository<Product, Integer>{
    @Query("select new Product (p.id,p.code,p.name,p.photo) from Product p")
    Page<Product> findAllBasic(PageRequest pageRequest);

    Product findByCode(String code);
}