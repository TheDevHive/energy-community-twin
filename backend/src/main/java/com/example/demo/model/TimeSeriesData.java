package com.example.demo.model;
import java.time.LocalDateTime;

public class TimeSeriesData {
    private LocalDateTime date;
    private Double production;

    // Default constructor
    public TimeSeriesData() {}

    // Full constructor
    public TimeSeriesData(LocalDateTime date, Double production) {
        this.date = date;
        this.production = production;
    }

    // Getters and Setters
    public LocalDateTime getDate() {
        return date;
    }

    public void setDate(LocalDateTime date) {
        this.date = date;
    }

    public Double getProduction() {
        return production;
    }

    public void setProduction(Double production) {
        this.production = production;
    }

    // toString method for debugging
    @Override
    public String toString() {
        return "TimeSeriesData{" +
                "date=" + date +
                ", production=" + production +
                '}';
    }
}
