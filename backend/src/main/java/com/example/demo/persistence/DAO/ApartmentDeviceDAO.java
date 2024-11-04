package com.example.demo.persistence.DAO;

import com.example.demo.model.Apartment;
import com.example.demo.model.ApartmentDevice;
import com.example.demo.persistence.DBManager;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

public class ApartmentDeviceDAO {
    Connection connection;

    public ApartmentDeviceDAO(Connection connection) {
        this.connection = connection;
    }

    public ApartmentDevice findByPrimaryKey(int id) {
        String sql = "SELECT * FROM apartment_device WHERE id = ?";
        ApartmentDevice apartmentDevice = null;
        try(PreparedStatement pstmt = connection.prepareStatement(sql)) {
            pstmt.setInt(1, id);
            ResultSet rs = pstmt.executeQuery();
            if(rs.next()) {
                Apartment apartment = DBManager.getInstance().getApartmentDAO().findByPrimaryKey(rs.getInt("apartment_id"));
                if(apartment == null) {
                    return null;
                }
                apartmentDevice = new ApartmentDevice(rs.getInt("id"), rs.getString("name"), rs.getString("log_path"), rs.getBoolean("consumes_energy"), rs.getString("energy_class"),apartment);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return apartmentDevice;
    }

    public boolean saveOrUpdate(ApartmentDevice apartmentDevice) {
        if(findByPrimaryKey(apartmentDevice.getId()) == null) {
            String sql = "INSERT INTO apartment_device (name, log_path, consumes_energy, energy_class, apartment_id) VALUES (?, ?, ?, ?, ?)";
            try(PreparedStatement pstmt = connection.prepareStatement(sql)) {
                pstmt.setString(1, apartmentDevice.getName());
                pstmt.setString(2, apartmentDevice.getLogPath());
                pstmt.setBoolean(3, apartmentDevice.consumesEnergy());
                pstmt.setString(4, apartmentDevice.getEnergyClass());
                pstmt.setInt(5, apartmentDevice.getApartment().getId());
                pstmt.executeUpdate();
                ResultSet rs = pstmt.getGeneratedKeys();
                if(rs.next()) {
                    apartmentDevice.setId(rs.getInt(1));
                }
            } catch (SQLException e) {
                e.printStackTrace();
                return false;
            }
        } else {
            String sql = "UPDATE apartment_device SET apartment_id = ?, name = ?, log_path = ?, consumes_energy = ?, energy_class = ? WHERE id = ?";
            try(PreparedStatement pstmt = connection.prepareStatement(sql)) {
                pstmt.setInt(1, apartmentDevice.getApartment().getId());
                pstmt.setString(2, apartmentDevice.getName());
                pstmt.setString(3, apartmentDevice.getLogPath());
                pstmt.setBoolean(4, apartmentDevice.consumesEnergy());
                pstmt.setString(5, apartmentDevice.getEnergyClass());
                pstmt.setInt(6, apartmentDevice.getId());
                pstmt.executeUpdate();
            } catch (SQLException e) {
                e.printStackTrace();
                return false;
            }
        }
        return true;
    }

    public boolean delete(ApartmentDevice apartmentDevice) {
        String sql = "DELETE FROM apartment_device WHERE id = ?";
        try (PreparedStatement pstmt = connection.prepareStatement(sql)) {
            pstmt.setInt(1, apartmentDevice.getId());
            pstmt.executeUpdate();
            return true;
        } catch (SQLException e) {
            e.printStackTrace();
            return false;
        }
    }

    public List<ApartmentDevice> findAll() {
        String sql = "SELECT * FROM apartment_device";
        try (PreparedStatement pstmt = connection.prepareStatement(sql)) {
            ResultSet rs = pstmt.executeQuery();
            List<ApartmentDevice> apartmentDevices = new ArrayList<>();
            while (rs.next()) {
                Apartment apartment = DBManager.getInstance().getApartmentDAO().findByPrimaryKey(rs.getInt("apartment_id"));
                if(apartment == null) {
                    return null;
                }
                apartmentDevices.add(new ApartmentDevice(rs.getInt("id"), rs.getString("name"), rs.getString("log_path"), rs.getBoolean("consumes_energy"), rs.getString("energy_class"), apartment));
            }
            return apartmentDevices;
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return null;
    }

}
