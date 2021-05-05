package bit.project.server.dao;

import bit.project.server.entity.Dryering;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource(exported=false)
public interface DryeringDao extends JpaRepository<Dryering, Integer>{
    @Query("select new Dryering (d.id,d.code) from Dryering d")
    Page<Dryering> findAllBasic(PageRequest pageRequest);

    Dryering findByCode(String code);
}