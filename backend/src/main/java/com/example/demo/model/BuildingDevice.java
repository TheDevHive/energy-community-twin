package com.example.demo.model;

public class BuildingDevice extends Device {

    private Building building;
    public BuildingDevice(int id, String name, int consumesEnergy, EnergyCurve energyCurve, Building building, float windSensitivity, float lightSensitivity, float temperatureSensitivity, float precipitationSensitivity) {
        super(id, name, consumesEnergy, energyCurve, windSensitivity, lightSensitivity, temperatureSensitivity, precipitationSensitivity);
        this.building = building;
    }

    public Building getBuilding() {
        return building;
    }

    public void setBuilding(Building building) {
        this.building = building;
    }

    public String toString() {
        return "BuldingDevice{" +
                super.toString() +
                "building=" + building +
                '}';
    }
}
