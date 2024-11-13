package com.example.demo.model;

public class Device {
    private int id;
    private String name;
    private boolean consumesEnergy;
    private EnergyCurve energyCurve;

    public Device(int id, String name, boolean consumesEnergy, EnergyCurve energyCurve) {
        this.id = id;
        this.name = name;
        this.consumesEnergy = consumesEnergy;
        this.energyCurve = energyCurve;
    }

    public int getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public boolean consumesEnergy() {
        return consumesEnergy;
    }

    public EnergyCurve getEnergyCurve() {
        return energyCurve;
    }

    public void setId(int id) {
        this.id = id;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setConsumesEnergy(boolean consumesEnergy) {
        this.consumesEnergy = consumesEnergy;
    }

    public void setEnergyCurve(EnergyCurve energyCurve) {
        this.energyCurve = energyCurve;
    }

    public String toString() {
        return "Device{" +
                "id=" + id +
                ", name=" + name +
                ", consumesEnergy=" + consumesEnergy +
                ", energyCurve=" + energyCurve.toString() +
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
