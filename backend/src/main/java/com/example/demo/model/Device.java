package com.example.demo.model;

import com.fasterxml.jackson.annotation.JsonProperty;

public class Device {
    private int id;
    private String name;
    private int consumesEnergy;

    private float windSensitivity;
    private float lightSensitivity;
    private float temperatureSensitivity;

    private float precipitationSensitivity;
    @JsonProperty("energy_curve")
    private EnergyCurve energyCurve;
    public Device(int id, String name, int consumesEnergy, EnergyCurve energyCurve, float windSensitivity, float lightSensitivity, float temperatureSensitivity, float precipitationSensitivity) {
        this.id = id;
        this.name = name;
        this.consumesEnergy = consumesEnergy;
        this.energyCurve = energyCurve;
        this.windSensitivity = windSensitivity;
        this.lightSensitivity = lightSensitivity;
        this.temperatureSensitivity = temperatureSensitivity;
        this.precipitationSensitivity = precipitationSensitivity;
    }

    public int getId() {
        return id;
    }

    public float getWindSensitivity() {
        return windSensitivity;
    }

    public float getLightSensitivity() {
        return lightSensitivity;
    }

    public float getTemperatureSensitivity() {
        return temperatureSensitivity;
    }

    public float getPrecipitationSensitivity() {
        return precipitationSensitivity;
    }

    public String getName() {
        return name;
    }

    public int getConsumesEnergy() {
        return consumesEnergy;
    }

    public EnergyCurve getEnergyCurve() {
        return energyCurve;
    }

    public void setId(int id) {
        this.id = id;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setConsumesEnergy(int consumesEnergy) {
        this.consumesEnergy = consumesEnergy;
    }

    public void setEnergyCurve(EnergyCurve energyCurve) {
        this.energyCurve = energyCurve;
    }

    public String toString() {
        return "Device{" +
                "id=" + id +
                ", name=" + name +
                ", consumesEnergy=" + consumesEnergy +
                ", energyCurve=" + energyCurve.toString() +
                ", windSensitivity=" + windSensitivity +
                ", lightSensitivity=" + lightSensitivity +
                ", temperatureSensitivity=" + temperatureSensitivity +
                ", precipitationSensitivity=" + precipitationSensitivity +
                '}';
    }

    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        Device device = (Device) o;
        if (id != device.id) {
            return false;
        }
        return true;
    }
}
