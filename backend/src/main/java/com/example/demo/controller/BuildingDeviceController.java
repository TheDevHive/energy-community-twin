package com.example.demo.controller;

import com.example.demo.controller.Auth.AuthUtility;
import com.example.demo.model.BuildingDevice;
import com.example.demo.persistence.DBManager;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
@RequestMapping("/api/buildingDevices")
public class BuildingDeviceController {

    @GetMapping("/{id}")
    public ResponseEntity<BuildingDevice> getDevice(HttpServletRequest req, @PathVariable int id) {
        if(!AuthUtility.isAuthorized(req)) return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        BuildingDevice device = DBManager.getInstance().getBuildingDeviceDAO().findByPrimaryKey(id);
        if (device != null) {
            return new ResponseEntity<>(device, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @PostMapping
    public ResponseEntity<BuildingDevice> createDevice(HttpServletRequest req, @RequestBody BuildingDevice device) {
        if(!AuthUtility.isAuthorized(req)) return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        if(device == null) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        if(DBManager.getInstance().getBuildingDeviceDAO().saveOrUpdate(device))
            return new ResponseEntity<>(device, HttpStatus.CREATED);
        return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<BuildingDevice> deleteDevice(HttpServletRequest req, @PathVariable int id) {
        if(!AuthUtility.isAuthorized(req)) return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        BuildingDevice device = DBManager.getInstance().getBuildingDeviceDAO().findByPrimaryKey(id);
        if (device == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        if(!DBManager.getInstance().getBuildingDeviceDAO().delete(device))
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        return new ResponseEntity<>(HttpStatus.OK);
    }
}
