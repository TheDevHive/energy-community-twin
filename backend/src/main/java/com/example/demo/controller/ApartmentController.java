package com.example.demo.controller;

import com.example.demo.controller.Auth.AuthUtility;
import com.example.demo.model.Apartment;
import com.example.demo.model.ApartmentDevice;
import com.example.demo.model.ApartmentStats;
import com.example.demo.model.EnergyReport;
import com.example.demo.model.generation.GenerateData;
import com.example.demo.model.generation.TimeRange;
import com.example.demo.persistence.DAO.ApartmentDAO;
import com.example.demo.persistence.DBManager;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
@RequestMapping("/api/apartments")
public class ApartmentController {

    @PostMapping
    public ResponseEntity<Apartment> createApartment(HttpServletRequest req, @RequestBody Apartment apartment) {
        if (!AuthUtility.isAuthorized(req))
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        if (apartment == null) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        if (DBManager.getInstance().getApartmentDAO().saveOrUpdate(apartment))
            return new ResponseEntity<>(apartment, HttpStatus.CREATED);
        return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Apartment> deleteApartment(HttpServletRequest req, @PathVariable int id) {
        if (!AuthUtility.isAuthorized(req))
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        Apartment apartment = DBManager.getInstance().getApartmentDAO().findByPrimaryKey(id);
        if (apartment == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        List<ApartmentDevice> devices = DBManager.getInstance().getApartmentDeviceDAO().findAll().stream()
                .filter(device -> device.getApartment().getId() == apartment.getId()).toList();
        for (ApartmentDevice device : devices) {
            if (!DBManager.getInstance().getApartmentDeviceDAO().delete(device))
                return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
        if (!DBManager.getInstance().getApartmentDAO().delete(apartment))
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        return new ResponseEntity<>(apartment, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Apartment> getApartment(HttpServletRequest req, @PathVariable int id) {
        if (!AuthUtility.isAuthorized(req))
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        Apartment apartment = DBManager.getInstance().getApartmentDAO().findByPrimaryKey(id);
        if (apartment != null) {
            return new ResponseEntity<>(apartment, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @PutMapping
    public ResponseEntity<Apartment> updateApartment(HttpServletRequest req, @RequestBody Apartment apartment) {
        if (!AuthUtility.isAuthorized(req))
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        if (apartment == null) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        ApartmentDAO dao = DBManager.getInstance().getApartmentDAO();
        if (dao.saveOrUpdate(apartment))
            return new ResponseEntity<>(apartment, HttpStatus.CREATED);
        return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @GetMapping("/{apartmentId}/devices")
    public ResponseEntity<List<ApartmentDevice>> getAllDevices(HttpServletRequest req, @PathVariable int apartmentId) {
        if (!AuthUtility.isAuthorized(req))
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        List<ApartmentDevice> devices = DBManager.getInstance().getApartmentDeviceDAO().findAll().stream()
                .filter(device -> device.getApartment().getId() == apartmentId).toList();
        if (devices.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(devices, HttpStatus.OK);
    }

    @PostMapping("/{apartmentId}/devices/{deviceId}")
    public ResponseEntity<ApartmentDevice> addDevice(HttpServletRequest req, @PathVariable int apartmentId,
            @PathVariable int deviceId) {
        if (!AuthUtility.isAuthorized(req))
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        Apartment apartment = DBManager.getInstance().getApartmentDAO().findByPrimaryKey(apartmentId);
        ApartmentDevice device = DBManager.getInstance().getApartmentDeviceDAO().findByPrimaryKey(deviceId);
        if (device == null || apartment == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        device.setApartment(apartment);
        if (DBManager.getInstance().getApartmentDeviceDAO().saveOrUpdate(device))
            return new ResponseEntity<>(device, HttpStatus.CREATED);
        return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @DeleteMapping("/{apartmentId}/devices/{deviceId}")
    public ResponseEntity<ApartmentDevice> deleteDevice(HttpServletRequest req, @PathVariable int apartmentId,
            @PathVariable int deviceId) {
        if (!AuthUtility.isAuthorized(req))
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        ApartmentDevice device = DBManager.getInstance().getApartmentDeviceDAO().findByPrimaryKey(deviceId);
        if (device == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        if (!DBManager.getInstance().getApartmentDeviceDAO().delete(device))
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @GetMapping("/stats")
    public ResponseEntity<List<ApartmentStats>> getAllStats(HttpServletRequest req) {
        if (AuthUtility.isAuthorized(req)) {
            ApartmentDAO apartmentDAO = DBManager.getInstance().getApartmentDAO();
            List<Apartment> apartments = apartmentDAO.findAll();
            List<ApartmentStats> allStats = apartments.stream()
                    .map(this::extractStats)
                    .toList();
            if (allStats.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
            return new ResponseEntity<>(allStats, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
    }

    @PostMapping("/{ApartmentId}/generate-measurements")
    public ResponseEntity<List<String>> generateMeasurements(HttpServletRequest req, @PathVariable int ApartmentId,
            @RequestBody TimeRange timeRange) {
        if (!AuthUtility.isAuthorized(req))
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        Apartment apartment = DBManager.getInstance().getApartmentDAO().findByPrimaryKey(ApartmentId);
        if (apartment == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        List<ApartmentDevice> devices = DBManager.getInstance().getApartmentDeviceDAO().findByApartment(apartment);
        if (devices.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        EnergyReport report = new EnergyReport();
        DBManager.getInstance().getEnergyReportDAO().saveOrUpdate(report);
        List<String> deviceList = GenerateData.generateDataApartment(devices, timeRange.getStart(), timeRange.getEnd(), report.getId());
        if (GenerateData.generateReport(report, deviceList, timeRange.getStart(), timeRange.getEnd(), "A"+ApartmentId)){
            return new ResponseEntity<>(deviceList, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    public ApartmentStats extractStats(Apartment apartment) {
        double energyProduction = getEnergyProduction(apartment.getId());
        double energyConsumption = getEnergyConsumption(apartment.getId());

        return new ApartmentStats(
                apartment.getId(),
                energyProduction,
                energyConsumption,
                getEnergyClass(energyProduction, energyConsumption));
    }

    public static double getEnergyProduction(int apartmentId)
    {
        List<ApartmentDevice> apartmentDevices = DBManager.getInstance().getApartmentDeviceDAO().findAll().stream().filter(device -> device.getApartment().getId() == apartmentId && device.getConsumesEnergy()==1).toList();
        double energyProduction = 0;
        for (ApartmentDevice apartmentDevice : apartmentDevices)
            energyProduction += Math.round(((double) apartmentDevice.getEnergyCurve().getEnergyCurve().stream().mapToInt(Integer::intValue).sum() / apartmentDevice.getEnergyCurve().getEnergyCurve().size()) * 100.0) / 100.0;
        return energyProduction;
    }

    public static double getEnergyConsumption(int apartmentId)
    {
        List<ApartmentDevice> apartmentDevices = DBManager.getInstance().getApartmentDeviceDAO().findAll().stream().filter(device -> device.getApartment().getId() == apartmentId && device.getConsumesEnergy()==0).toList();
        double energyConsumption = 0;
        for (ApartmentDevice apartmentDevice : apartmentDevices)
            energyConsumption += Math.round(((double) apartmentDevice.getEnergyCurve().getEnergyCurve().stream().mapToInt(Integer::intValue).sum() / apartmentDevice.getEnergyCurve().getEnergyCurve().size()) * 100.0) / 100.0;
        return energyConsumption;
    }

    private char getEnergyClass(double energyProduction, double energyConsumption) {
        if (energyProduction > energyConsumption) {
            return 'A';
        } else if (energyProduction == energyConsumption) {
            return 'B';
        } else {
            return 'C';
        }
    }
}
