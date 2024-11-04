package com.example.demo.persistence.DAO;

import com.example.demo.model.Admin;
import com.example.demo.model.Credentials;
import com.example.demo.persistence.DBManager;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

public class AdminDAO {
    Connection connection;

    public AdminDAO(Connection connection) {
        this.connection = connection;
    }

    public Admin findByPrimaryKey(int id) {
        String sql = "SELECT * FROM admin WHERE id = ?";
        Admin admin = null;

        try (PreparedStatement pstmt = connection.prepareStatement(sql)) {
            pstmt.setInt(1, id);
            ResultSet rs = pstmt.executeQuery();
            if (rs.next()) {
                Credentials credentials = DBManager.getInstance().getCredentialsDAO().findByPrimaryKey(rs.getString("email"));
                if(credentials == null) {
                    return null;
                }
                admin = new Admin(rs.getInt("id"), credentials);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return admin;
    }

    public boolean saveOrUpdate(Admin admin) {
        if(findByPrimaryKey(admin.getId()) == null) {
            String sql = "INSERT INTO admin (email) VALUES (?)";
            try (PreparedStatement pstmt = connection.prepareStatement(sql)) {
                pstmt.setString(1, admin.getCredentials().getEmail());
                pstmt.executeUpdate();
                ResultSet rs = pstmt.getGeneratedKeys();
                if (rs.next()) {
                    admin.setId(rs.getInt(1));
                    return true;
                }
            } catch (SQLException e) {
                e.printStackTrace();
                return false;
            }
        } else {
            String sql = "UPDATE admin SET email = ? WHERE id = ?";
            try (PreparedStatement pstmt = connection.prepareStatement(sql)) {
                pstmt.setString(1, admin.getCredentials().getEmail());
                pstmt.setInt(2, admin.getId());
                pstmt.executeUpdate();
                return true;
            } catch (SQLException e) {
                e.printStackTrace();
                return false;
            }
        }
        return true;
    }

    public boolean delete(Admin admin) {
        String sql = "DELETE FROM admin WHERE id = ?";
        try (PreparedStatement pstmt = connection.prepareStatement(sql)) {
            pstmt.setInt(1, admin.getId());
            pstmt.executeUpdate();
            return true;
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return false;
    }

    public List<Admin> findAll() {
        String sql = "SELECT * FROM admin";
        try (PreparedStatement pstmt = connection.prepareStatement(sql)) {
            ResultSet rs = pstmt.executeQuery();
            List<Admin> admins =new ArrayList<>();
            while (rs.next()) {
                Credentials credentials = DBManager.getInstance().getCredentialsDAO().findByPrimaryKey(rs.getString("email"));
                if(credentials == null) {
                    return null;
                }
                Admin admin = new Admin(rs.getInt("id"), credentials);
                admins.add(admin);
            }
            return admins;
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return null;
    }

    public boolean registerAdmin(Admin admin) {
        String sql = "INSERT INTO credentials (email, password) VALUES (?, ?)";
        try (PreparedStatement pstmt = connection.prepareStatement(sql)) {
            pstmt.setString(1, admin.getCredentials().getEmail());
            pstmt.setString(2, admin.getCredentials().getPassword());
            // if the credentials are not already in the database, insert them in credential
            // then insert a new admin with the same email in the admin table
            if(pstmt.executeUpdate() == 1) {
                return saveOrUpdate(admin);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return false;
    }

    public Admin findByEmail(String email) {
        String sql = "SELECT * FROM admin WHERE email = ?";
        Admin admin = null;

        try (PreparedStatement pstmt = connection.prepareStatement(sql)) {
            pstmt.setString(1, email);
            ResultSet rs = pstmt.executeQuery();
            if (rs.next()) {
                Credentials credentials = DBManager.getInstance().getCredentialsDAO().findByPrimaryKey(rs.getString("email"));
                if (credentials == null) {
                    return null;
                }
                admin = new Admin(rs.getInt("id"), credentials);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return admin;
    }
}
