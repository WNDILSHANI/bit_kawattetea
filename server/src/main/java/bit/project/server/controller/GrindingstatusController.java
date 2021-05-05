package bit.project.server.controller;

import java.util.List;
import bit.project.server.entity.Grindingstatus;
import bit.project.server.dao.GrindingstatusDao;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;

@CrossOrigin
@RestController
@RequestMapping("/grindingstatuses")
public class GrindingstatusController{

    @Autowired
    private GrindingstatusDao grindingstatusDao;

    @GetMapping
    public List<Grindingstatus> getAll(){
        return grindingstatusDao.findAll();
    }
}