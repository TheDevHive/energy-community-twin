package com.example.demo.persistence.DAO;

import com.example.demo.model.EnergyReport;
import com.example.demo.model.TS_Measurement;
import com.example.demo.model.TimeSeriesData;
import com.example.demo.persistence.DBManager;
import com.example.demo.persistence.TS_DBManager;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class EnergyReportDAO {
    private Connection connection;

    public EnergyReportDAO(Connection connection) {
        this.connection = connection;
    }

    public boolean saveOrUpdate(EnergyReport report) {
        if (findByPrimaryKey(report.getId()) == null || report.getId() == 0) {
            String sql = "INSERT INTO energy_report (ref_uuid, start_date, end_date, days, devices, " +
                    "total_production, total_consumption, total_difference, battery_usage, battery_end, total_cost) " +
                    "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
            try (PreparedStatement pstmt = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
                setStatementParameters(pstmt, report);
                pstmt.executeUpdate();
                ResultSet rs = pstmt.getGeneratedKeys();
                if (rs.next()) {
                    report.setId(rs.getInt(1));
                }
            } catch (SQLException e) {
                e.printStackTrace();
                return false;
            }
        } else {
            String sql = "UPDATE energy_report SET ref_uuid = ?, start_date = ?, end_date = ?, " +
                    "days = ?, devices = ?, total_production = ?, total_consumption = ?, " +
                    "total_difference = ?, battery_usage = ?, battery_end = ?, total_cost = ? WHERE id = ?";
            try (PreparedStatement pstmt = connection.prepareStatement(sql)) {
                setStatementParameters(pstmt, report);
                pstmt.setInt(12, report.getId());
                pstmt.executeUpdate();
                
            } catch (SQLException e) {
                e.printStackTrace();
                return false;
            }
        }
        return true;
    }

    private void setStatementParameters(PreparedStatement pstmt, EnergyReport report) throws SQLException {
        pstmt.setString(1, report.getRefUUID());
        pstmt.setTimestamp(2, Timestamp.valueOf(report.getStartDate()));
        pstmt.setTimestamp(3, Timestamp.valueOf(report.getEndDate()));
        pstmt.setInt(4, report.getDays() + 1);
        pstmt.setInt(5, report.getDevices());
        pstmt.setDouble(6, report.getTotalProduction());
        pstmt.setDouble(7, report.getTotalConsumption());
        pstmt.setDouble(8, report.getTotalDifference());
        pstmt.setDouble(9, report.getBatteryUsage());
        pstmt.setDouble(10, report.getBatteryEnd());
        pstmt.setDouble(11, report.getTotalCost());
    }

    public EnergyReport findByPrimaryKey(int id) {
        String sql = "SELECT * FROM energy_report WHERE id = ?";
        try (PreparedStatement pstmt = connection.prepareStatement(sql)) {
            pstmt.setInt(1, id);
            ResultSet rs = pstmt.executeQuery();
            if (rs.next()) {
                EnergyReport report = mapResultSetToEnergyReport(rs);
                // Load associated time series data
                report.setTimeSeriesDataDevice(loadTimeSeriesDataDevice(id));
                report.setTimeSeriesDataBattery(loadTimeSeriesDataBattary(id));
                return report;
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return null;
    }

    public List<EnergyReport> findByRefUUID(String refUUID) {
        String sql = "SELECT * FROM energy_report WHERE ref_uuid = ?";
        try (PreparedStatement pstmt = connection.prepareStatement(sql)) {
            pstmt.setString(1, refUUID);
            ResultSet rs = pstmt.executeQuery();
            List<EnergyReport> reports = new ArrayList<>();
            while (rs.next()) {
                EnergyReport report = mapResultSetToEnergyReport(rs);
                report.setTimeSeriesDataDevice(loadTimeSeriesDataDevice(report.getId()));
                report.setTimeSeriesDataBattery(loadTimeSeriesDataBattary(report.getId()));
                reports.add(report);
            }
            return reports;
        } catch (SQLException e) {
            e.printStackTrace();
            return null;
        }
    }

    public boolean delete(EnergyReport report) {
        // First delete associated time series data
        // deleteTimeSeriesData(report.getId());
        
        // Then delete the energy report
        String sql = "DELETE FROM energy_report WHERE id = ?";
        try (PreparedStatement pstmt = connection.prepareStatement(sql)) {
            pstmt.setInt(1, report.getId());
            pstmt.executeUpdate();
            return true;
        } catch (SQLException e) {
            e.printStackTrace();
            return false;
        }
    }

    public List<EnergyReport> findAll() {
        String sql = "SELECT * FROM energy_report";
        try (PreparedStatement pstmt = connection.prepareStatement(sql)) {
            ResultSet rs = pstmt.executeQuery();
            List<EnergyReport> reports = new ArrayList<>();
            while (rs.next()) {
                EnergyReport report = mapResultSetToEnergyReport(rs);
                report.setTimeSeriesDataDevice(loadTimeSeriesDataDevice(report.getId()));
                report.setTimeSeriesDataBattery(loadTimeSeriesDataBattary(report.getId()));
                reports.add(report);
            }
            return reports;
        } catch (SQLException e) {
            e.printStackTrace();
            return null;
        }
    }

    private EnergyReport mapResultSetToEnergyReport(ResultSet rs) throws SQLException {
        return new EnergyReport(
            rs.getInt("id"),
            rs.getString("ref_uuid"),
            rs.getTimestamp("start_date").toLocalDateTime(),
            rs.getTimestamp("end_date").toLocalDateTime(),
            rs.getInt("days"),
            rs.getInt("devices"),
            rs.getDouble("total_production"),
            rs.getDouble("total_consumption"),
            rs.getDouble("total_difference"),
            rs.getDouble("battery_usage"),
            rs.getDouble("battery_end"),
            rs.getDouble("total_cost"),
            new ArrayList<>(), // Time series data will be loaded separately
            new ArrayList<>() // Time series data will be loaded separately
        );
    }

    private List<TimeSeriesData> loadTimeSeriesDataDevice(int reportId) {
        TS_MeasurementDAO tsmd = TS_DBManager.getInstance().getTS_MeasurementDAO();
        BuildingDeviceDAO bdd = DBManager.getInstance().getBuildingDeviceDAO();
        ApartmentDeviceDAO add = DBManager.getInstance().getApartmentDeviceDAO();
        TS_DeviceDAO tdd = TS_DBManager.getInstance().getTS_DeviceDAO();
        List<TimeSeriesData> timeSeriesDataList = new ArrayList<>();
        for (TS_Measurement measurement : tsmd.findByReportId(reportId)) {
            if (tdd.findByPrimaryKey(measurement.getDeviceId()) != null && tdd.findByPrimaryKey(measurement.getDeviceId()).getUuid().startsWith("B")) {
                if (bdd.findByPrimaryKey(tdd.findByPrimaryKey(measurement.getDeviceId()).getId()) != null && bdd.findByPrimaryKey(tdd.findByPrimaryKey(measurement.getDeviceId()).getId()).getConsumesEnergy() == -1) {
                    continue;
                }
            } else if (tdd.findByPrimaryKey(measurement.getDeviceId()) != null && tdd.findByPrimaryKey(measurement.getDeviceId()).getUuid().startsWith("A")) {
                if (add.findByPrimaryKey(Integer.parseInt(tdd.findByPrimaryKey(measurement.getDeviceId()).getUuid(), 1, tdd.findByPrimaryKey(measurement.getDeviceId()).getUuid().length(), 10)) != null && add.findByPrimaryKey(Integer.parseInt(tdd.findByPrimaryKey(measurement.getDeviceId()).getUuid(), 1, tdd.findByPrimaryKey(measurement.getDeviceId()).getUuid().length(), 10)).getConsumesEnergy() == -1) {
                    continue;
                }
            } else {
                continue;
            }
            TimeSeriesData tsd = new TimeSeriesData(
                measurement.getTimestamp(),
                measurement.getValue()
            );
            timeSeriesDataList.add(tsd);
        }

        return timeSeriesDataList;
    }
    private List<TimeSeriesData> loadTimeSeriesDataBattary(int reportId) {
        TS_MeasurementDAO tsmd = TS_DBManager.getInstance().getTS_MeasurementDAO();
        BuildingDeviceDAO bdd = DBManager.getInstance().getBuildingDeviceDAO();
        ApartmentDeviceDAO add = DBManager.getInstance().getApartmentDeviceDAO();
        TS_DeviceDAO tdd = TS_DBManager.getInstance().getTS_DeviceDAO();
        List<TimeSeriesData> timeSeriesDataList = new ArrayList<>();
        for (TS_Measurement measurement : tsmd.findByReportId(reportId)) {
            if (tdd.findByPrimaryKey(measurement.getDeviceId()) != null && tdd.findByPrimaryKey(measurement.getDeviceId()).getUuid().startsWith("B")) {
                if (bdd.findByPrimaryKey(tdd.findByPrimaryKey(measurement.getDeviceId()).getId()) != null && bdd.findByPrimaryKey(tdd.findByPrimaryKey(measurement.getDeviceId()).getId()).getConsumesEnergy() != -1) {
                    continue;
                }
            } else if (tdd.findByPrimaryKey(measurement.getDeviceId()) != null && tdd.findByPrimaryKey(measurement.getDeviceId()).getUuid().startsWith("A")) {
                if (add.findByPrimaryKey(Integer.parseInt(tdd.findByPrimaryKey(measurement.getDeviceId()).getUuid(), 1, tdd.findByPrimaryKey(measurement.getDeviceId()).getUuid().length(), 10)) != null && add.findByPrimaryKey(Integer.parseInt(tdd.findByPrimaryKey(measurement.getDeviceId()).getUuid(), 1, tdd.findByPrimaryKey(measurement.getDeviceId()).getUuid().length(), 10)).getConsumesEnergy() != -1) {
                    continue;
                }
            } else {
                continue;
            }
            TimeSeriesData tsd = new TimeSeriesData(
                measurement.getTimestamp(),
                measurement.getValue()
            );
            timeSeriesDataList.add(tsd);
        }

        return timeSeriesDataList;
    }
}