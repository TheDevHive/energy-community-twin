package com.example.demo.model;

public class Apartment {
    private int id;
    private Building building;
    private int residents;
    private int square_footage;
    private String energy_class;
    private User user;

    public Apartment(int id, Building building, int residents, int square_footage, String energy_class, User user) {
        this.id = id;
        this.building = building;
        this.residents = residents;
        this.square_footage = square_footage;
        this.energy_class = energy_class;
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
        return square_footage;
    }

    public String getEnergyClass() {
        return energy_class;
    }

    public User getUser() {
        return user;
    }

    public void setId(int id) {
        this.id = id;
    }

    public void setBuilding(Building building) {
        this.building = building;
    }

    public void setResidents(int residents) {
        this.residents = residents;
    }

    public void setSquareFootage(int square_footage) {
        this.square_footage = square_footage;
    }

    public void setEnergyClass(String energy_class) {
        this.energy_class = energy_class;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String toString() {
        return "Apartment{" +
                "id=" + id +
                ", building=" + building +
                ", residents=" + residents +
                ", square_footage=" + square_footage +
                ", energy_class=" + energy_class +
                ", user=" + user +
                '}';
    }

    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Apartment apartment = (Apartment) o;
        return id == apartment.id;
    }

    public Apartment(){

    }
}
