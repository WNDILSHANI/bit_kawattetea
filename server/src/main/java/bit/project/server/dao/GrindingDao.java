package bit.project.server.dao;

import bit.project.server.entity.Grinding;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource(exported=false)
public interface GrindingDao extends JpaRepository<Grinding, Integer>{
    @Query("select new Grinding (g.id,g.code) from Grinding g")
    Page<Grinding> findAllBasic(PageRequest pageRequest);

    Grinding findByCode(String code);
}