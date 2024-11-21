package com.example.demo.model;

public class CommunityStats {

    private int communityId;
    private int buildings;
    private int apartments;
    private int members;
    private double energyProduction;
    private double energyConsumption;

    public CommunityStats(int communityId, int buildings, int apartments, int members, double energyProduction, double energyConsumption) {
        this.communityId = communityId;
        this.buildings = buildings;
        this.apartments = apartments;
        this.members = members;
        this.energyProduction = energyProduction;
        this.energyConsumption = energyConsumption;
    }

    public int getBuildings() {
        return buildings;
    }

    public int getApartments() {
        return apartments;
    }

    public int getMembers() {
        return members;
    }

    public double getEnergyProduction() {
        return energyProduction;
    }

    public double getEnergyConsumption() {
        return energyConsumption;
    }

    public void setBuildings(int buildings) {
        this.buildings = buildings;
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

    public int getCommunityId() {
        return communityId;
    }

    public void setCommunityId(int communityId) {
        this.communityId = communityId;
    }
}
