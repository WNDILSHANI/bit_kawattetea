package bit.project.server.controller;

import java.util.List;
import bit.project.server.entity.Grade;
import bit.project.server.dao.GradeDao;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;

@CrossOrigin
@RestController
@RequestMapping("/grades")
public class GradeController{

    @Autowired
    private GradeDao gradeDao;

    @GetMapping
    public List<Grade> getAll(){
        return gradeDao.findAll();
    }
}