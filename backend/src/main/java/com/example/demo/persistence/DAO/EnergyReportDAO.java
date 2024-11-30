package com.example.demo.persistence.DAO;

import com.example.demo.model.EnergyReport;
import com.example.demo.model.TS_Measurement;
import com.example.demo.model.TimeSeriesData;
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
                    "total_production, total_consumption, total_difference) " +
                    "VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
            try (PreparedStatement pstmt = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
                setStatementParameters(pstmt, report);
                pstmt.executeUpdate();
                ResultSet rs = pstmt.getGeneratedKeys();
                if (rs.next()) {
                    report.setId(rs.getInt(1));
                }
                
                // Save associated time series data
                //if (report.getTimeSeriesData() != null) {
                //    saveTimeSeriesData(report);
                //}
            } catch (SQLException e) {
                e.printStackTrace();
                return false;
            }
        } else {
            String sql = "UPDATE energy_report SET ref_uuid = ?, start_date = ?, end_date = ?, " +
                    "days = ?, devices = ?, total_production = ?, total_consumption = ?, " +
                    "total_difference = ? WHERE id = ?";
            try (PreparedStatement pstmt = connection.prepareStatement(sql)) {
                setStatementParameters(pstmt, report);
                pstmt.setInt(9, report.getId());
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
        pstmt.setInt(4, report.getDays());
        pstmt.setInt(5, report.getDevices());
        pstmt.setDouble(6, report.getTotalProduction());
        pstmt.setDouble(7, report.getTotalConsumption());
        pstmt.setDouble(8, report.getTotalDifference());
    }

    public EnergyReport findByPrimaryKey(int id) {
        String sql = "SELECT * FROM energy_report WHERE id = ?";
        try (PreparedStatement pstmt = connection.prepareStatement(sql)) {
            pstmt.setInt(1, id);
            ResultSet rs = pstmt.executeQuery();
            if (rs.next()) {
                EnergyReport report = mapResultSetToEnergyReport(rs);
                // Load associated time series data
                report.setTimeSeriesData(loadTimeSeriesData(id));
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
                report.setTimeSeriesData(loadTimeSeriesData(report.getId()));
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
                report.setTimeSeriesData(loadTimeSeriesData(report.getId()));
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
            new ArrayList<>() // Time series data will be loaded separately
        );
    }

    /* private void deleteTimeSeriesData(int reportId) {
        String sql = "DELETE FROM time_series_data WHERE report_id = ?";
        try (PreparedStatement pstmt = connection.prepareStatement(sql)) {
            pstmt.setint(1, reportId);
            pstmt.executeUpdate();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    } */

    private List<TimeSeriesData> loadTimeSeriesData(int reportId) {
        TS_MeasurementDAO tsmd = TS_DBManager.getInstance().getTS_MeasurementDAO();
        List<TimeSeriesData> timeSeriesDataList = new ArrayList<>();
        for (TS_Measurement measurement : tsmd.findByReportId(reportId)) {
            TimeSeriesData tsd = new TimeSeriesData(
                measurement.getTimestamp(),
                measurement.getValue()
            );
            timeSeriesDataList.add(tsd);
        }

        return timeSeriesDataList;
    }
}