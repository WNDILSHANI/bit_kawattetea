package bit.project.server.dao;

import org.springframework.data.domain.Page;
import bit.project.server.entity.Categorization;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource(exported=false)
public interface CategorizationDao extends JpaRepository<Categorization, Integer>{
    @Query("select new Categorization (c.id,c.code) from Categorization c")
    Page<Categorization> findAllBasic(PageRequest pageRequest);

    Categorization findByCode(String code);
}