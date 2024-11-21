package com.example.demo.model;

public class ApartmentStats {
    private int apartmentId;
    private double energyProduction;
    private double energyConsumption;
    private char energyClass;

    public ApartmentStats(int apartmentId, double energyProduction, double energyConsumption, char energyClass) {
        this.apartmentId = apartmentId;
        this.energyProduction = energyProduction;
        this.energyConsumption = energyConsumption;
        this.energyClass = energyClass;
    }

    public int getApartmentId() {
        return apartmentId;
    }

    public double getEnergyProduction() {
        return energyProduction;
    }

    public double getEnergyConsumption() {
        return energyConsumption;
    }

    public char getEnergyClass() {
        return energyClass;
    }

    public void setApartmentId(int apartmentId) {
        this.apartmentId = apartmentId;
    }

    public void setEnergyProduction(double energyProduction) {
        this.energyProduction = energyProduction;
    }

    public void setEnergyConsumption(double energyConsumption) {
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
