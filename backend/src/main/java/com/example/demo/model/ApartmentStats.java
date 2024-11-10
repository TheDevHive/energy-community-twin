package com.example.demo.model;

public class ApartmentStats {
    private int apartmentId;
    private int energyProduction;
    private int energyConsumption;
    private char energyClass;

    public ApartmentStats(int apartmentId, int energyProduction, int energyConsumption, char energyClass) {
        this.apartmentId = apartmentId;
        this.energyProduction = energyProduction;
        this.energyConsumption = energyConsumption;
        this.energyClass = energyClass;
    }

    public int getApartmentId() {
        return apartmentId;
    }

    public int getEnergyProduction() {
        return energyProduction;
    }

    public int getEnergyConsumption() {
        return energyConsumption;
    }

    public char getEnergyClass() {
        return energyClass;
    }

    public void setApartmentId(int apartmentId) {
        this.apartmentId = apartmentId;
    }

    public void setEnergyProduction(int energyProduction) {
        this.energyProduction = energyProduction;
    }

    public void setEnergyConsumption(int energyConsumption) {
        this.energyConsumption = energyConsumption;
    }

    public void setEnergyClass(char energyClass) {
        this.energyClass = energyClass;
    }

    public String toString() {
        return "ApartmentStats{" +
                "apartmentId=" + apartmentId +
                ", energyProduction=" + energyProduction +
                ", energyConsumption=" + energyConsumption +
                ", energyClass=" + energyClass +
                '}';
    }
}
