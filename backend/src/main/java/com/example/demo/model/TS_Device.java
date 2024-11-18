package com.example.demo.model;

public class TS_Device {
    private int id;
    private String uuid;

    public TS_Device(int id, String uuid) {
        this.id = id;
        this.uuid = uuid;
    }

    public int getId() {
        return id;
    }

    public String getUuid() {
        return uuid;
    }

    public String toString() {
        return "TS_Device{" +
                "id=" + id +
                ", uuid=" + uuid +
                '}';
    }

    public boolean equals(Object o) {
        if (this == o)
            return true;
        if (o == null || getClass() != o.getClass())
            return false;
        TS_Device ts_device = (TS_Device) o;
        if (id != ts_device.id)
            return false;
        return true;
    }
}
