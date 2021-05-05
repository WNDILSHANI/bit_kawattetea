package bit.project.server.dao;

import bit.project.server.entity.Teatreetype;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource(exported=false)
public interface TeatreetypeDao extends JpaRepository<Teatreetype, Integer>{
}