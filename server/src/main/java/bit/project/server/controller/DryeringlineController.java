package bit.project.server.controller;

import java.util.List;
import bit.project.server.entity.Dryeringline;
import bit.project.server.dao.DryeringlineDao;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;

@CrossOrigin
@RestController
@RequestMapping("/dryeringlines")
public class DryeringlineController{

    @Autowired
    private DryeringlineDao dryeringlineDao;

    @GetMapping
    public List<Dryeringline> getAll(){
        return dryeringlineDao.findAll();
    }
}