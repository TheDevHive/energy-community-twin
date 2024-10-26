package com.example.demo.persistence.DAO;

import com.example.demo.model.Credentials;
import com.example.demo.model.User;
import com.example.demo.persistence.DBManager;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

public class UserDAO {
    Connection connection;

    public UserDAO(Connection connection) {
        this.connection = connection;
    }

    public User findByPrimaryKey(int id) {
        String sql = "SELECT * FROM user WHERE id = ?";
        User user = null;
        try (PreparedStatement pstmt = connection.prepareStatement(sql)) {
            pstmt.setInt(1, id);
            ResultSet rs = pstmt.executeQuery();
            if (rs.next()) {
                Credentials credentials = DBManager.getInstance().getCredentialsDAO().findByPrimaryKey(rs.getString("email"));
                if(credentials == null) {
                    return null;
                }
                user = new User(id, rs.getString("name"), rs.getString("surname"), credentials, rs.getDate("birth_date"), rs.getString("phone"));
                return user;
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return user;
    }

    public void saveOrUpdate(User user) {
        if (findByPrimaryKey(user.getId()) == null) {
            String sql = "INSERT INTO user (email, name, surname, birth_date, phone) VALUES (?, ?, ?, ?, ?)";
            try (PreparedStatement pstmt = connection.prepareStatement(sql)) {
                pstmt.setString(1, user.getCredentials().getEmail());
                pstmt.setString(2, user.getName());
                pstmt.setString(3, user.getSurname());
                pstmt.setDate(4, user.getBirthDate());
                pstmt.setString(5, user.getPhone());
                pstmt.executeUpdate();
                ResultSet rs = pstmt.getGeneratedKeys();
                if (rs.next()) {
                    user.setId(rs.getInt(1));
                }
            } catch (SQLException e) {
                e.printStackTrace();
            }
        } else {
            String sql = "UPDATE user SET name = ?, surname = ?, email = ?, birth_date = ?, phone = ? WHERE id = ?";
            try (PreparedStatement pstmt = connection.prepareStatement(sql)) {
                pstmt.setString(1, user.getName());
                pstmt.setString(2, user.getSurname());
                pstmt.setString(3, user.getCredentials().getEmail());
                pstmt.setDate(4, user.getBirthDate());
                pstmt.setString(5, user.getPhone());
                pstmt.executeUpdate();
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }
    }

    public boolean delete(User user){
        String sql = "DELETE FROM user WHERE id = ?";
        try (PreparedStatement pstmt = connection.prepareStatement(sql)) {
            pstmt.setInt(1, user.getId());
            pstmt.executeUpdate();
            return true;
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return false;
    }

    public List<User> findAll(){
        String sql = "SELECT * FROM user";
        try (PreparedStatement pstmt = connection.prepareStatement(sql)) {
            ResultSet rs = pstmt.executeQuery();
            List<User> users = new ArrayList<>();
            while (rs.next()) {
                Credentials credentials = DBManager.getInstance().getCredentialsDAO().findByPrimaryKey(rs.getString("email"));
                if(credentials == null) {
                    return null;
                }
                users.add(new User(rs.getInt("id"), rs.getString("name"), rs.getString("surname"), credentials, rs.getDate("birth_date"), rs.getString("phone")));
            }
            return users;
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return null;
    }
}
