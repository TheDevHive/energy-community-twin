package com.example.demo.model.generation;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

import com.example.demo.model.Apartment;
import com.example.demo.model.ApartmentDevice;
import com.example.demo.model.Building;
import com.example.demo.model.BuildingDevice;
import com.example.demo.model.Device;
import com.example.demo.model.EnergyCurve;
import com.example.demo.model.EnergyReport;
import com.example.demo.model.TS_Device;
import com.example.demo.model.TS_Measurement;
import com.example.demo.model.TimeSeriesData;
import com.example.demo.persistence.DBManager;
import com.example.demo.persistence.TS_DBManager;
import com.example.demo.persistence.DAO.ApartmentDAO;
import com.example.demo.persistence.DAO.ApartmentDeviceDAO;
import com.example.demo.persistence.DAO.BuildingDeviceDAO;
import com.example.demo.persistence.DAO.TS_DeviceDAO;
import com.example.demo.persistence.DAO.TS_MeasurementDAO;

public class GenerateData {

    public static double generate(LocalDateTime date, int hour, EnergyCurve energyCurve) {
        if (date == null) {
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
        System.out.println("sto generando...");
        return random.nextGaussian(energyCurve.getEnergyCurve().get(hour),
                energyCurve.getEnergyCurve().stream().mapToDouble(Integer::doubleValue).average().getAsDouble() * 0.1);
    }

    public static boolean generateDataDevice(String uuid, LocalDateTime dateStart, LocalDateTime dateEnd, int reportId) {
        TS_DeviceDAO ts_DeviceDAO = TS_DBManager.getInstance().getTS_DeviceDAO();
        TS_Device ts_device = ts_DeviceDAO.findByUuid(uuid);
        TS_MeasurementDAO ts_MeasurementDAO = TS_DBManager.getInstance().getTS_MeasurementDAO();
        Device device = null;
        if (ts_device.getUuid().startsWith("A")) {
            device = DBManager.getInstance().getApartmentDeviceDAO()
                    .findByPrimaryKey(Integer.parseInt(ts_device.getUuid().substring(1)));
        } else if (ts_device.getUuid().startsWith("B")) {
            device = DBManager.getInstance().getBuildingDeviceDAO()
                    .findByPrimaryKey(Integer.parseInt(ts_device.getUuid().substring(1)));
        }
        if (device == null) {
            return false;
        }

        int hours = CalculateDate.dateDifferenceHours(dateEnd, dateStart);
        int prodOrCons = device.getConsumesEnergy() ? 1 : -1;
        for (int i = 0; i < hours; i++) {
            LocalDateTime date = CalculateDate.hoursAdd(dateStart, i);
            double energy = GenerateData.generate(date, date.getHour(),
                    device.getEnergyCurve()) * prodOrCons;
            TS_Measurement ts_measurement = new TS_Measurement(-1, ts_device.getId(), reportId, date, energy);
            ts_MeasurementDAO.saveOrUpdate(ts_measurement);
        }
        return true;
    }

    public static ArrayList<String> generateDataBuilding(List<BuildingDevice> devices, LocalDateTime dateStart,
            LocalDateTime dateEnd, int reportId) {
        ArrayList<String> uuids = new ArrayList<>();
        for (BuildingDevice buildingDevice : devices) {
            String uuid = "B" + buildingDevice.getId();
            if (generateDataDevice(uuid, dateStart, dateEnd, reportId)) {
                uuids.add(uuid);
            }
        }
        return uuids;
    }

    public static ArrayList<String> generateDataApartment(List<ApartmentDevice> devices, LocalDateTime dateStart,
            LocalDateTime dateEnd, int reportId) {
        ArrayList<String> uuids = new ArrayList<>();
        for (ApartmentDevice apartmentDevice : devices) {
            String uuid = "A" + apartmentDevice.getId();
            if (generateDataDevice(uuid, dateStart, dateEnd, reportId)) {
                uuids.add(uuid);
            }
        }
        return uuids;
    }

    public static ArrayList<String> generateDataCommunity(List<Building> buildings, LocalDateTime dateStart,
            LocalDateTime dateEnd, int reportId) {
        ArrayList<String> uuids = new ArrayList<>();
        BuildingDeviceDAO buildingDeviceDAO = DBManager.getInstance().getBuildingDeviceDAO();
        ApartmentDAO apartmentDAO = DBManager.getInstance().getApartmentDAO();
        ApartmentDeviceDAO apartmentDeviceDAO = DBManager.getInstance().getApartmentDeviceDAO();
        for (Building building : buildings) {
            uuids.addAll(generateDataBuilding(buildingDeviceDAO.findByBuilding(building), dateStart, dateEnd, reportId));
            for (Apartment apartment : apartmentDAO.findByBuilding(building)) {
                uuids.addAll(generateDataApartment(apartmentDeviceDAO.findByApartment(apartment), dateStart, dateEnd, reportId));
            }
        }
        return uuids;
    }

    public static boolean generateReport(EnergyReport report, List<String> deviceList, LocalDateTime start,
            LocalDateTime end, String resUUID) {
        System.out.println("A");
        report = DBManager.getInstance().getEnergyReportDAO().findByPrimaryKey(report.getId());
        List<TimeSeriesData> ltsd = report.getTimeSeriesData();
        System.out.println("ciao " + ltsd.size());
        for (TimeSeriesData tsd : ltsd) {
            System.out.println("ciao " + tsd.getDate() + " " + tsd.getProduction());
        }
        double production = ltsd.stream().map(tsd -> tsd.getProduction()).filter(num -> num > 0).mapToDouble(Double::doubleValue).sum();
        double consumption = ltsd.stream().map(tsd -> tsd.getProduction()).filter(num -> num > 0).mapToDouble(Double::doubleValue).sum();
        report.setTotalProduction(production);
        report.setTotalConsumption(consumption);
        report.setTotalDifference(production + consumption);
        report.setRefUUID(resUUID);
        report.setDevices(deviceList.size());
        report.setStartDate(start);
        report.setEndDate(end);
        report.setDays(CalculateDate.dateDifferenceHours(end, start)/24);
        System.out.println("total production: " + production);
        System.out.println("total consumption: " + consumption);
        System.out.println("total difference: " + (production + consumption));
        return DBManager.getInstance().getEnergyReportDAO().saveOrUpdate(report);
    }

}
