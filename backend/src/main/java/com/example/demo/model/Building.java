package com.example.demo.model;

public class Building {
    private int id;
    private Community community;

    private String address;

    private int floors;

    public Building(int id, Community community, String address, int floors) {
        this.id = id;
        this.community = community;
        this.address = address;
        this.floors = floors;
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

    public String toString() {
        return "Building{" +
                "id=" + id +
                ", community=" + community +
                ", address='" + address + '\'' +
                ", floors=" + floors +
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

    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Building building = (Building) o;
        if (id != building.id) return false;
        return true;
    }

    public Building(){

    }
}
