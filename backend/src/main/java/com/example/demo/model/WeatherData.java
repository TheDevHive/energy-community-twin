package com.example.demo.model;

import java.time.LocalDateTime;

public class WeatherData {
    private LocalDateTime date;
    private float temperature; // Temperature in degrees Celsius
    private float precipitation; // Precipitation in mm
    private float cloudCover; // Cloud cover percentage
    private double windSpeed; // Wind speed in Km/h

    // Default constructor
    public WeatherData() {
    }

    // Full constructor
    public WeatherData(LocalDateTime date, float temperature, float precipitation, float cloudCover, double windSpeed) {
        this.date = date;
        this.temperature = temperature;
        this.precipitation = precipitation;
        this.cloudCover = cloudCover;
        this.windSpeed = windSpeed;
    }

    // Getters and Setters
    public LocalDateTime getDate() {
        return date;
    }

    public void setDate(LocalDateTime date) {
        this.date = date;
    }

    public float getTemperature() {
        return temperature;
    }

    public void setTemperature(float temperature) {
        this.temperature = temperature;
    }

    public float getPrecipitation() {
        return precipitation;
    }

    public void setPrecipitation(float precipitation) {
        this.precipitation = precipitation;
    }

    public float getCloudCover() {
        return cloudCover;
    }

    public void setCloudCover(float cloudCover) {
        this.cloudCover = cloudCover;
    }

    public double getWindSpeed() {
        return windSpeed;
    }

    public void setWindSpeed(double windSpeed) {
        this.windSpeed = windSpeed;
    }

    @Override
    public String toString() {
        return "WeatherData{" +
                "date=" + date +
                ", temperature=" + temperature +
                ", precipitation=" + precipitation +
                ", cloudCover=" + cloudCover +
                ", windSpeed=" + windSpeed +
                '}';
    }

}