package com.example.demo.persistence.DAO;

import com.example.demo.model.Building;
import com.example.demo.model.BuildingDevice;
import com.example.demo.persistence.DBManager;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

public class BuildingDeviceDAO {
    Connection connection;

    public BuildingDeviceDAO(Connection connection) {
        this.connection = connection;
    }

    public BuildingDevice findByPrimaryKey(int id) {
        String sql = "SELECT * FROM building_device WHERE id = ?";
        BuildingDevice buldingDevice = null;
        try(PreparedStatement pstmt = connection.prepareStatement(sql)) {
            pstmt.setInt(1, id);
            ResultSet rs = pstmt.executeQuery();
            if(rs.next()) {
                Building building = DBManager.getInstance().getBuildingDAO().findByPrimaryKey(rs.getInt("building_id"));
                if(building == null) {
                    return null;
                }
                buldingDevice = new BuildingDevice(rs.getInt("id"), rs.getString("name"), rs.getString("log_path"), rs.getBoolean("consumes_energy"), rs.getString("energy_class"),building);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return buldingDevice;
    }

    public boolean saveOrUpdate(BuildingDevice buldingDevice) {
        if(findByPrimaryKey(buldingDevice.getId()) == null) {
            String sql = "INSERT INTO building_device (name, log_path, consumes_energy, energy_class, building_id) VALUES (?, ?, ?, ?, ?)";
            try(PreparedStatement pstmt = connection.prepareStatement(sql)) {
                pstmt.setString(1, buldingDevice.getName());
                pstmt.setString(2, buldingDevice.getLogPath());
                pstmt.setBoolean(3, buldingDevice.consumesEnergy());
                pstmt.setString(4, buldingDevice.getEnergyClass());
                pstmt.setInt(5, buldingDevice.getBuilding().getId());
                pstmt.executeUpdate();
                ResultSet rs = pstmt.getGeneratedKeys();
                if(rs.next()) {
                    buldingDevice.setId(rs.getInt(1));
                }
            } catch (SQLException e) {
                e.printStackTrace();
                return false;
            }
        } else {
            String sql = "UPDATE building_device SET building_id = ?, name = ?, log_path = ?, consumes_energy = ?, energy_class = ? WHERE id = ?";
            try(PreparedStatement pstmt = connection.prepareStatement(sql)) {
                pstmt.setInt(1, buldingDevice.getBuilding().getId());
                pstmt.setString(2, buldingDevice.getName());
                pstmt.setString(3, buldingDevice.getLogPath());
                pstmt.setBoolean(4, buldingDevice.consumesEnergy());
                pstmt.setString(5, buldingDevice.getEnergyClass());
                pstmt.setInt(6, buldingDevice.getId());
                pstmt.executeUpdate();
            } catch (SQLException e) {
                e.printStackTrace();
                return false;
            }
        }
        return true;
    }

    public boolean delete(BuildingDevice buldingDevice) {
        String sql = "DELETE FROM building_device WHERE id = ?";
        try (PreparedStatement pstmt = connection.prepareStatement(sql)) {
            pstmt.setInt(1, buldingDevice.getId());
            pstmt.executeUpdate();
            return true;
        } catch (SQLException e) {
            e.printStackTrace();
            return false;
        }
    }

    public List<BuildingDevice> findAll() {
        String sql = "SELECT * FROM building_device";
        try (PreparedStatement pstmt = connection.prepareStatement(sql)) {
            ResultSet rs = pstmt.executeQuery();
            List<BuildingDevice> buldingDevices = new ArrayList<>();
            while (rs.next()) {
                Building building = DBManager.getInstance().getBuildingDAO().findByPrimaryKey(rs.getInt("building_id"));
                if(building == null) {
                    return null;
                }
                buldingDevices.add(new BuildingDevice(rs.getInt("id"), rs.getString("name"), rs.getString("log_path"), rs.getBoolean("consumes_energy"), rs.getString("energy_class"), building));
            }
            return buldingDevices;
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return null;
    }

}
