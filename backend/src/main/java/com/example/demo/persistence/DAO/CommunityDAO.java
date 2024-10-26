package com.example.demo.persistence.DAO;

import com.example.demo.model.Admin;
import com.example.demo.model.Community;
import com.example.demo.persistence.DBManager;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

public class CommunityDAO {
    Connection connection;

    public CommunityDAO(Connection connection) {
        this.connection = connection;
    }

    public Community findByPrimaryKey(int id) {
        String sql = "SELECT * FROM community WHERE id = ?";
        Community community = null;
        try (PreparedStatement pstmt = connection.prepareStatement(sql)) {
            pstmt.setInt(1, id);
            ResultSet rs = pstmt.executeQuery();
            if (rs.next()) {
                Admin admin = DBManager.getInstance().getAdminDAO().findByPrimaryKey(rs.getInt("admin_id"));
                if(admin == null) {
                    return null;
                }
                community = new Community(rs.getInt("id"), rs.getString("name"), admin);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return community;
    }

    public void saveOrUpdate(Community community) {
        if(findByPrimaryKey(community.getId()) == null) {
            String sql = "INSERT INTO community (name, admin_id) VALUES (?, ?)";
            try (PreparedStatement pstmt = connection.prepareStatement(sql)) {
                pstmt.setString(1, community.getName());
                pstmt.setInt(2, community.getAdmin().getId());
                pstmt.executeUpdate();
                ResultSet rs = pstmt.getGeneratedKeys();
                if (rs.next()) {
                    community.setId(rs.getInt(1));
                }
            } catch (SQLException e) {
                e.printStackTrace();
            }
        } else {
            String sql = "UPDATE community SET name = ?, admin_id = ? WHERE id = ?";
            try (PreparedStatement pstmt = connection.prepareStatement(sql)) {
                pstmt.setString(1, community.getName());
                pstmt.setInt(2, community.getAdmin().getId());
                pstmt.setInt(3, community.getId());
                pstmt.executeUpdate();
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }
    }

    public boolean delete(Community community) {
        String sql = "DELETE FROM community WHERE id = ?";
        try (PreparedStatement pstmt = connection.prepareStatement(sql)) {
            pstmt.setInt(1, community.getId());
            pstmt.executeUpdate();
            return true;
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return false;
    }

    public List<Community> findAll() {
        String sql = "SELECT * FROM community";
        List<Community> communities = new ArrayList<>();
        try (PreparedStatement pstmt = connection.prepareStatement(sql)) {
            ResultSet rs = pstmt.executeQuery();
            while (rs.next()) {
                Admin admin = DBManager.getInstance().getAdminDAO().findByPrimaryKey(rs.getInt("admin_id"));
                if (admin == null) {
                    return null;
                }
                communities.add(new Community(rs.getInt("id"), rs.getString("name"), admin));
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return communities;
    }
}
