package bit.project.server.dao;

import bit.project.server.entity.Packingstatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource(exported=false)
public interface PackingstatusDao extends JpaRepository<Packingstatus, Integer>{
}