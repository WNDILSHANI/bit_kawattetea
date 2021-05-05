package bit.project.server.controller;

import java.util.List;
import org.springframework.web.bind.annotation.*;
import bit.project.server.entity.Grindingmachine;
import bit.project.server.dao.GrindingmachineDao;
import org.springframework.beans.factory.annotation.Autowired;

@CrossOrigin
@RestController
@RequestMapping("/grindingmachines")
public class GrindingmachineController{

    @Autowired
    private GrindingmachineDao grindingmachineDao;

    @GetMapping
    public List<Grindingmachine> getAll(){
        return grindingmachineDao.findAll();
    }
}