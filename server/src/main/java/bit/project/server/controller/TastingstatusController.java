package bit.project.server.controller;

import java.util.List;
import bit.project.server.entity.Tastingstatus;
import bit.project.server.dao.TastingstatusDao;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;

@CrossOrigin
@RestController
@RequestMapping("/tastingstatuses")
public class TastingstatusController{

    @Autowired
    private TastingstatusDao tastingstatusDao;

    @GetMapping
    public List<Tastingstatus> getAll(){
        return tastingstatusDao.findAll();
    }
}