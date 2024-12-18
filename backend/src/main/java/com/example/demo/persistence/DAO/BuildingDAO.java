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
        if (findByPrimaryKey(building.getId()) == null) {
            String sql = "INSERT INTO building (community_id, address, floors, energy_cost) VALUES (?, ?, ?, ?)";
            try (PreparedStatement pstmt = connection.prepareStatement(sql)) {
                pstmt.setInt(1, building.getCommunity().getId());
                pstmt.setString(2, building.getAddress());
                pstmt.setInt(3, building.getFloors());
                pstmt.setDouble(4, building.getEnergyCost());
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
            String sql = "UPDATE building SET community_id = ?, address = ?, floors = ?, energy_cost = ? WHERE id = ?";
            try (PreparedStatement pstmt = connection.prepareStatement(sql)) {
                pstmt.setInt(1, building.getCommunity().getId());
                pstmt.setString(2, building.getAddress());
                pstmt.setInt(3, building.getFloors());
                pstmt.setDouble(4, building.getEnergyCost());
                pstmt.setInt(5, building.getId());
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
                Community community = DBManager.getInstance().getCommunityDAO()
                        .findByPrimaryKey(rs.getInt("community_id"));
                if (community == null) {
                    return null;
                }
                building = new Building(rs.getInt("id"), community, rs.getString("address"), rs.getInt("floors"),
                        rs.getDouble("energy_cost"));
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return building;
    }

    public List<Building> findByCommunity(Community community) {
        String sql = "SELECT * FROM building WHERE community_id = ?";
        try (PreparedStatement pstmt = connection.prepareStatement(sql)) {
            pstmt.setInt(1, community.getId());
            ResultSet rs = pstmt.executeQuery();
            List<Building> buildings = new ArrayList<>();
            while (rs.next()) {
                buildings.add(new Building(rs.getInt("id"), community, rs.getString("address"), rs.getInt("floors"),
                        rs.getDouble("energy_cost")));
            }
            return buildings;
        } catch (SQLException e) {
            e.printStackTrace();
            return null;
        }
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
                Community community = DBManager.getInstance().getCommunityDAO()
                        .findByPrimaryKey(rs.getInt("community_id"));
                if (community == null) {
                    continue;
                }
                buildings.add(new Building(rs.getInt("id"), community, rs.getString("address"), rs.getInt("floors"),
                        rs.getDouble("energy_cost")));
            }
            return buildings;
        } catch (SQLException e) {
            e.printStackTrace();
            return null;
        }
    }

}
