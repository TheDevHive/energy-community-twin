package com.example.demo.model;

public class ApartmentStats {

    private int apartmentId;
    private String energyClass;
    private int energyProduction;
    private int energyConsumption;

    public ApartmentStats(int apartmentId, int energyProduction, int energyConsumption, String energyClass) {
        this.apartmentId = apartmentId;
        this.energyProduction = energyProduction;
        this.energyConsumption = energyConsumption;
        this.energyClass = energyClass;
    }

    public String getEnergyClass() {
        return energyClass;
    }

    public int getEnergyProduction() {
        return energyProduction;
    }

    public int getEnergyConsumption() {
        return energyConsumption;
    }

    public void setEnergyClass(String energyClass) {
        this.energyClass = energyClass;
    }

    public void setEnergyProduction(int energyProduction) {
        this.energyProduction = energyProduction;
    }

    public void setEnergyConsumption(int energyConsumption) {
        this.energyConsumption = energyConsumption;
    }

    public int getApartmentId() {
        return apartmentId;
    }

    public void setApartmentId(int apartmentId) {
        this.apartmentId = apartmentId;
    }

    public String toString() {
        return "ApartmentStats{" +
                "apartmentId=" + apartmentId +
                ", energyClass=" + energyClass +
                ", energyProduction=" + energyProduction +
                ", energyConsumption=" + energyConsumption +
                '}';
    }
}
