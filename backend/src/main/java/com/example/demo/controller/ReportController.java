package com.example.demo.controller;

import com.example.demo.controller.Auth.AuthUtility;
import com.example.demo.model.EnergyReport;
import com.example.demo.persistence.DAO.EnergyReportDAO;
import com.example.demo.persistence.DBManager;

import jakarta.servlet.http.HttpServletRequest;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
@RequestMapping("/api/reports")
public class ReportController {

    @GetMapping("/{reportId}")
    public ResponseEntity<EnergyReport> getReport(HttpServletRequest req, @PathVariable Integer reportId) {
        if (!AuthUtility.isAuthorized(req))
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        try {
            if (reportId == null) {
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            }
            
            EnergyReportDAO dao = DBManager.getInstance().getEnergyReportDAO();
            EnergyReport report = dao.findByPrimaryKey(reportId);
            
            if (report == null) {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
            
            return new ResponseEntity<>(report, HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/refUUID/{refUUID}")
    public ResponseEntity<List<EnergyReport>> getReport(HttpServletRequest req, @PathVariable String refUUID) {
        if (!AuthUtility.isAuthorized(req))
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        try {
            if (refUUID == null) {
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            }
            
            EnergyReportDAO dao = DBManager.getInstance().getEnergyReportDAO();
            List<EnergyReport> report = dao.findByRefUUID(refUUID);
            
            if (report == null) {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
            
            return new ResponseEntity<>(report, HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/{reportId}")
    public ResponseEntity<Void> deleteReport(HttpServletRequest req, @PathVariable Integer reportId) {
        if (!AuthUtility.isAuthorized(req))
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
            
        try {
            if (reportId == null) {
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            }
            
            EnergyReportDAO dao = DBManager.getInstance().getEnergyReportDAO();
            EnergyReport report = dao.findByPrimaryKey(reportId);
            
            if (report == null) {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
            
            dao.delete(report);
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}