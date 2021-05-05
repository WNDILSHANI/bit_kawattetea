package bit.project.server.controller;

import java.util.List;
import bit.project.server.entity.Witherline;
import bit.project.server.dao.WitherlineDao;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;

@CrossOrigin
@RestController
@RequestMapping("/witherlines")
public class WitherlineController{

    @Autowired
    private WitherlineDao witherlineDao;

    @GetMapping
    public List<Witherline> getAll(){
        return witherlineDao.findAll();
    }
}