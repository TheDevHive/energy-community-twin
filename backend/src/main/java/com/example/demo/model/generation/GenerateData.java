package com.example.demo.model.generation;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

import com.example.demo.model.Apartment;
import com.example.demo.model.ApartmentDevice;
import com.example.demo.model.Building;
import com.example.demo.model.BuildingDevice;
import com.example.demo.model.Community;
import com.example.demo.model.Device;
import com.example.demo.model.EnergyReport;
import com.example.demo.model.TS_Device;
import com.example.demo.model.TS_Measurement;
import com.example.demo.model.TimeSeriesData;
import com.example.demo.model.WeatherData;
import com.example.demo.persistence.DBManager;
import com.example.demo.persistence.TS_DBManager;
import com.example.demo.persistence.DAO.ApartmentDAO;
import com.example.demo.persistence.DAO.ApartmentDeviceDAO;
import com.example.demo.persistence.DAO.BuildingDAO;
import com.example.demo.persistence.DAO.BuildingDeviceDAO;
import com.example.demo.persistence.DAO.TS_DeviceDAO;
import com.example.demo.persistence.DAO.TS_MeasurementDAO;

public class GenerateData {

    public static double generate(Device device, LocalDateTime timestamp, int reportId){
        if(device.getConsumesEnergy() == -1){
            return 0;
        } else {
            float standardTemperature = 20;
            WeatherData weatherData = TS_DBManager.getInstance().getTS_WeatherDao().findByPrimaryKey(timestamp);
            if (weatherData == null){
                return 0;
            }
            int prodCons = (device.getConsumesEnergy() == 1) ? 1 : -1;
            Random random = new Random();
            double energy = random.nextGaussian(device.getEnergyCurve().getEnergyCurve().get(timestamp.getHour()),
                    device.getEnergyCurve().getEnergyCurve().stream().mapToDouble(Integer::doubleValue).average().getAsDouble() * 0.1);
            // influenza della luce:
            System.out.println("energy A: " + energy);
            float litghtInfluence = (device.getLightSensitivity() * (1-weatherData.getCloudCover()));
            if (litghtInfluence == 0){
                litghtInfluence = 1;
            }
            System.out.println("litghtInfluence: " + litghtInfluence);
            // influenza del vento:
            float windInfluence = (device.getWindSensitivity() * weatherData.getWindSpeed());
            if (windInfluence == 0){
                windInfluence = 1;
            }
            System.out.println("windInfluence: " + windInfluence);
            // influenza della temperatura:
            float temperatureInfluence = (device.getTemperatureSensitivity() * (weatherData.getTemperature() - standardTemperature));
            if (temperatureInfluence == 0){
                temperatureInfluence = 1;
            }
            System.out.println("temperatureInfluence: " + temperatureInfluence);
            // influenza della pioggia:
            float rainInfluence = (device.getPrecipitationSensitivity() * weatherData.getPrecipitation());
            if (rainInfluence == 0){
                rainInfluence = 1;
            }
            System.out.println("rainInfluence: " + rainInfluence);
            energy *= litghtInfluence * windInfluence * temperatureInfluence * rainInfluence;
            energy *= prodCons;
            System.out.println("energy B: " + energy);
            TS_Device ts_device = null;
            if(device instanceof BuildingDevice){
                ts_device = TS_DBManager.getInstance().getTS_DeviceDAO().findByUuid("B" + device.getId());
            } else if(device instanceof ApartmentDevice){
                ts_device = TS_DBManager.getInstance().getTS_DeviceDAO().findByUuid("A" + device.getId());
            }
            TS_DBManager.getInstance().getTS_MeasurementDAO().saveOrUpdate(new TS_Measurement(-1, ts_device.getId(), reportId, timestamp, energy));
            return energy;
        }
    }

