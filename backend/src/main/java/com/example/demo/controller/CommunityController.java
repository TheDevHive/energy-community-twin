package com.example.demo.controller;

import com.example.demo.controller.Auth.AuthUtility;
import com.example.demo.model.*;
import com.example.demo.persistence.DAO.BuildingDAO;
import com.example.demo.persistence.DAO.CommunityDAO;
import com.example.demo.persistence.DBManager;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
@RequestMapping("/api/communities")
public class CommunityController {

    @PostMapping
    public ResponseEntity<Community> addCommunity(HttpServletRequest req, @RequestBody Community community) {
        Credentials creds = AuthUtility.getRequestCredential(req);
        if (creds == null || creds instanceof User) return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        if (community == null) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        CommunityDAO dao = DBManager.getInstance().getCommunityDAO();
        community.setAdmin((Admin) creds);
        if(dao.saveOrUpdate(community)) {
            return new ResponseEntity<>(community, HttpStatus.CREATED);
        }
        return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
    }
    @GetMapping
    public ResponseEntity<List<Community>> getAllCommunities(HttpServletRequest req) {
        Credentials creds = AuthUtility.getRequestCredential(req);
        if (creds == null || creds instanceof User) return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        Admin admin= (Admin) creds;
        CommunityDAO dao = DBManager.getInstance().getCommunityDAO();
        List<Community> communities = dao.findAll().stream().filter(community -> community.getAdmin().getId() == admin.getId()).toList();
        if (communities.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(communities, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Community> getCommunity(HttpServletRequest req, @PathVariable int id) {
        if(AuthUtility.isAuthorized(req)) {
            CommunityDAO dao = DBManager.getInstance().getCommunityDAO();
            Community community = dao.findByPrimaryKey(id);
            if (community == null) {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
            return new ResponseEntity<>(community, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
    }

    @PostMapping("/{commId}/buildings/{buildingId}")
    public ResponseEntity<Community> addBuilding(HttpServletRequest req, @PathVariable int commId, @PathVariable int buildingId, @RequestBody int id) {
        if(AuthUtility.isAuthorized(req)) {
            CommunityDAO communityDAO = DBManager.getInstance().getCommunityDAO();
            BuildingDAO buildingDAO = DBManager.getInstance().getBuildingDAO();
            Community community = communityDAO.findByPrimaryKey(commId);
            Building building = buildingDAO.findByPrimaryKey(buildingId);
            if (community != null && building != null) {
                building.setCommunity(community);
                if(buildingDAO.saveOrUpdate(building))
                    return new ResponseEntity<>(community, HttpStatus.CREATED);
                else
                    return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
            }
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Community> deleteCommunity(HttpServletRequest req,@PathVariable int id) {
        if(AuthUtility.isAuthorized(req)) {
            CommunityDAO dao = DBManager.getInstance().getCommunityDAO();
            Community community = dao.findByPrimaryKey(id);
            if (community == null) {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
            dao.delete(community);
            // Delete all buildings associated with the community
            BuildingDAO buildingDAO = DBManager.getInstance().getBuildingDAO();
            List<Building> buildings = buildingDAO.findAll().stream()
                    .filter(building -> building.getCommunity().getId() == id)
                    .toList();
            for (Building building : buildings) {
                BuildingController buildingController = new BuildingController();
                if(buildingController.deleteBuilding(req, building.getId()).getStatusCode() != HttpStatus.OK)
                    return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
            }
            return new ResponseEntity<>(community, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
    }

    @DeleteMapping("/{commId}/buildings/{buildingId}")
    public ResponseEntity<Community> removeBuilding(HttpServletRequest req, @PathVariable int commId, @PathVariable int buildingId) {
        if(AuthUtility.isAuthorized(req)) {
            BuildingDAO buildingDAO = DBManager.getInstance().getBuildingDAO();
            Building building = buildingDAO.findByPrimaryKey(buildingId);
            if (building != null && building.getCommunity().getId() == commId) {
                if(!buildingDAO.delete(building))
                    return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
                return new ResponseEntity<>(building.getCommunity(), HttpStatus.OK);
            }
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
    }

    @GetMapping("/{commId}/buildings")
    public ResponseEntity<List<Building>> getBuildings(HttpServletRequest req, @PathVariable int commId) {
        if(AuthUtility.isAuthorized(req)) {
            BuildingDAO buildingDAO = DBManager.getInstance().getBuildingDAO();
            List<Building> buildings = buildingDAO.findAll().stream()
                    .filter(building -> building.getCommunity().getId() == commId)
                    .toList();
            if (buildings.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
            return new ResponseEntity<>(buildings, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
    }
}
