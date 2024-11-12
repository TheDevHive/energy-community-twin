package com.example.demo.model;

public class Device {
    private int id;
    private String name;
    private int energy;
    private String energyClass;

    public Device(int id, String name, int energy, String energyClass) {
        this.id = id;
        this.name = name;
        this.energy = energy;
        this.energyClass = energyClass;
    }

    public int getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public int getEnergy() {
        return energy;
    }


    public String getEnergyClass() {
        return energyClass;
    }

    public void setId(int id) {
        this.id = id;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setEnergy(int energy) {
        this.energy = energy;
    }

    public void setEnergyClass(String energyClass) {
        this.energyClass = energyClass;
    }

    public String toString() {
        return "Device{" +
                "id=" + id +
                ", name=" + name +
                ", energy=" + energy +
                ", energyClass=" + energyClass +
                '}';
    }

    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        Device device = (Device) o;
        if (id != device.id) {
            return false;
        }
        return true;
    }
}
