package bit.project.server.dao;

import org.springframework.data.domain.Page;
import bit.project.server.entity.Distribution;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource(exported=false)
public interface DistributionDao extends JpaRepository<Distribution, Integer>{
    @Query("select new Distribution (d.id,d.code) from Distribution d")
    Page<Distribution> findAllBasic(PageRequest pageRequest);

    Distribution findByCode(String code);
}