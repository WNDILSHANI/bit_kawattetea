package bit.project.server.controller;

import java.util.List;
import bit.project.server.entity.Tealeaftype;
import bit.project.server.dao.TealeaftypeDao;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;

@CrossOrigin
@RestController
@RequestMapping("/tealeaftypes")
public class TealeaftypeController{

    @Autowired
    private TealeaftypeDao tealeaftypeDao;

    @GetMapping
    public List<Tealeaftype> getAll(){
        return tealeaftypeDao.findAll();
    }
}