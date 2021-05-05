package bit.project.server.controller;

import java.util.List;
import bit.project.server.entity.Salestatus;
import bit.project.server.dao.SalestatusDao;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;

@CrossOrigin
@RestController
@RequestMapping("/salestatuses")
public class SalestatusController{

    @Autowired
    private SalestatusDao salestatusDao;

    @GetMapping
    public List<Salestatus> getAll(){
        return salestatusDao.findAll();
    }
}