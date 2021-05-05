package bit.project.server.controller;

import java.util.List;
import org.springframework.web.bind.annotation.*;
import bit.project.server.entity.Witheringstatus;
import bit.project.server.dao.WitheringstatusDao;
import org.springframework.beans.factory.annotation.Autowired;

@CrossOrigin
@RestController
@RequestMapping("/witheringstatuses")
public class WitheringstatusController{

    @Autowired
    private WitheringstatusDao witheringstatusDao;

    @GetMapping
    public List<Witheringstatus> getAll(){
        return witheringstatusDao.findAll();
    }
}