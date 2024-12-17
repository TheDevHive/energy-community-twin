package com.example.demo.controller;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.controller.Auth.AuthUtility;
import com.example.demo.model.WeatherData;
import com.example.demo.model.generation.GenerateWeatherData;
import com.example.demo.model.generation.TimeRange;
import com.example.demo.persistence.TS_DBManager;
import com.example.demo.persistence.DAO.TS_WeatherDAO;

import jakarta.servlet.http.HttpServletRequest;

import org.springframework.web.bind.annotation.RequestMapping;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
@RequestMapping("/api/weather")
public class WeatherController {

    @GetMapping("/{date}")
    public ResponseEntity<WeatherData> getWeather(HttpServletRequest req, @PathVariable LocalDateTime date) {
        if (!AuthUtility.isAuthorized(req))
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        try {
            if (date == null) {
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            }
            
            TS_WeatherDAO dao = TS_DBManager.getInstance().getTS_WeatherDao();
            WeatherData weather = dao.findByPrimaryKey(date);
            
            if (weather == null) {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
            
            return new ResponseEntity<>(weather, HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/interval")
    public ResponseEntity<List<WeatherData>> getWeather(HttpServletRequest req, @RequestBody TimeRange timeRange) {
        if (!AuthUtility.isAuthorized(req))
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        try {
            if (timeRange.getStart() == null || timeRange.getEnd() == null) {
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            }
            
            GenerateWeatherData.generateOrGet(timeRange.getStart(), timeRange.getEnd());
            TS_WeatherDAO dao = TS_DBManager.getInstance().getTS_WeatherDao();
            List<WeatherData> weather = dao.findByInterval(timeRange.getStart(), timeRange.getEnd());
            if (weather == null) {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
            return new ResponseEntity<>(weather, HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
