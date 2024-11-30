package com.example.demo.model;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class EnergyReport {
    private int id;
    private String refUUID;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private Integer days;
    private Integer devices;
    private Double totalProduction;
    private Double totalConsumption;
    private Double totalDifference;
    private List<TimeSeriesData> timeSeriesData;

    // Default constructor
    public EnergyReport() {
        this.id = 0;
        this.refUUID = "";
        this.startDate = LocalDateTime.now();
        this.endDate = LocalDateTime.now();
        this.days = 0;
        this.devices = 0;
        this.totalProduction = 0.0;
        this.totalConsumption = 0.0;
        this.totalDifference = 0.0;
        this.timeSeriesData = new ArrayList<>();
    }

    // Full constructor
    public EnergyReport(int id, String refUUID, LocalDateTime startDate, LocalDateTime endDate, 
                        Integer days, Integer devices, Double totalProduction, 
                        Double totalConsumption, Double totalDifference, 
                        List<TimeSeriesData> timeSeriesData) {
        this.id = id;
        this.refUUID = refUUID;
        this.startDate = startDate;
        this.endDate = endDate;
        this.days = days;
        this.devices = devices;
        this.totalProduction = totalProduction;
        this.totalConsumption = totalConsumption;
        this.totalDifference = totalDifference;
        this.timeSeriesData = timeSeriesData;
    }

    // Getters and Setters
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getRefUUID() {
        return refUUID;
    }

    public void setRefUUID(String refUUID) {
        this.refUUID = refUUID;
    }

    public LocalDateTime getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDateTime startDate) {
        this.startDate = startDate;
    }

    public LocalDateTime getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDateTime endDate) {
        this.endDate = endDate;
    }

    public Integer getDays() {
        return days;
    }

    public void setDays(Integer days) {
        this.days = days;
    }

    public Integer getDevices() {
        return devices;
    }

    public void setDevices(Integer devices) {
        this.devices = devices;
    }

    public Double getTotalProduction() {
        return totalProduction;
    }

    public void setTotalProduction(Double totalProduction) {
        this.totalProduction = totalProduction;
    }

    public Double getTotalConsumption() {
        return totalConsumption;
    }

    public void setTotalConsumption(Double totalConsumption) {
        this.totalConsumption = totalConsumption;
    }

    public Double getTotalDifference() {
        return totalDifference;
    }

    public void setTotalDifference(Double totalDifference) {
        this.totalDifference = totalDifference;
    }

    public List<TimeSeriesData> getTimeSeriesData() {
        return timeSeriesData;
    }

    public void setTimeSeriesData(List<TimeSeriesData> timeSeriesData) {
        this.timeSeriesData = timeSeriesData;
    }

    public String reportKind(){
        if(refUUID.startsWith("A")){
            return "Apartment";
        } else if(refUUID.startsWith("B")){
            return "Building";
        } else if (refUUID.startsWith("C")){
            return "Community";
        } else if (refUUID.startsWith("D")){
            if (refUUID.startsWith("DA")){
                return "ApartmentDevice";
            } else if (refUUID.startsWith("DB")){
                return "BuildingDevice";
            } else {
                return "Unknown";
            }
        } else {
            return "Unknown";
        }
    }

    // toString method for debugging
    @Override
    public String toString() {
        return "EnergyReport{" +
                "id=" + id +
                ", refUUID='" + refUUID + '\'' +
                ", startDate=" + startDate +
                ", endDate=" + endDate +
                ", days=" + days +
                ", devices=" + devices +
                ", totalProduction=" + totalProduction +
                ", totalConsumption=" + totalConsumption +
                ", totalDifference=" + totalDifference +
                ", timeSeriesData=" + timeSeriesData +
                '}';
    }
}