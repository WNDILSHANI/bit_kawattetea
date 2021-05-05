package bit.project.server.dao;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import bit.project.server.entity.Categorizedmaterial;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource(exported=false)
public interface CategorizedmaterialDao extends JpaRepository<Categorizedmaterial, Integer>{
    @Query("select new Categorizedmaterial (c.id,c.code) from Categorizedmaterial c")
    Page<Categorizedmaterial> findAllBasic(PageRequest pageRequest);

    Categorizedmaterial findByCode(String code);
}