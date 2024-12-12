package com.example.demo.model;

public class Building {
    private int id;
    private Community community;

    private String address;

    private int floors;
    private double energy_cost;

    public Building(int id, Community community, String address, int floors, double energy_cost) {
        this.id = id;
        this.community = community;
        this.address = address;
        this.floors = floors;
        this.energy_cost = energy_cost;
    }

    public int getId() {
        return id;
    }

    public Community getCommunity() {
        return community;
    }

    public String getAddress() {
        return address;
    }

    public int getFloors() {
        return floors;
    }

    public double getEnergyCost() {
        return energy_cost;
    }

    public String toString() {
        return "Building{" +
                "id=" + id +
                ", community=" + community +
                ", address='" + address + '\'' +
                ", floors=" + floors +
                ", energy_cost=" + energy_cost +
                '}';
    }

    public void setId(int id) {
        this.id = id;
    }

    public void setCommunity(Community community) {
        this.community = community;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public void setFloors(int floors) {
        this.floors = floors;
    }

    public void setEnergyCost(double energy_cost) {
        this.energy_cost = energy_cost;
    }

    public boolean equals(Object o) {
        if (this == o)
            return true;
        if (o == null || getClass() != o.getClass())
            return false;
        Building building = (Building) o;
        if (id != building.id)
            return false;
        return true;
    }

    public Building() {

    }
}
