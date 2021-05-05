package bit.project.server.controller;

import java.util.List;
import org.springframework.web.bind.annotation.*;
import bit.project.server.entity.Permentingmachine;
import bit.project.server.dao.PermentingmachineDao;
import org.springframework.beans.factory.annotation.Autowired;

@CrossOrigin
@RestController
@RequestMapping("/permentingmachines")
public class PermentingmachineController{

    @Autowired
    private PermentingmachineDao permentingmachineDao;

    @GetMapping
    public List<Permentingmachine> getAll(){
        return permentingmachineDao.findAll();
    }
}