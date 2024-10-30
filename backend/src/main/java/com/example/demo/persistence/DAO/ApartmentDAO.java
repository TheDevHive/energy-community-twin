package com.example.demo.persistence.DAO;

import com.example.demo.model.Apartment;
import com.example.demo.model.Building;
import com.example.demo.model.User;
import com.example.demo.persistence.DBManager;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

public class ApartmentDAO {
    Connection connection;

    public ApartmentDAO(Connection connection) {
        this.connection = connection;
    }

    public boolean saveOrUpdate(Apartment apartment) {
        if(findByPrimaryKey(apartment.getId()) == null) {
            String sql = "INSERT INTO apartment (residents, square_footage, energy_class, building_id, user_id) VALUES (?, ?, ?, ?, ?)";
            try (PreparedStatement pstmt = connection.prepareStatement(sql)) {
                pstmt.setInt(1, apartment.getResidents());
                pstmt.setInt(2, apartment.getSquareFootage());
                pstmt.setString(3, apartment.getEnergyClass());
                pstmt.setInt(4, apartment.getBuilding().getId());
                pstmt.setInt(5, apartment.getUser().getId());
                pstmt.executeUpdate();
                ResultSet rs = pstmt.getGeneratedKeys();
                if (rs.next()) {
                    apartment.setId(rs.getInt(1));
                }
            } catch (SQLException e) {
                e.printStackTrace();
                return false;
            }
        } else {
            String sql = "UPDATE apartment SET residents = ?, square_footage = ?, energy_class = ?, building_id = ?, user_id = ? WHERE id = ?";
            try (PreparedStatement pstmt = connection.prepareStatement(sql)) {
                pstmt.setInt(1, apartment.getResidents());
                pstmt.setInt(2, apartment.getSquareFootage());
                pstmt.setString(3, apartment.getEnergyClass());
                pstmt.setInt(4, apartment.getBuilding().getId());
                pstmt.setInt(5, apartment.getUser().getId());
                pstmt.setInt(6, apartment.getId());
                pstmt.executeUpdate();
            } catch (SQLException e) {
                e.printStackTrace();
                return false;
            }
        }
        return true;
    }

    public Apartment findByPrimaryKey(int id) {
        String sql = "SELECT * FROM apartment WHERE id = ?";
        Apartment apartment = null;
        try (PreparedStatement pstmt = connection.prepareStatement(sql)) {
            pstmt.setInt(1, id);
            ResultSet rs = pstmt.executeQuery();
            if (rs.next()) {
                Building building = DBManager.getInstance().getBuildingDAO().findByPrimaryKey(rs.getInt("building_id"));
                User user = DBManager.getInstance().getUserDAO().findByPrimaryKey(rs.getInt("user_id"));
                if(building == null || user == null) {
                    return null;
                }
                apartment = new Apartment(rs.getInt("id"), building, rs.getInt("residents"), rs.getInt("square_footage"), rs.getString("energy_class"), user);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return apartment;
    }

    public List<Apartment> findAll() {
        String sql = "SELECT * FROM apartment";
        List<Apartment> apartments = new ArrayList<>();
        try (PreparedStatement pstmt = connection.prepareStatement(sql)) {
            ResultSet rs = pstmt.executeQuery();
            while (rs.next()) {
                Building building = DBManager.getInstance().getBuildingDAO().findByPrimaryKey(rs.getInt("building_id"));
                User user = DBManager.getInstance().getUserDAO().findByPrimaryKey(rs.getInt("user_id"));
                if(building == null || user == null) {
                    return null;
                }
                apartments.add(new Apartment(rs.getInt("id"), building, rs.getInt("residents"), rs.getInt("square_footage"), rs.getString("energy_class"), user));
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return apartments;
    }

    public boolean delete(Apartment apartment) {
        String sql = "DELETE FROM apartment WHERE id = ?";
        try (PreparedStatement pstmt = connection.prepareStatement(sql)) {
            pstmt.setInt(1, apartment.getId());
            pstmt.executeUpdate();
            return true;
        } catch (SQLException e) {
            e.printStackTrace();
            return false;
        }
    }
}

