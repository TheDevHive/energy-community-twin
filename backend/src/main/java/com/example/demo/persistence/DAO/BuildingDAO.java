package com.example.demo.persistence.DAO;

import com.example.demo.model.Building;
import com.example.demo.model.Community;
import com.example.demo.persistence.DBManager;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

public class BuildingDAO {
    Connection connection;

    public BuildingDAO(Connection connection) {
        this.connection = connection;
    }

    public boolean saveOrUpdate(Building building) {
        if(findByPrimaryKey(building.getId()) == null) {
            String sql = "INSERT INTO building (community_id, address, floors) VALUES (?, ?, ?)";
            try (PreparedStatement pstmt = connection.prepareStatement(sql)) {
                pstmt.setInt(1, building.getCommunity().getId());
                pstmt.setString(2, building.getAddress());
                pstmt.setInt(3, building.getFloors());
                pstmt.executeUpdate();
                ResultSet rs = pstmt.getGeneratedKeys();
                if (rs.next()) {
                    building.setId(rs.getInt(1));
                }
            } catch (SQLException e) {
                e.printStackTrace();
                return false;
            }
        } else {
            String sql = "UPDATE building SET community_id = ?, address = ?, floors = ? WHERE id = ?";
            try (PreparedStatement pstmt = connection.prepareStatement(sql)) {
                pstmt.setInt(1, building.getCommunity().getId());
                pstmt.setString(2, building.getAddress());
                pstmt.setInt(3, building.getFloors());
                pstmt.setInt(4, building.getId());
                pstmt.executeUpdate();
            } catch (SQLException e) {
                e.printStackTrace();
                return false;
            }
        }
        return true;
    }

    public Building findByPrimaryKey(int id) {
        String sql = "SELECT * FROM building WHERE id = ?";
        Building building = null;
        try (PreparedStatement pstmt = connection.prepareStatement(sql)) {
            pstmt.setInt(1, id);
            ResultSet rs = pstmt.executeQuery();
            if (rs.next()) {
                Community community = DBManager.getInstance().getCommunityDAO().findByPrimaryKey(rs.getInt("community_id"));
                if(community == null) {
                    return null;
                }
                building = new Building(rs.getInt("id"), community, rs.getString("address"), rs.getInt("floors"));
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return building;
    }

    public boolean delete(Building building) {
        String sql = "DELETE FROM building WHERE id = ?";
        try (PreparedStatement pstmt = connection.prepareStatement(sql)) {
            pstmt.setInt(1, building.getId());
            pstmt.executeUpdate();
            return true;
        } catch (SQLException e) {
            e.printStackTrace();
            return false;
        }
    }

    public List<Building> findAll() {
        String sql = "SELECT * FROM building";
        try (PreparedStatement pstmt = connection.prepareStatement(sql)) {
            ResultSet rs = pstmt.executeQuery();
            List<Building> buildings = new ArrayList<>();
            while (rs.next()) {
                Community community = DBManager.getInstance().getCommunityDAO().findByPrimaryKey(rs.getInt("community_id"));
                if(community == null) {
                    continue;
                }
                buildings.add(new Building(rs.getInt("id"), community, rs.getString("address"), rs.getInt("floors")));
            }
            return buildings;
        } catch (SQLException e) {
            e.printStackTrace();
            return null;
        }
    }

}
