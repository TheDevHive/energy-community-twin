package com.example.demo.controller;

import com.example.demo.controller.Auth.AuthUtility;
import com.example.demo.model.ApartmentDevice;
import com.example.demo.model.BuildingDevice;
import com.example.demo.model.Device;
import com.example.demo.model.EnergyCurve;
import com.example.demo.model.EnergyReport;
import com.example.demo.model.TS_Device;
import com.example.demo.model.TS_Measurement;
import com.example.demo.model.generation.GenerateData;
import com.example.demo.model.generation.TimeRange;
import com.example.demo.persistence.DAO.ApartmentDeviceDAO;
import com.example.demo.persistence.DAO.BuildingDeviceDAO;
import com.example.demo.persistence.DAO.TS_DeviceDAO;
import com.example.demo.persistence.DAO.TS_MeasurementDAO;
import com.example.demo.persistence.DBManager;
import com.example.demo.persistence.TS_DBManager;

import jakarta.servlet.http.HttpServletRequest;

import java.util.Arrays;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
@RequestMapping("/api/devices")
public class DeviceController {

    @PostMapping("/{uuid}/energy-pattern")
    public ResponseEntity<EnergyCurve> saveEnergyPattern(HttpServletRequest req, @PathVariable String uuid,
            @RequestBody EnergyCurve energyCurve) {
        if (!AuthUtility.isAuthorized(req))
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        try {
            if (uuid == null) {
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            } else {
                if (uuid.startsWith("A")) {
                    ApartmentDeviceDAO dao = DBManager.getInstance().getApartmentDeviceDAO();
                    ApartmentDevice device = dao.findByPrimaryKey(Integer.parseInt(uuid, 1, uuid.length(), 10));
                    if (device == null) {
                        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
                    }
                    device.setEnergyCurve(energyCurve);
                    dao.saveOrUpdate(device);
                    return new ResponseEntity<>(energyCurve, HttpStatus.OK);
                } else if (uuid.startsWith("B")) {
                    BuildingDeviceDAO dao = DBManager.getInstance().getBuildingDeviceDAO();
                    BuildingDevice device = dao.findByPrimaryKey(Integer.parseInt(uuid, 1, uuid.length(), 10));
                    if (device == null) {
                        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
                    }
                    device.setEnergyCurve(energyCurve);
                    dao.saveOrUpdate(device);
                    return new ResponseEntity<>(energyCurve, HttpStatus.OK);
                } else {
                    return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/{uuid}/energy-pattern")
    public ResponseEntity<EnergyCurve> getDevicePattern(HttpServletRequest req, @PathVariable String uuid) {
        if (!AuthUtility.isAuthorized(req))
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        try {
            if (uuid == null) {
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            } else {
                if (uuid.startsWith("A")) {
                    ApartmentDeviceDAO dao = DBManager.getInstance().getApartmentDeviceDAO();
                    ApartmentDevice device = dao.findByPrimaryKey(Integer.parseInt(uuid, 1, uuid.length(), 10));
                    if (device == null) {
                        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
                    }
                    return new ResponseEntity<>(device.getEnergyCurve(), HttpStatus.OK);
                } else if (uuid.startsWith("B")) {
                    BuildingDeviceDAO dao = DBManager.getInstance().getBuildingDeviceDAO();
                    BuildingDevice device = dao.findByPrimaryKey(Integer.parseInt(uuid, 1, uuid.length(), 10));
                    if (device == null) {
                        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
                    }
                    return new ResponseEntity<>(device.getEnergyCurve(), HttpStatus.OK);
                } else {
                    return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/{uuid}/energy-pattern")
    public ResponseEntity<EnergyCurve> updateDevicePattern(HttpServletRequest req, @PathVariable String uuid,
            @RequestBody EnergyCurve energyCurve) {
        if (!AuthUtility.isAuthorized(req))
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        try {
            if (uuid == null) {
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            } else {
                if (uuid.startsWith("A")) {
                    ApartmentDeviceDAO dao = DBManager.getInstance().getApartmentDeviceDAO();
                    ApartmentDevice device = dao.findByPrimaryKey(Integer.parseInt(uuid, 1, uuid.length(), 10));
                    if (device == null) {
                        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
                    }
                    device.setEnergyCurve(energyCurve);
                    dao.saveOrUpdate(device);
                    return new ResponseEntity<>(energyCurve, HttpStatus.OK);
                } else if (uuid.startsWith("B")) {
                    BuildingDeviceDAO dao = DBManager.getInstance().getBuildingDeviceDAO();
                    BuildingDevice device = dao.findByPrimaryKey(Integer.parseInt(uuid, 1, uuid.length(), 10));
                    if (device == null) {
                        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
                    }
                    device.setEnergyCurve(energyCurve);
                    dao.saveOrUpdate(device);
                    return new ResponseEntity<>(energyCurve, HttpStatus.OK);
                } else {
                    return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/{uuid}/energy-pattern")
    public ResponseEntity<EnergyCurve> deleteDevicePattern(HttpServletRequest req, @PathVariable String uuid) {
        if (!AuthUtility.isAuthorized(req))
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        try {
            if (uuid == null) {
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            } else {
                if (uuid.startsWith("A")) {
                    ApartmentDeviceDAO dao = DBManager.getInstance().getApartmentDeviceDAO();
                    ApartmentDevice device = dao.findByPrimaryKey(Integer.parseInt(uuid, 1, uuid.length(), 10));
                    if (device == null) {
                        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
                    }
                    device.setEnergyCurve(new EnergyCurve());
                    dao.saveOrUpdate(device);
                    return new ResponseEntity<>(HttpStatus.OK);
                } else if (uuid.startsWith("B")) {
                    BuildingDeviceDAO dao = DBManager.getInstance().getBuildingDeviceDAO();
                    BuildingDevice device = dao.findByPrimaryKey(Integer.parseInt(uuid, 1, uuid.length(), 10));
                    if (device == null) {
                        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
                    }
                    device.setEnergyCurve(null);
                    dao.saveOrUpdate(device);
                    return new ResponseEntity<>(HttpStatus.OK);
                } else {
                    return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/{uuid}/mean-energy")
    public ResponseEntity<Double> getMeanEnergy(HttpServletRequest req, @PathVariable String uuid) {
        if (!AuthUtility.isAuthorized(req))
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        try {
            if (uuid == null) {
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            } else {
                TS_DeviceDAO ts_DeviceDAO = TS_DBManager.getInstance().getTS_DeviceDAO();
                TS_Device ts_device = ts_DeviceDAO.findByUuid(uuid);
                TS_MeasurementDAO ts_MeasurementDAO = TS_DBManager.getInstance().getTS_MeasurementDAO();
                List<TS_Measurement> list_measurements = ts_MeasurementDAO.findByDeviceId(ts_device.getId());
                double average = list_measurements.stream().mapToDouble(measurement -> measurement.getValue()).average()
                        .orElse(0);
                return new ResponseEntity<>(average, HttpStatus.OK);
            }
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/{uuid}/get-measurements")
    public ResponseEntity<List<TS_Measurement>> getMeasurements(HttpServletRequest req, @PathVariable String uuid) {
        if (!AuthUtility.isAuthorized(req))
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        try {
            if (uuid == null) {
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            } else {
                TS_DeviceDAO ts_DeviceDAO = TS_DBManager.getInstance().getTS_DeviceDAO();
                TS_Device ts_device = ts_DeviceDAO.findByUuid(uuid);
                TS_MeasurementDAO ts_MeasurementDAO = TS_DBManager.getInstance().getTS_MeasurementDAO();
                List<TS_Measurement> list_measurements = ts_MeasurementDAO.findByDeviceId(ts_device.getId());
                return new ResponseEntity<>(list_measurements, HttpStatus.OK);
            }
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/{uuid}/generate-measurements")
    public ResponseEntity<Boolean> generateMeasurements(HttpServletRequest req, @PathVariable String uuid,
            @RequestBody TimeRange timeRange) {
        if (!AuthUtility.isAuthorized(req))
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        try {
            if (uuid == null) {
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            } else {
                EnergyReport report = new EnergyReport();
                DBManager.getInstance().getEnergyReportDAO().saveOrUpdate(report);
                Device device = null;
                if (uuid.startsWith("A")) {
                    device = DBManager.getInstance().getApartmentDeviceDAO().findByPrimaryKey(Integer.parseInt(uuid, 1, uuid.length(), 10));
                } else if (uuid.startsWith("B")) {
                    device = DBManager.getInstance().getBuildingDeviceDAO().findByPrimaryKey(Integer.parseInt(uuid, 1, uuid.length(), 10));
                } else {
                    return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
                }
                String result = GenerateData.generateDataDevice(device, timeRange.getStart(), timeRange.getEnd(), report.getId());
                if (!result.equals("") && GenerateData.generateReport(report, Arrays.asList(new String[]{uuid}), timeRange.getStart(), timeRange.getEnd(), "D"+uuid)){
                    return new ResponseEntity<>(true, HttpStatus.OK);
                } else {
                    return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
