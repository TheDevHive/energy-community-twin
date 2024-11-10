package com.example.demo.model;

public class Device {
    private int id;
    private String name;
    private int energy;
    private boolean consumesEnergy;
    private String energyClass;

    public Device(int id, String name, int energy, boolean consumesEnergy, String energyClass) {
        this.id = id;
        this.name = name;
        this.energy = energy;
        this.consumesEnergy = consumesEnergy;
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

    public boolean consumesEnergy() {
        return consumesEnergy;
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
    public void setConsumesEnergy(boolean consumesEnergy) {
        this.consumesEnergy = consumesEnergy;
    }

    public void setEnergyClass(String energyClass) {
        this.energyClass = energyClass;
    }

    public String toString() {
        return "Device{" +
                "id=" + id +
                ", name=" + name +
                ", energy=" + energy +
                ", consumesEnergy=" + consumesEnergy +
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
