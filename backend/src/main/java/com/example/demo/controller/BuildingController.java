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
@RequestMapping("/api/buildings")
public class BuildingController {

    @GetMapping("/{id}")
    public ResponseEntity<Building> getBuilding(HttpServletRequest req, @PathVariable int id) {
        if(!AuthUtility.isAuthorized(req)) return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        BuildingDAO dao = DBManager.getInstance().getBuildingDAO();
        Building building = dao.findByPrimaryKey(id);
        if (building != null) {
            return new ResponseEntity<>(building, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @PostMapping
    public ResponseEntity<Building> createBuilding(HttpServletRequest req, @RequestBody Building building) {
        if(!AuthUtility.isAuthorized(req)) return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        if (building == null) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        BuildingDAO dao = DBManager.getInstance().getBuildingDAO();
        if(dao.saveOrUpdate(building))
            return new ResponseEntity<>(building, HttpStatus.CREATED);
        return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Building> deleteBuilding(HttpServletRequest req, @PathVariable int id) {
        if(!AuthUtility.isAuthorized(req)) return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        BuildingDAO dao = DBManager.getInstance().getBuildingDAO();
        Building building = dao.findByPrimaryKey(id);
        if (building == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        if(!dao.delete(building))
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        // Delete all the apartments of the building
        ApartmentDAO apartmentDAO=DBManager.getInstance().getApartmentDAO();
        List<Apartment> apartments=apartmentDAO.findAll().stream().filter(apartment -> apartment.getBuilding().getId() == building.getId()).toList();
        for (Apartment apartment : apartments) {
            if(!apartmentDAO.delete(apartment))
                return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return new ResponseEntity<>(building, HttpStatus.OK);
    }

    @GetMapping("/{building_id}/apartments")
    public ResponseEntity<List<Apartment>> getApartments(HttpServletRequest req, @PathVariable int building_id) {
        if(!AuthUtility.isAuthorized(req)) return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        ApartmentDAO dao = DBManager.getInstance().getApartmentDAO();
        List<Apartment> apartments = dao.findAll().stream().filter(apartment -> apartment.getBuilding().getId() == building_id).toList();
        if (apartments.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(apartments, HttpStatus.OK);
    }

    @PostMapping("/{buildingId}/apartments/{apartment_id}")
    public ResponseEntity<Building> addApartment(HttpServletRequest req, @PathVariable int buildingId, @PathVariable int apartment_id, @RequestBody int id) {
        if(!AuthUtility.isAuthorized(req)) return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        BuildingDAO buildingDAO = DBManager.getInstance().getBuildingDAO();
        ApartmentDAO apartmentDAO = DBManager.getInstance().getApartmentDAO();
        Building building = buildingDAO.findByPrimaryKey(buildingId);
        Apartment apartment = apartmentDAO.findByPrimaryKey(apartment_id);
        if (building != null && apartment != null) {
            apartment.setBuilding(building);
            if(apartmentDAO.saveOrUpdate(apartment))
                return new ResponseEntity<>(building, HttpStatus.CREATED);
            else
                return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @DeleteMapping("/{buildingId}/apartments/{apartment_id}")
    public ResponseEntity<Building> deleteApartment(HttpServletRequest req, @PathVariable int buildingId, @PathVariable int apartment_id) {
        if(!AuthUtility.isAuthorized(req)) return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        BuildingDAO buildingDAO = DBManager.getInstance().getBuildingDAO();
        ApartmentDAO apartmentDAO = DBManager.getInstance().getApartmentDAO();
        Building building = buildingDAO.findByPrimaryKey(buildingId);
        Apartment apartment = apartmentDAO.findByPrimaryKey(apartment_id);
        if (building != null && apartment != null) {
            if(apartmentDAO.delete(apartment))
                return new ResponseEntity<>(building, HttpStatus.OK);
            else
                return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
}
