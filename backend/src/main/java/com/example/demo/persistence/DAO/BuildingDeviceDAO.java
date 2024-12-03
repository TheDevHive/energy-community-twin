package com.example.demo.persistence.DAO;

import com.example.demo.model.Building;
import com.example.demo.model.BuildingDevice;
import com.example.demo.model.EnergyCurve;
import com.example.demo.persistence.DBManager;
import com.example.demo.utility.SQLiteBlobConverter;
import com.fasterxml.jackson.core.JsonProcessingException;

import java.io.IOException;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

public class BuildingDeviceDAO {
    Connection connection;
    SQLiteBlobConverter blobConverter = new SQLiteBlobConverter();

    public BuildingDeviceDAO(Connection connection) {
        this.connection = connection;
    }

    public BuildingDevice findByPrimaryKey(int id) {
        String sql = "SELECT * FROM building_device WHERE id = ?";
        BuildingDevice buldingDevice = null;
        try (PreparedStatement pstmt = connection.prepareStatement(sql)) {
            pstmt.setInt(1, id);
            ResultSet rs = pstmt.executeQuery();
            if (rs.next()) {
                Building building = DBManager.getInstance().getBuildingDAO().findByPrimaryKey(rs.getInt("building_id"));
                if (building == null) {
                    return null;
                }
                buldingDevice = new BuildingDevice(rs.getInt("id"), rs.getString("name"),
                        rs.getInt("consumes_energy"), blobConverter.getBlob(rs, "energy_curve", EnergyCurve.class),
                        building, rs.getFloat("wind_sensitivity"), rs.getFloat("light_sensitivity"), rs.getFloat("temperature_sensitivity"), rs.getFloat("precipitation_sensitivity"));
            }
        } catch (SQLException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }
        return buldingDevice;
    }

    public List<BuildingDevice> findByBuilding(Building building) {
        String sql = "SELECT * FROM building_device WHERE building_id = ?";
        try (PreparedStatement pstmt = connection.prepareStatement(sql)) {
            pstmt.setInt(1, building.getId());
            ResultSet rs = pstmt.executeQuery();
            List<BuildingDevice> buldingDevices = new ArrayList<>();
            while (rs.next()) {
                buldingDevices.add(new BuildingDevice(rs.getInt("id"), rs.getString("name"), rs.getInt("consumes_energy"),
                                blobConverter.getBlob(rs, "energy_curve", EnergyCurve.class), building, rs.getFloat("wind_sensitivity"), rs.getFloat("light_sensitivity"), rs.getFloat("temperature_sensitivity"), rs.getFloat("precipitation_sensitivity")));
            }
            return buldingDevices;
        } catch (SQLException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }
        return null;
    }

    public boolean saveOrUpdate(BuildingDevice buldingDevice) {
        if (findByPrimaryKey(buldingDevice.getId()) == null) {
            String sql = "INSERT INTO building_device (name, consumes_energy, energy_curve, building_id, wind_sensitivity, light_sensitivity, temperature_sensitivity, precipitation_sensitivity) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
            try (PreparedStatement pstmt = connection.prepareStatement(sql)) {
                pstmt.setString(1, buldingDevice.getName());
                pstmt.setInt(2, buldingDevice.getConsumesEnergy());
                blobConverter.setBlob(pstmt, 3, buldingDevice.getEnergyCurve());
                pstmt.setInt(4, buldingDevice.getBuilding().getId());
                pstmt.setFloat(5, buldingDevice.getWindSensitivity());
                pstmt.setFloat(6, buldingDevice.getLightSensitivity());
                pstmt.setFloat(7, buldingDevice.getTemperatureSensitivity());
                pstmt.setFloat(8, buldingDevice.getPrecipitationSensitivity());
                pstmt.executeUpdate();
                ResultSet rs = pstmt.getGeneratedKeys();
                if (rs.next()) {
                    buldingDevice.setId(rs.getInt(1));
                }
            } catch (SQLException e) {
                e.printStackTrace();
                return false;
            } catch (JsonProcessingException e) {
                e.printStackTrace();
                return false;
            }
        } else {
            String sql = "UPDATE building_device SET building_id = ?, name = ?, consumes_energy = ?, energy_curve = ?,  wind_sensitivity = ?, light_sensitivity = ?, temperature_sensitivity = ?, precipitation_sensitivity = ? WHERE id = ?";
            try (PreparedStatement pstmt = connection.prepareStatement(sql)) {
                pstmt.setInt(1, buldingDevice.getBuilding().getId());
                pstmt.setString(2, buldingDevice.getName());
                pstmt.setInt(3, buldingDevice.getConsumesEnergy());
                blobConverter.setBlob(pstmt, 4, buldingDevice.getEnergyCurve());
                pstmt.setFloat(5, buldingDevice.getWindSensitivity());
                pstmt.setFloat(6, buldingDevice.getLightSensitivity());
                pstmt.setFloat(7, buldingDevice.getTemperatureSensitivity());
                pstmt.setFloat(8, buldingDevice.getPrecipitationSensitivity());
                pstmt.setInt(9, buldingDevice.getId());
                pstmt.executeUpdate();
            } catch (SQLException e) {
                e.printStackTrace();
                return false;
            } catch (JsonProcessingException e) {
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
                if (building == null) {
                    continue;
                }
                buldingDevices.add(new BuildingDevice(rs.getInt("id"), rs.getString("name"), rs.getInt("consumes_energy"),
                                blobConverter.getBlob(rs, "energy_curve", EnergyCurve.class), building, rs.getFloat("wind_sensitivity"), rs.getFloat("light_sensitivity"), rs.getFloat("temperature_sensitivity"), rs.getFloat("precipitation_sensitivity")));
            }
            return buldingDevices;
        } catch (SQLException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }
        return null;
    }

}
