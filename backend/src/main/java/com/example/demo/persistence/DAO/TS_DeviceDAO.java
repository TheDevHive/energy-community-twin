package com.example.demo.persistence.DAO;

import com.example.demo.model.TS_Device;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

public class TS_DeviceDAO {
    Connection connection;

    public TS_DeviceDAO(Connection connection) {
        this.connection = connection;
    }

    public TS_Device findByPrimaryKey(int id) {
        String sql = "SELECT * FROM device WHERE device_id = ?";
        TS_Device device = null;
        try (PreparedStatement pstmt = connection.prepareStatement(sql)) {
            pstmt.setInt(1, id);
            ResultSet rs = pstmt.executeQuery();
            if (rs.next()) {
                device = new TS_Device(
                        rs.getInt("device_id"),
                        rs.getString("device_uuid"));
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return device;
    }

    public TS_Device findByUuid(String uuid) {
        String sql = "SELECT * FROM device WHERE device_uuid = ?";
        TS_Device device = null;
        try (PreparedStatement pstmt = connection.prepareStatement(sql)) {
            pstmt.setString(1, uuid);
            ResultSet rs = pstmt.executeQuery();
            if (rs.next()) {
                device = new TS_Device(
                        rs.getInt("device_id"),
                        rs.getString("device_uuid"));
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return device;
    }

    public boolean saveOrUpdate(TS_Device device) {
        if (findByPrimaryKey(device.getId()) == null) {
            String sql = "INSERT INTO device (device_uuid) VALUES (?)";
            try (PreparedStatement pstmt = connection.prepareStatement(sql)) {
                pstmt.setString(1, device.getUuid());
                pstmt.executeUpdate();
                ResultSet rs = pstmt.getGeneratedKeys();
                if (rs.next()) {
                    // Aggiorna l'id con quello generato dal database
                    device = new TS_Device(rs.getInt(1), device.getUuid());
                    return true;
                }
            } catch (SQLException e) {
                e.printStackTrace();
                return false;
            }
        } else {
            String sql = "UPDATE device SET device_uuid = ? WHERE device_id = ?";
            try (PreparedStatement pstmt = connection.prepareStatement(sql)) {
                pstmt.setString(1, device.getUuid());
                pstmt.setInt(2, device.getId());
                pstmt.executeUpdate();
                return true;
            } catch (SQLException e) {
                e.printStackTrace();
                return false;
            }
        }
        return true;
    }

    public boolean delete(TS_Device device) {
        String sql = "DELETE FROM device WHERE device_id = ?";
        try (PreparedStatement pstmt = connection.prepareStatement(sql)) {
            pstmt.setInt(1, device.getId());
            pstmt.executeUpdate();
            return true;
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return false;
    }

    public List<TS_Device> findAll() {
        String sql = "SELECT * FROM device";
        List<TS_Device> devices = new ArrayList<>();
        try (PreparedStatement pstmt = connection.prepareStatement(sql)) {
            ResultSet rs = pstmt.executeQuery();
            while (rs.next()) {
                devices.add(new TS_Device(
                        rs.getInt("device_id"),
                        rs.getString("device_uuid")));
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return devices;
    }
}
