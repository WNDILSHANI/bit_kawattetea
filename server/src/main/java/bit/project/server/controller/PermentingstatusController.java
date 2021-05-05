package bit.project.server.controller;

import java.util.List;
import org.springframework.web.bind.annotation.*;
import bit.project.server.entity.Permentingstatus;
import bit.project.server.dao.PermentingstatusDao;
import org.springframework.beans.factory.annotation.Autowired;

@CrossOrigin
@RestController
@RequestMapping("/permentingstatuses")
public class PermentingstatusController{

    @Autowired
    private PermentingstatusDao permentingstatusDao;

    @GetMapping
    public List<Permentingstatus> getAll(){
        return permentingstatusDao.findAll();
    }
}