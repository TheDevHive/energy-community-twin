package com.example.demo.model;

public class BuildingDevice extends Device{

    private Building building;
    public BuildingDevice(int id, String name, String logPath, boolean consumesEnergy, String energyClass, Building building) {
        super(id, name, logPath, consumesEnergy, energyClass);
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
