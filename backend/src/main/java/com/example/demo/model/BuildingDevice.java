package com.example.demo.model;

public class BuildingDevice extends Device {

    private Building building;
    public BuildingDevice(int id, String name, boolean consumesEnergy, EnergyCurve energyCurve, Building building) {
        super(id, name, consumesEnergy, energyCurve);
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
