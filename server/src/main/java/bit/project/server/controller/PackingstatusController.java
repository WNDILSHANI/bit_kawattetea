package bit.project.server.controller;

import java.util.List;
import bit.project.server.entity.Packingstatus;
import bit.project.server.dao.PackingstatusDao;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;

@CrossOrigin
@RestController
@RequestMapping("/packingstatuses")
public class PackingstatusController{

    @Autowired
    private PackingstatusDao packingstatusDao;

    @GetMapping
    public List<Packingstatus> getAll(){
        return packingstatusDao.findAll();
    }
}