    public static List<String> generateData(List<Device> batteries, List<Device> otherDevices, LocalDateTime dateStart, LocalDateTime dateEnd, int reportId) {
        List<String> uuids = new ArrayList<>();
        if (dateEnd.getHour() == 22){
            dateEnd = dateEnd.plusHours(2);
        }
        else if (dateEnd.getHour() == 23){
            dateEnd = dateEnd.plusHours(1);
        }
        int hours = CalculateDate.dateDifferenceHours(dateEnd, dateStart);
        double lastEnergy = 0;
        if(!GenerateWeatherData.generateOrGet(dateStart, dateEnd)){
            return null;
        }
        for(int hour = 0;hour < hours;hour++){
            LocalDateTime date = CalculateDate.hoursAdd(dateStart, hour);
            double energy = 0;
            for(Device device : otherDevices){
                String uuid = null;
                if (device instanceof BuildingDevice) {
                    uuid = "B" + device.getId();
                } else if (device instanceof ApartmentDevice) {
                    uuid = "A" + device.getId();
                } else {
                    continue;
                }
                energy += GenerateData.generate(device, date, reportId);
                uuids.add(uuid);
            }
            double energyToDo = energy;
            for(Device device : batteries){
                TS_Device ts_device = null;
                if(device instanceof BuildingDevice){
                    ts_device = TS_DBManager.getInstance().getTS_DeviceDAO().findByUuid("B" + device.getId());
                } else if(device instanceof ApartmentDevice){
                    ts_device = TS_DBManager.getInstance().getTS_DeviceDAO().findByUuid("A" + device.getId());
                }
                double newEnergy = lastEnergy + energyToDo;
                if (newEnergy < 0){
                    newEnergy = 0;
                } else if (newEnergy > device.getEnergyCurve().getEnergyCurve().get(0)){
                    newEnergy = device.getEnergyCurve().getEnergyCurve().get(0);
                }
                if (energyToDo < 0){
                    energyToDo += (newEnergy - lastEnergy);
                } else {
                    energyToDo -= (newEnergy - lastEnergy);
                }
                lastEnergy = newEnergy;
                TS_Measurement ts_measurement = new TS_Measurement(-1, ts_device.getId(), reportId, date, lastEnergy);
                TS_DBManager.getInstance().getTS_MeasurementDAO().saveOrUpdate(ts_measurement);
                if(lastEnergy == 0){
                    break;
                }
            }
        }
        return uuids;
    }

    public static List<String> generateDataDeviceList(List<Device> devices, LocalDateTime dateStart, LocalDateTime dateEnd, int reportId) {
        List<Device> batteries = new ArrayList<>();
        List<Device> other = new ArrayList<>();
        for (Device device : devices) {
            if(device.getConsumesEnergy() == -1){
                batteries.add(device);
            } else {
                other.add(device);
            }
        }
        return generateData(batteries, other, dateStart, dateEnd, reportId);
    }

    public static List<String> generateDataBuilding(Building building, LocalDateTime dateStart, LocalDateTime dateEnd, int reportId) {
        List<String> uuids = new ArrayList<>();
        BuildingDeviceDAO buildingDeviceDAO = DBManager.getInstance().getBuildingDeviceDAO();
        List<Device> devices = buildingDeviceDAO.findByBuilding(building).stream().map(device -> (Device) device).toList();
        uuids.addAll(generateDataDeviceList(devices, dateStart, dateEnd, reportId));
        ApartmentDAO apartmentDAO = DBManager.getInstance().getApartmentDAO();
        List<Apartment> apartments = apartmentDAO.findByBuilding(building);
        for (Apartment apartment : apartments) {
            uuids.addAll(generateDataApartment(apartment, dateStart, dateEnd, reportId));
        }
        return uuids;
    }

    public static ArrayList<String> generateDataApartment(Apartment apartment, LocalDateTime dateStart, LocalDateTime dateEnd, int reportId) {
        ArrayList<String> uuids = new ArrayList<>();
        ApartmentDeviceDAO apartmentDeviceDAO = DBManager.getInstance().getApartmentDeviceDAO();
        List<Device> devices = apartmentDeviceDAO.findByApartment(apartment).stream().map(device -> (Device) device).toList();
        uuids.addAll(generateDataDeviceList(devices, dateStart, dateEnd, reportId));
        return uuids;
    }

