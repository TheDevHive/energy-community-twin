package com.example.demo.persistence.DAO;

import com.example.demo.model.Apartment;
import com.example.demo.model.ApartmentDevice;
import com.example.demo.persistence.DBManager;

import java.io.IOException;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import com.example.demo.utility.SQLiteBlobConverter;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.example.demo.model.EnergyCurve;

public class ApartmentDeviceDAO {
    Connection connection;
    public SQLiteBlobConverter blobConverter = new SQLiteBlobConverter();

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
                apartmentDevice = new ApartmentDevice(rs.getInt("id"), rs.getString("name"), rs.getBoolean("consumes_energy"), blobConverter.getBlob(rs, "energy_curve", EnergyCurve.class), apartment);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }
        return apartmentDevice;
    }

    public boolean saveOrUpdate(ApartmentDevice apartmentDevice) {
        if(findByPrimaryKey(apartmentDevice.getId()) == null) {
            String sql = "INSERT INTO apartment_device (name, consumes_energy, energy_curve, apartment_id) VALUES (?, ?, ?, ?)";
            try(PreparedStatement pstmt = connection.prepareStatement(sql)) {
                pstmt.setString(1, apartmentDevice.getName());
                pstmt.setBoolean(2, apartmentDevice.getConsumesEnergy());
                blobConverter.setBlob(pstmt, 3, apartmentDevice.getEnergyCurve());
                pstmt.setInt(4, apartmentDevice.getApartment().getId());
                pstmt.executeUpdate();
                ResultSet rs = pstmt.getGeneratedKeys();
                if(rs.next()) {
                    apartmentDevice.setId(rs.getInt(1));
                }
            } catch (SQLException e) {
                e.printStackTrace();
                return false;
            } catch (JsonProcessingException e){
                e.printStackTrace();
                return false;
            }
        } else {
            String sql = "UPDATE apartment_device SET apartment_id = ?, name = ?, consumes_energy = ?, energy_curve = ?  WHERE id = ?";
            try(PreparedStatement pstmt = connection.prepareStatement(sql)) {
                pstmt.setInt(1, apartmentDevice.getApartment().getId());
                pstmt.setString(2, apartmentDevice.getName());
                pstmt.setBoolean(3, apartmentDevice.getConsumesEnergy());
                blobConverter.setBlob(pstmt, 4, apartmentDevice.getEnergyCurve());
                pstmt.setInt(5, apartmentDevice.getId());
                pstmt.executeUpdate();
            } catch (SQLException e) {
                e.printStackTrace();
                return false;
            } catch (JsonProcessingException e){
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
                    continue;
                }
                apartmentDevices.add(new ApartmentDevice(rs.getInt("id"), rs.getString("name"), rs.getBoolean("consumes_energy"), blobConverter.getBlob(rs, "energy_curve", EnergyCurve.class), apartment));
                
            }
            return apartmentDevices;
        } catch (SQLException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }
        return null;
    }

}
