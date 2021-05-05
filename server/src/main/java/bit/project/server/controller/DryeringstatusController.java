package bit.project.server.controller;

import java.util.List;
import bit.project.server.entity.Dryeringstatus;
import bit.project.server.dao.DryeringstatusDao;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;

@CrossOrigin
@RestController
@RequestMapping("/dryeringstatuses")
public class DryeringstatusController{

    @Autowired
    private DryeringstatusDao dryeringstatusDao;

    @GetMapping
    public List<Dryeringstatus> getAll(){
        return dryeringstatusDao.findAll();
    }
}