    public static String generateDataDevice(Device device, LocalDateTime dateStart, LocalDateTime dateEnd, int reportId) {
        List<String> uuids = generateDataDeviceList(List.of(device), dateStart, dateEnd, reportId);
        return uuids.get(0);
    }

    public static ArrayList<String> generateDataCommunity(Community community, LocalDateTime dateStart,
            LocalDateTime dateEnd, int reportId) {
        ArrayList<String> uuids = new ArrayList<>();
        BuildingDAO buildingDAO = DBManager.getInstance().getBuildingDAO();
        List<Building> buildings = buildingDAO.findByCommunity(community);
        for (Building building : buildings) {
            uuids.addAll(generateDataBuilding(building, dateStart, dateEnd, reportId));
        }
        return uuids;
    }

    public static boolean generateReport(EnergyReport report, List<String> deviceList, LocalDateTime start,
            LocalDateTime end, String refUUID) {
        report = DBManager.getInstance().getEnergyReportDAO().findByPrimaryKey(report.getId());
        final int reportId = report.getId();
        List<TimeSeriesData> ltsdd = report.getTimeSeriesDataDevice();
        List<TimeSeriesData> ltsdb = report.getTimeSeriesDataBattery();
        double production = ltsdd.stream().map(tsd -> tsd.getProduction()).filter(num -> num > 0).mapToDouble(Double::doubleValue).sum();
        double consumption = ltsdd.stream().map(tsd -> tsd.getProduction()).filter(num -> num <= 0).mapToDouble(Double::doubleValue).sum();
        double batteryUsage = 0;
        double batteryEnd = 0;
        if (ltsdb.size() > 0){
            TimeSeriesData tsdb = ltsdb.get(0);
            for (TimeSeriesData tsd : ltsdb) {
                if (tsd.getProduction() < tsdb.getProduction()){
                    batteryUsage += tsd.getProduction();
                }
                tsdb = tsd;
            }
            batteryEnd = tsdb.getProduction();
        }
        double totalCost = 0;
        BuildingDeviceDAO deviceDao = DBManager.getInstance().getBuildingDeviceDAO();
        ApartmentDeviceDAO apartmentDeviceDAO = DBManager.getInstance().getApartmentDeviceDAO();
        BuildingDAO buildingDAO = DBManager.getInstance().getBuildingDAO();
        ApartmentDAO apartmentDAO = DBManager.getInstance().getApartmentDAO();
        TS_MeasurementDAO tsmd = TS_DBManager.getInstance().getTS_MeasurementDAO();
        TS_DeviceDAO tsdd = TS_DBManager.getInstance().getTS_DeviceDAO();
        for (String uuid : deviceList) {
            if (uuid.startsWith("B")) {
                BuildingDevice device = deviceDao.findByPrimaryKey(Integer.parseInt(uuid, 1, uuid.length(), 10));
                if(device.getConsumesEnergy() != -1){
                    totalCost = device.getBuilding().getEnergyCost() * tsmd.findByDeviceIdAndTimeRange(tsdd.findByUuid(uuid).getId(), start, end).stream().filter(measurement -> measurement.getReportId() == reportId).mapToDouble(TS_Measurement::getValue).sum();
                }
            } else if (uuid.startsWith("A")) {
                //ApartmentDevice device = apartmentDeviceDAO.findByUuid(uuid);
                //totalCost += device.getCost();
            }
        }
        report.setTotalProduction(production);
        report.setTotalConsumption(consumption);
        report.setTotalDifference(production + consumption);
        report.setRefUUID(refUUID);
        report.setDevices(deviceList.size());
        report.setStartDate(start);
        report.setEndDate(end);
        report.setDays(CalculateDate.dateDifferenceHours(end, start)/24);
        report.setBatteryUsage(batteryUsage);
        report.setBatteryEnd(batteryEnd);
        return DBManager.getInstance().getEnergyReportDAO().saveOrUpdate(report);
    }

}
