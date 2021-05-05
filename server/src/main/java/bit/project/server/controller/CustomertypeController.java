package bit.project.server.controller;

import java.util.List;
import bit.project.server.entity.Customertype;
import bit.project.server.dao.CustomertypeDao;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;

@CrossOrigin
@RestController
@RequestMapping("/customertypes")
public class CustomertypeController{

    @Autowired
    private CustomertypeDao customertypeDao;

    @GetMapping
    public List<Customertype> getAll(){
        return customertypeDao.findAll();
    }
}