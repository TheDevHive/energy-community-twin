package com.example.demo.persistence.DAO;

import com.example.demo.controller.Auth.AuthUtility;
import com.example.demo.model.Credentials;
import com.example.demo.persistence.DBManager;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

public class CredentialsDAO {
    Connection connection;

    public CredentialsDAO(Connection connection) {
        this.connection = connection;
    }

    public Credentials findByPrimaryKey(String email) {
        String sql = "SELECT password FROM credentials WHERE email = ?";
        Credentials credentials = null;

        try (PreparedStatement pstmt = connection.prepareStatement(sql)) {
            pstmt.setString(1, email);
            ResultSet rs = pstmt.executeQuery();
            if (rs.next()) {
                credentials = new Credentials(email, rs.getString("password"));
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }

        return credentials;
    }

    public boolean saveOrUpdate(Credentials credentials) {
        if (findByPrimaryKey(credentials.getEmail()) == null) {
            String sql = "INSERT INTO credentials (email, password) VALUES (?, ?)";
            try (PreparedStatement pstmt = connection.prepareStatement(sql)) {
                pstmt.setString(1, credentials.getEmail());
                pstmt.setString(2, credentials.getPassword());
                pstmt.executeUpdate();
            } catch (SQLException e) {
                e.printStackTrace();
                return false;
            }
        } else {
            String sql = "UPDATE credentials SET password = ? WHERE email = ?";
            try (PreparedStatement pstmt = connection.prepareStatement(sql)) {
                pstmt.setString(1, credentials.getPassword());
                pstmt.setString(2, credentials.getEmail());
                pstmt.executeUpdate();
            } catch (SQLException e) {
                e.printStackTrace();
                return false;
            }
        }
        return true;
    }

    public boolean delete(Credentials credential) {
        String sql = "DELETE FROM credentials WHERE email = ?";
        try (PreparedStatement pstmt = connection.prepareStatement(sql)) {
            pstmt.setString(1, credential.getEmail());
            pstmt.executeUpdate();
            return true;
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return false;
    }

    public List<Credentials> findAll() {
        String sql = "SELECT * FROM credentials";
        try (PreparedStatement pstmt = connection.prepareStatement(sql)) {
            ResultSet rs = pstmt.executeQuery();
            List<Credentials> credentials =new ArrayList<>();
            while (rs.next()) {
                Credentials credential = new Credentials(rs.getString("email"), rs.getString("password"));
                credentials.add(credential);
            }
            return credentials;
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return null;
    }

    public boolean isAdmin(Credentials creds) {
        String sql = "SELECT * FROM admin WHERE email = ?";
        try (PreparedStatement pstmt = connection.prepareStatement(sql)) {
            pstmt.setString(1, creds.getEmail());
            ResultSet rs = pstmt.executeQuery();
            return rs.next();
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return false;
    }

    public Credentials findByToken(String token) {
        String email = AuthUtility.getTokenEmail(token);
        String query = "SELECT * FROM credentials WHERE email = ?";
        try {
            PreparedStatement st = connection.prepareStatement(query);
            st.setString(1, email);
            ResultSet rs = st.executeQuery();
            if (rs.next()){
                Credentials creds;
                if(AuthUtility.isAdmin(token))
                    creds = DBManager.getInstance().getAdminDAO().findByEmail(email);
                else
                    creds = DBManager.getInstance().getUserDAO().findByEmail(email);
                return creds;
            }
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
        return null;
    }
}
