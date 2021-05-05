package bit.project.server.controller;

import java.util.List;
import org.springframework.web.bind.annotation.*;
import bit.project.server.entity.Distributionstatus;
import bit.project.server.dao.DistributionstatusDao;
import org.springframework.beans.factory.annotation.Autowired;

@CrossOrigin
@RestController
@RequestMapping("/distributionstatuses")
public class DistributionstatusController{

    @Autowired
    private DistributionstatusDao distributionstatusDao;

    @GetMapping
    public List<Distributionstatus> getAll(){
        return distributionstatusDao.findAll();
    }
}