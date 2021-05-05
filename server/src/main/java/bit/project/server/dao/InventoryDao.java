package bit.project.server.dao;

import bit.project.server.entity.Inventory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource(exported=false)
public interface InventoryDao extends JpaRepository<Inventory, Integer>{
    @Query("select new Inventory (i.id,i.code) from Inventory i")
    Page<Inventory> findAllBasic(PageRequest pageRequest);

    Inventory findByCode(String code);
}