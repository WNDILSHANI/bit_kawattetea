package bit.project.server.controller;

import java.util.List;
import org.springframework.web.bind.annotation.*;
import bit.project.server.entity.Collectionstatus;
import bit.project.server.dao.CollectionstatusDao;
import org.springframework.beans.factory.annotation.Autowired;

@CrossOrigin
@RestController
@RequestMapping("/collectionstatuses")
public class CollectionstatusController{

    @Autowired
    private CollectionstatusDao collectionstatusDao;

    @GetMapping
    public List<Collectionstatus> getAll(){
        return collectionstatusDao.findAll();
    }
}