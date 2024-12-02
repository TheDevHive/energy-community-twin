package com.example.demo.model;

public class BuildingStats {

    private int buildingId;
    private int apartments;
    private int members;
    private double energyProduction;
    private double energyConsumption;
    private char energyClass;

    public BuildingStats(int buildingId, int apartments, int members, double energyProduction, double energyConsumption) {
        this.buildingId = buildingId;
        this.apartments = apartments;
        this.members = members;
        this.energyProduction = energyProduction;
        this.energyConsumption = energyConsumption;
        this.energyClass = energyClass;
    }

    public int getApartments() {
        return apartments;
    }

    public int getMembers() {
        return members;
    }

    public char getEnergyClass() {
        return energyClass;
    }

    public double getEnergyProduction() {
        return energyProduction;
    }

    public double getEnergyConsumption() {
        return energyConsumption;
    }

    public void setApartments(int apartments) {
        this.apartments = apartments;
    }

    public void setMembers(int members) {
        this.members = members;
    }

    public void setEnergyProduction(double energyProduction) {
        this.energyProduction = energyProduction;
    }

    public void setEnergyConsumption(double energyConsumption) {
        this.energyConsumption = energyConsumption;
    }

    public int getBuildingId() {
        return buildingId;
    }

    public void setBuildingId(int buildingId) {
        this.buildingId = buildingId;
    }

    public void setEnergyClass(char energyClass) {
        this.energyClass = energyClass;
    }

    public String toString() {
        return "BuildingStats{" +
                "buildingId=" + buildingId +
                ", apartments=" + apartments +
                ", members=" + members +
                ", energyProduction=" + energyProduction +
                ", energyConsumption=" + energyConsumption +
                ", energyClass=" + energyClass +
                '}';
    }
}
