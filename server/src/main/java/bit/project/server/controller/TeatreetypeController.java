package bit.project.server.controller;

import java.util.List;
import bit.project.server.entity.Teatreetype;
import bit.project.server.dao.TeatreetypeDao;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;

@CrossOrigin
@RestController
@RequestMapping("/teatreetypes")
public class TeatreetypeController{

    @Autowired
    private TeatreetypeDao teatreetypeDao;

    @GetMapping
    public List<Teatreetype> getAll(){
        return teatreetypeDao.findAll();
    }
}