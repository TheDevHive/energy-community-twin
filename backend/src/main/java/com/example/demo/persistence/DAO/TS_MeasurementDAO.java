package com.example.demo.persistence.DAO;

import com.example.demo.model.TS_Measurement;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

public class TS_MeasurementDAO {
    Connection connection;

    public TS_MeasurementDAO(Connection connection) {
        this.connection = connection;
    }

    public TS_Measurement findByPrimaryKey(int id) {
        String sql = "SELECT * FROM measurement WHERE measurement_id = ?";
        TS_Measurement measurement = null;
        try (PreparedStatement pstmt = connection.prepareStatement(sql)) {
            pstmt.setInt(1, id);
            ResultSet rs = pstmt.executeQuery();
            if (rs.next()) {
                measurement = new TS_Measurement(
                        rs.getInt("measurement_id"),
                        rs.getInt("device_id"),
                        rs.getString("timestamp"),
                        rs.getDouble("value"));
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return measurement;
    }

    public List<TS_Measurement> findByDeviceId(int deviceId) {
        String sql = "SELECT * FROM measurement WHERE device_id = ? ORDER BY timestamp";
        List<TS_Measurement> measurements = new ArrayList<>();
        try (PreparedStatement pstmt = connection.prepareStatement(sql)) {
            pstmt.setInt(1, deviceId);
            ResultSet rs = pstmt.executeQuery();
            while (rs.next()) {
                measurements.add(new TS_Measurement(
                        rs.getInt("measurement_id"),
                        rs.getInt("device_id"),
                        rs.getString("timestamp"),
                        rs.getDouble("value")));
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return measurements;
    }

    public List<TS_Measurement> findByDeviceIdAndTimeRange(int deviceId, String startTime, String endTime) {
        String sql = "SELECT * FROM measurement WHERE device_id = ? AND timestamp BETWEEN ? AND ? ORDER BY timestamp";
        List<TS_Measurement> measurements = new ArrayList<>();
        try (PreparedStatement pstmt = connection.prepareStatement(sql)) {
            pstmt.setInt(1, deviceId);
            pstmt.setString(2, startTime);
            pstmt.setString(3, endTime);
            ResultSet rs = pstmt.executeQuery();
            while (rs.next()) {
                measurements.add(new TS_Measurement(
                        rs.getInt("measurement_id"),
                        rs.getInt("device_id"),
                        rs.getString("timestamp"),
                        rs.getDouble("value")));
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return measurements;
    }

    public boolean saveOrUpdate(TS_Measurement measurement) {
        if (findByPrimaryKey(measurement.getId()) == null) {
            String sql = "INSERT INTO measurement (device_id, timestamp, value) VALUES (?, ?, ?)";
            try (PreparedStatement pstmt = connection.prepareStatement(sql)) {
                pstmt.setInt(1, measurement.getDeviceId());
                pstmt.setString(2, measurement.getTimestamp());
                pstmt.setDouble(3, measurement.getValue());
                pstmt.executeUpdate();
                ResultSet rs = pstmt.getGeneratedKeys();
                if (rs.next()) {
                    measurement = new TS_Measurement(rs.getInt(1),
                            measurement.getDeviceId(),
                            measurement.getTimestamp(),
                            measurement.getValue());
                    return true;
                }
            } catch (SQLException e) {
                e.printStackTrace();
                return false;
            }
        } else {
            String sql = "UPDATE measurement SET device_id = ?, timestamp = ?, value = ? WHERE measurement_id = ?";
            try (PreparedStatement pstmt = connection.prepareStatement(sql)) {
                pstmt.setInt(1, measurement.getDeviceId());
                pstmt.setString(2, measurement.getTimestamp());
                pstmt.setDouble(3, measurement.getValue());
                pstmt.setInt(4, measurement.getId());
                pstmt.executeUpdate();
                return true;
            } catch (SQLException e) {
                e.printStackTrace();
                return false;
            }
        }
        return true;
    }

    public boolean delete(TS_Measurement measurement) {
        String sql = "DELETE FROM measurement WHERE measurement_id = ?";
        try (PreparedStatement pstmt = connection.prepareStatement(sql)) {
            pstmt.setInt(1, measurement.getId());
            pstmt.executeUpdate();
            return true;
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return false;
    }

    public boolean deleteByDeviceId(int deviceId) {
        String sql = "DELETE FROM measurement WHERE device_id = ?";
        try (PreparedStatement pstmt = connection.prepareStatement(sql)) {
            pstmt.setInt(1, deviceId);
            pstmt.executeUpdate();
            return true;
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return false;
    }

    public List<TS_Measurement> findAll() {
        String sql = "SELECT * FROM measurement ORDER BY timestamp";
        List<TS_Measurement> measurements = new ArrayList<>();
        try (PreparedStatement pstmt = connection.prepareStatement(sql)) {
            ResultSet rs = pstmt.executeQuery();
            while (rs.next()) {
                measurements.add(new TS_Measurement(
                        rs.getInt("measurement_id"),
                        rs.getInt("device_id"),
                        rs.getString("timestamp"),
                        rs.getDouble("value")));
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return measurements;
    }
}
