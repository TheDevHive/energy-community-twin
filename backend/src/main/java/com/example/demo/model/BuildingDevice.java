package com.example.demo.model;

public class BuildingDevice extends Device{

    private Building building;
    public BuildingDevice(int id, String name, int energy, String energyClass, Building building) {
        super(id, name, energy, energyClass);
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
