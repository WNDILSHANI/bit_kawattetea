package bit.project.server.dao;

import bit.project.server.entity.Collection;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource(exported=false)
public interface CollectionDao extends JpaRepository<Collection, Integer>{
    @Query("select new Collection (c.id,c.code) from Collection c")
    Page<Collection> findAllBasic(PageRequest pageRequest);

    Collection findByCode(String code);
}