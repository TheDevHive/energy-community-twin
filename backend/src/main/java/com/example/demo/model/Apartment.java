package com.example.demo.model;

public class Apartment {
    private int id;
    private Building building;
    private int residents;
    private int squareFootage;
    private String energyClass;
    private double energy_cost;
    private User user;

    public Apartment(int id, Building building, int residents, int squareFootage, String energyClass,
            double energy_cost, User user) {
        this.id = id;
        this.building = building;
        this.residents = residents;
        this.squareFootage = squareFootage;
        this.energyClass = energyClass;
        this.energy_cost = energy_cost;
        this.user = user;
    }

    public int getId() {
        return id;
    }

    public Building getBuilding() {
        return building;
    }

    public int getResidents() {
        return residents;
    }

    public int getSquareFootage() {
        return squareFootage;
    }

    public String getEnergyClass() {
        return energyClass;
    }

    public double getEnergyCost() {
        return energy_cost;
    }

    public User getUser() {
        return user;
    }

    public void setId(int id) {
        this.id = id;
    }

    public void getBuilding(Building building) {
        this.building = building;
    }

    public void setBuilding(Building building) {
        this.building = building;
    }

    public void setResidents(int residents) {
        this.residents = residents;
    }

    public void setSquareFootage(int square_footage) {
        this.squareFootage = square_footage;
    }

    public void setEnergyClass(String energy_class) {
        this.energyClass = energy_class;
    }

    public void setEnergyCost(double energy_cost) {
        this.energy_cost = energy_cost;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String toString() {
        return "Apartment{" +
                "id=" + id +
                ", building=" + building +
                ", residents=" + residents +
                ", square_footage=" + squareFootage +
                ", energy_class=" + energyClass +
                ", energy_cost=" + energy_cost +
                ", user=" + user +
                '}';
    }

    public boolean equals(Object o) {
        if (this == o)
            return true;
        if (o == null || getClass() != o.getClass())
            return false;
        Apartment apartment = (Apartment) o;
        return id == apartment.id;
    }

    public Apartment() {

    }
}
