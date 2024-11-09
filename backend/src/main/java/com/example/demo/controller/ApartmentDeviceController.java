package com.example.demo.controller;

import com.example.demo.controller.Auth.AuthUtility;
import com.example.demo.model.ApartmentDevice;
import com.example.demo.persistence.DBManager;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
@RequestMapping("/api/apartmentDevices")
public class ApartmentDeviceController {

    @GetMapping("/{id}")
    public ResponseEntity<ApartmentDevice> getDevice(HttpServletRequest req, @PathVariable int id) {
        if(!AuthUtility.isAuthorized(req)) return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        ApartmentDevice device = DBManager.getInstance().getApartmentDeviceDAO().findByPrimaryKey(id);
        if (device != null) {
            return new ResponseEntity<>(device, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @PostMapping
    public ResponseEntity<ApartmentDevice> createDevice(HttpServletRequest req, @RequestBody ApartmentDevice device) {
        if(!AuthUtility.isAuthorized(req)) return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        if(device == null) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        if(DBManager.getInstance().getApartmentDeviceDAO().saveOrUpdate(device))
            return new ResponseEntity<>(device, HttpStatus.CREATED);
        return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApartmentDevice> deleteDevice(HttpServletRequest req, @PathVariable int id) {
        if(!AuthUtility.isAuthorized(req)) return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        ApartmentDevice device = DBManager.getInstance().getApartmentDeviceDAO().findByPrimaryKey(id);
        if (device == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        if(!DBManager.getInstance().getApartmentDeviceDAO().delete(device))
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        return new ResponseEntity<>(HttpStatus.OK);
    }

}
