package com.example.demo.model;

public class BuildingStats {

    private int buildingId;
    private int apartments;
    private int members;
    private int energyProduction;
    private int energyConsumption;
    private char energyClass;

    public BuildingStats(int buildingId, int apartments, int members, int energyProduction, int energyConsumption, char energyClass) {
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

    public int getEnergyProduction() {
        return energyProduction;
    }

    public int getEnergyConsumption() {
        return energyConsumption;
    }

    public void setApartments(int apartments) {
        this.apartments = apartments;
    }

    public void setMembers(int members) {
        this.members = members;
    }

    public void setEnergyProduction(int energyProduction) {
        this.energyProduction = energyProduction;
    }

    public void setEnergyConsumption(int energyConsumption) {
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
