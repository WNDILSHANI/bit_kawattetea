package bit.project.server.controller;

import java.util.List;
import bit.project.server.entity.Route;
import bit.project.server.dao.RouteDao;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;

@CrossOrigin
@RestController
@RequestMapping("/routes")
public class RouteController{

    @Autowired
    private RouteDao routeDao;

    @GetMapping
    public List<Route> getAll(){
        return routeDao.findAll();
    }
}