package bit.project.server.dao;

import bit.project.server.entity.Withering;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource(exported=false)
public interface WitheringDao extends JpaRepository<Withering, Integer>{
    @Query("select new Withering (w.id,w.code) from Withering w")
    Page<Withering> findAllBasic(PageRequest pageRequest);

    Withering findByCode(String code);
}