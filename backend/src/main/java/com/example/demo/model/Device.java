package com.example.demo.model;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;

public class Device {
    private int id;
    private String name;
    private String logPath;
    private boolean consumesEnergy;
    private String energyClass;

    public Device(int id, String name, String logPath, boolean consumesEnergy, String energyClass) {
        this.id = id;
        this.name = name;
        this.logPath=logPath;
        this.consumesEnergy = consumesEnergy;
        this.energyClass = energyClass;
    }

    public int getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getLogPath() {
        return logPath;
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

    public void setLogPath(String logPath) {
        this.logPath = logPath;
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
                ", logPath=" + logPath +
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
