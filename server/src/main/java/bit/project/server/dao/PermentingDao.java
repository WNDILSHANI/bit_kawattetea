package bit.project.server.dao;

import bit.project.server.entity.Permenting;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource(exported=false)
public interface PermentingDao extends JpaRepository<Permenting, Integer>{
    @Query("select new Permenting (p.id,p.code) from Permenting p")
    Page<Permenting> findAllBasic(PageRequest pageRequest);

    Permenting findByCode(String code);
}