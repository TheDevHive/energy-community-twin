package com.example.demo.model;

public class CommunityStats {

    private int communityId;
    private int buildings;
    private int apartments;
    private int members;
    private int energyProduction;
    private int energyConsumption;

    public CommunityStats(int communityId, int buildings, int apartments, int members, int energyProduction, int energyConsumption) {
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

    public int getEnergyProduction() {
        return energyProduction;
    }

    public int getEnergyConsumption() {
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

    public void setEnergyProduction(int energyProduction) {
        this.energyProduction = energyProduction;
    }

    public void setEnergyConsumption(int energyConsumption) {
        this.energyConsumption = energyConsumption;
    }

    public int getCommunityId() {
        return communityId;
    }

    public void setCommunityId(int communityId) {
        this.communityId = communityId;
    }
}
