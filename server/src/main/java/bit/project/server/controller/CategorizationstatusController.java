package bit.project.server.controller;

import java.util.List;
import org.springframework.web.bind.annotation.*;
import bit.project.server.entity.Categorizationstatus;
import bit.project.server.dao.CategorizationstatusDao;
import org.springframework.beans.factory.annotation.Autowired;

@CrossOrigin
@RestController
@RequestMapping("/categorizationstatuses")
public class CategorizationstatusController{

    @Autowired
    private CategorizationstatusDao categorizationstatusDao;

    @GetMapping
    public List<Categorizationstatus> getAll(){
        return categorizationstatusDao.findAll();
    }
}