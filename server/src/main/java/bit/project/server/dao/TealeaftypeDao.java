package bit.project.server.dao;

import bit.project.server.entity.Tealeaftype;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource(exported=false)
public interface TealeaftypeDao extends JpaRepository<Tealeaftype, Integer>{
}