package com.example.demo.model;

public class TS_Measurement {
    private int id;
    private int deviceId;
    private String timestamp;
    private double value;

    public TS_Measurement(int id, int deviceId, String timestamp, double value) {
        this.id = id;
        this.deviceId = deviceId;
        this.timestamp = timestamp;
        this.value = value;
    }

    public int getId() {
        return id;
    }

    public int getDeviceId() {
        return deviceId;
    }

    public String getTimestamp() {
        return timestamp;
    }

    public double getValue() {
        return value;
    }

    public String toString() {
        return "TS_Measurement{" +
                "id=" + id +
                ", deviceId=" + deviceId +
                ", timestamp='" + timestamp + '\'' +
                ", value=" + value +
                '}';
    }

    public boolean equals(Object o) {
        if (this == o)
            return true;
        if (o == null || getClass() != o.getClass())
            return false;
        TS_Measurement ts_measurement = (TS_Measurement) o;
        if (id != ts_measurement.id)
            return false;
        if (deviceId != ts_measurement.deviceId)
            return false;
        if (Double.compare(ts_measurement.value, value) != 0)
            return false;
        if (!timestamp.equals(ts_measurement.timestamp))
            return false;
        return true;
    }
}
