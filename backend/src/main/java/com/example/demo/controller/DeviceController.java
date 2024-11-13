package com.example.demo.controller;

import com.example.demo.controller.Auth.AuthUtility;
import com.example.demo.model.Apartment;
import com.example.demo.model.Building;
import com.example.demo.persistence.DAO.ApartmentDAO;
import com.example.demo.persistence.DAO.BuildingDAO;
import com.example.demo.persistence.DBManager;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@CrossOrigin(origins = "http://localhost:4200")
@RequestMapping("/api/devices")
public class BuildingController {

    @GetMapping("/{id}/")
    public ResponseEntity<Building> getBuilding(HttpServletRequest req, @PathVariable int id) {
        if(!AuthUtility.isAuthorized(req)) return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        BuildingDAO dao = DBManager.getInstance().getBuildingDAO();
        Building building = dao.findByPrimaryKey(id);
        if (building != null) {
            return new ResponseEntity<>(building, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
}
