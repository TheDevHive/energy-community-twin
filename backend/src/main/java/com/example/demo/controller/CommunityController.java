package com.example.demo.controller;

import com.example.demo.model.Building;
import com.example.demo.model.Community;
import com.example.demo.persistence.DAO.BuildingDAO;
import com.example.demo.persistence.DAO.CommunityDAO;
import com.example.demo.persistence.DBManager;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
@RequestMapping("/api/communities")
public class CommunityController {

    @GetMapping
    public List<Community> getCommunities() {
        CommunityDAO dao = DBManager.getInstance().getCommunityDAO();
        return dao.findAll();
    }

    @GetMapping("/{id}")
    public Community getCommunityById(@PathVariable int id) {
        CommunityDAO dao = DBManager.getInstance().getCommunityDAO();
        return dao.findByPrimaryKey(id);
    }

    @PostMapping
    public void createCommunity(@RequestBody Community community) {
        CommunityDAO dao = DBManager.getInstance().getCommunityDAO();
        dao.saveOrUpdate(community);
    }

    @PostMapping("/{commId}/buildings/{buildingId}")
    public void addBuilding(@PathVariable int commId, @PathVariable int buildingId) {
        CommunityDAO communityDAO = DBManager.getInstance().getCommunityDAO();
        BuildingDAO buildingDAO = DBManager.getInstance().getBuildingDAO();
        Community community = communityDAO.findByPrimaryKey(commId);
        Building building = buildingDAO.findByPrimaryKey(buildingId);

        if (community != null && building != null) {
            building.setCommunity(community);
            buildingDAO.saveOrUpdate(building);
        }
    }

    @DeleteMapping("/{commId}")
    public void removeCommunity(@PathVariable int commId) {
        CommunityDAO dao = DBManager.getInstance().getCommunityDAO();
        Community community = dao.findByPrimaryKey(commId);
        if (community != null) {
            dao.delete(community);
        }
    }

    @DeleteMapping("/{commId}/buildings/{buildingId}")
    public void removeBuilding(@PathVariable int commId, @PathVariable int buildingId) {
        BuildingDAO buildingDAO = DBManager.getInstance().getBuildingDAO();
        Building building = buildingDAO.findByPrimaryKey(buildingId);

        if (building != null && building.getCommunity().getId() == commId) {
            buildingDAO.delete(building);
        }
    }

    @GetMapping("/{commId}/buildings")
    public List<Building> getBuildings(@PathVariable int commId) {
        BuildingDAO buildingDAO = DBManager.getInstance().getBuildingDAO();
        List<Building> buildings = buildingDAO.findAll();

        return buildings.stream()
                .filter(building -> building.getCommunity().getId() == commId)
                .toList();
    }
}
