package com.example.demo.controller;

import com.example.demo.model.Apartment;
import com.example.demo.model.Building;
import com.example.demo.persistence.DAO.ApartmentDAO;
import com.example.demo.persistence.DAO.BuildingDAO;
import com.example.demo.persistence.DBManager;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@CrossOrigin(origins = "http://localhost:4200")
@RequestMapping("/api/buildings")
public class BuildingController {

    @GetMapping("/{id}")
    public Building getBuilding(@PathVariable int id) {
        BuildingDAO dao = DBManager.getInstance().getBuildingDAO();
        return dao.findByPrimaryKey(id);
    }

    @PostMapping
    public Building createBuilding(@RequestBody Building building) {
        BuildingDAO dao = DBManager.getInstance().getBuildingDAO();
        System.out.println(building.getCommunity().getId());
        dao.saveOrUpdate(building);
        return building;
    }

    @DeleteMapping("/{id}")
    public void deleteBuilding(@RequestBody Building building) {
        BuildingDAO dao = DBManager.getInstance().getBuildingDAO();
        dao.delete(building);
    }

    @GetMapping("/{id}/apartments")
    public List<Apartment> getApartments(@PathVariable int id) {
        ApartmentDAO dao = DBManager.getInstance().getApartmentDAO();
        return dao.findAll().stream().filter(p -> p.getBuilding() != null & p.getBuilding().getId() == id).toList();
    }

    @PostMapping("/{buildingId}/apartments/{apartmentId}")
    public void addApartment(@PathVariable int buildingId, @PathVariable int apartmentId) {
        BuildingDAO buildingDAO = DBManager.getInstance().getBuildingDAO();
        ApartmentDAO apartmentDAO = DBManager.getInstance().getApartmentDAO();
        Building building = buildingDAO.findByPrimaryKey(buildingId);
        Apartment apartment = apartmentDAO.findByPrimaryKey(apartmentId);

        if (apartment != null && building != null) {
            apartment.setBuilding(building);
            apartmentDAO.saveOrUpdate(apartment);
        }
    }

    @DeleteMapping("/{buildingId}/apartments/{apartmentId}")
    public void removeApartment(@PathVariable int buildingId, @PathVariable int apartmentId) {
        BuildingDAO buildingDAO = DBManager.getInstance().getBuildingDAO();
        ApartmentDAO apartmentDAO = DBManager.getInstance().getApartmentDAO();
        Building building = buildingDAO.findByPrimaryKey(buildingId);
        Apartment apartment = apartmentDAO.findByPrimaryKey(apartmentId);

        if (apartment != null && building != null && apartment.getBuilding().getId() == buildingId) {
            apartmentDAO.delete(apartment);
        }
    }

}
