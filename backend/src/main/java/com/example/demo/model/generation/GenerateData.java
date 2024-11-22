package com.example.demo.model.generation;

import java.util.Random;

import com.example.demo.model.Device;
import com.example.demo.model.EnergyCurve;
import com.example.demo.model.TS_Device;
import com.example.demo.model.TS_Measurement;
import com.example.demo.persistence.DBManager;
import com.example.demo.persistence.TS_DBManager;
import com.example.demo.persistence.DAO.TS_DeviceDAO;
import com.example.demo.persistence.DAO.TS_MeasurementDAO;

public class GenerateData {

    public static double generate(String date, int hour, EnergyCurve energyCurve) {
        if (date == null || date.isEmpty()) {
            throw new IllegalArgumentException("String is empty");
        }
        if (hour < 0 || hour > 23) {
            throw new IllegalArgumentException("Hour must be between 0 and 23");
        }
        if (energyCurve == null) {
            throw new IllegalArgumentException("EnergyCurve is null");
        }
        if (!energyCurve.validate()) {
            throw new IllegalArgumentException("EnergyCurve is not valid");
        }
        Random random = new Random();
        return random.nextGaussian(energyCurve.getEnergyCurve().get(hour),
                energyCurve.getEnergyCurve().stream().mapToDouble(Integer::doubleValue).average().getAsDouble() * 0.1);
    }

    public static boolean generateDataDevice(String uuid, String dateStart, String dateEnd) {
        TS_DeviceDAO ts_DeviceDAO = TS_DBManager.getInstance().getTS_DeviceDAO();
        TS_Device ts_device = ts_DeviceDAO.findByUuid(uuid);
        TS_MeasurementDAO ts_MeasurementDAO = TS_DBManager.getInstance().getTS_MeasurementDAO();
        Device device = null;
        if (ts_device.getUuid().startsWith("A")) {
            device = DBManager.getInstance().getApartmentDeviceDAO()
                    .findByPrimaryKey(Integer.parseInt(ts_device.getUuid(), 1, ts_device.getUuid().length() - 2, 10));
        } else if (ts_device.getUuid().startsWith("B")) {
            device = DBManager.getInstance().getBuildingDeviceDAO()
                    .findByPrimaryKey(Integer.parseInt(ts_device.getUuid(), 1, ts_device.getUuid().length() - 2, 10));
        }
        if (device == null) {
            return false;
        }

        int hours = CalculateDate.dateDifferenceHours(dateEnd, dateStart);
        for (int i = 0; i < hours; i++) {
            String date = CalculateDate.hoursAdd(dateStart, i);
            double energy = GenerateData.generate(date, CalculateDate.parseDateTime(date, true).getHour(),
                    device.getEnergyCurve());
            TS_Measurement ts_measurement = new TS_Measurement(-1, ts_device.getId(), date, energy);
            ts_MeasurementDAO.saveOrUpdate(ts_measurement);
        }
        return true;
    }

}
