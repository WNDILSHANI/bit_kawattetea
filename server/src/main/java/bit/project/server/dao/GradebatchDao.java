package bit.project.server.dao;

import bit.project.server.entity.Gradebatch;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource(exported=false)
public interface GradebatchDao extends JpaRepository<Gradebatch, Integer>{
    @Query("select new Gradebatch (g.id,g.code,g.grade,g.name) from Gradebatch g")
    Page<Gradebatch> findAllBasic(PageRequest pageRequest);

    Gradebatch findByCode(String code);
}