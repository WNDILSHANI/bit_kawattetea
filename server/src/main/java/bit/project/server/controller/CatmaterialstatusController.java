package bit.project.server.controller;

import java.util.List;
import org.springframework.web.bind.annotation.*;
import bit.project.server.entity.Catmaterialstatus;
import bit.project.server.dao.CatmaterialstatusDao;
import org.springframework.beans.factory.annotation.Autowired;

@CrossOrigin
@RestController
@RequestMapping("/catmaterialstatuses")
public class CatmaterialstatusController{

    @Autowired
    private CatmaterialstatusDao catmaterialstatusDao;

    @GetMapping
    public List<Catmaterialstatus> getAll(){
        return catmaterialstatusDao.findAll();
    }
}