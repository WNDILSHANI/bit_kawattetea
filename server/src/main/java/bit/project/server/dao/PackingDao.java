package bit.project.server.dao;

import bit.project.server.entity.Packing;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource(exported=false)
public interface PackingDao extends JpaRepository<Packing, Integer>{
    @Query("select new Packing (p.id,p.code) from Packing p")
    Page<Packing> findAllBasic(PageRequest pageRequest);

    Packing findByCode(String code);
}