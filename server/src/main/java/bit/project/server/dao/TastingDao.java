package bit.project.server.dao;

import bit.project.server.entity.Tasting;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource(exported=false)
public interface TastingDao extends JpaRepository<Tasting, Integer>{
    @Query("select new Tasting (t.id,t.code) from Tasting t")
    Page<Tasting> findAllBasic(PageRequest pageRequest);

    Tasting findByCode(String code);
}