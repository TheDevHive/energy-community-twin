package com.example.demo.controller;

import com.example.demo.controller.Auth.AuthUtility;
import com.example.demo.model.EnergyReport;
import com.example.demo.model.TS_Measurement;
import com.example.demo.model.TimeSeriesData;
import com.example.demo.persistence.DAO.EnergyReportDAO;
import com.example.demo.persistence.DAO.TS_MeasurementDAO;
import com.example.demo.persistence.DBManager;
import com.example.demo.persistence.TS_DBManager;

import jakarta.servlet.http.HttpServletRequest;

import java.nio.charset.StandardCharsets;
import java.util.List;

import org.springframework.http.HttpHeaders;
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
            // delete all time series data:
            TS_MeasurementDAO tsmd = TS_DBManager.getInstance().getTS_MeasurementDAO();
            List<TS_Measurement> tsms = tsmd.findByReportId(reportId);
            for (TS_Measurement tsm : tsms) {
                tsmd.delete(tsm);
            }
            dao.delete(report);
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/{id}/download")
    public ResponseEntity<byte[]> downloadReport(HttpServletRequest req, @PathVariable Integer id) {
        if (!AuthUtility.isAuthorized(req)) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }

        try {
            if (id == null) {
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            }

            EnergyReportDAO dao = DBManager.getInstance().getEnergyReportDAO();
            EnergyReport report = dao.findByPrimaryKey(id);

            if (report == null) {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }

            // Converti l'oggetto EnergyReport in CSV con solo Date e Production
            String csvContent = convertReportToCsv(report);

            // Converte il contenuto CSV in byte
            byte[] csvBytes = csvContent.getBytes(StandardCharsets.UTF_8);

            // Configura le intestazioni HTTP
            HttpHeaders headers = new HttpHeaders();
            headers.add(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"energy_report_" + id + ".csv\"");
            headers.add(HttpHeaders.CONTENT_TYPE, "text/csv; charset=UTF-8");

            return new ResponseEntity<>(csvBytes, headers, HttpStatus.OK);

        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    private String convertReportToCsv(EnergyReport report) {
        StringBuilder csvBuilder = new StringBuilder();

        // Header del CSV
        csvBuilder.append("Date,Production\n");

        // Aggiungi solo le colonne Date e Production
        List<TimeSeriesData> timeSeriesData = report.getTimeSeriesDataDevice();
        for (TimeSeriesData data : timeSeriesData) {
            csvBuilder.append(data.getDate()).append(",").append(data.getProduction()).append("\n");
        }

        return csvBuilder.toString();
    }
}