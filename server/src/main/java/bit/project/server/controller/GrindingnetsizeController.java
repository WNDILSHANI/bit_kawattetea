package bit.project.server.controller;

import java.util.List;
import org.springframework.web.bind.annotation.*;
import bit.project.server.entity.Grindingnetsize;
import bit.project.server.dao.GrindingnetsizeDao;
import org.springframework.beans.factory.annotation.Autowired;

@CrossOrigin
@RestController
@RequestMapping("/grindingnetsizes")
public class GrindingnetsizeController{

    @Autowired
    private GrindingnetsizeDao grindingnetsizeDao;

    @GetMapping
    public List<Grindingnetsize> getAll(){
        return grindingnetsizeDao.findAll();
    }
}