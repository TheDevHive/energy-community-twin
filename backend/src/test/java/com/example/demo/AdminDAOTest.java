package com.example.demo;

import com.example.demo.model.Admin;
import com.example.demo.model.Credentials;
import com.example.demo.persistence.DAO.AdminDAO;
import com.example.demo.persistence.DAO.CredentialsDAO;
import com.example.demo.persistence.DBManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.MockedStatic;
import org.mockito.junit.jupiter.MockitoExtension;

import java.sql.*;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AdminDAOTest {

    @Mock
    private Connection connection;

    @Mock
    private PreparedStatement preparedStatement;

    @Mock
    private ResultSet resultSet;

    @Mock
    private DBManager dbManager;

    @Mock
    private CredentialsDAO credentialsDAO;

    private AdminDAO adminDAO;
    private Credentials testCredentials;
    private Admin testAdmin;

    @BeforeEach
    void setUp() throws SQLException {
        adminDAO = new AdminDAO(connection);
        testCredentials = new Credentials("test@email.com", "password");
        testAdmin = new Admin(1, testCredentials);

        // Setup common mock behaviors
        when(connection.prepareStatement(anyString())).thenReturn(preparedStatement);
    }

    @Test
    void testFindByPrimaryKey() throws SQLException {
        // Setup
        when(resultSet.next()).thenReturn(true);
        when(resultSet.getInt("id")).thenReturn(1);
        when(resultSet.getString("email")).thenReturn("test@email.com");
        when(preparedStatement.executeQuery()).thenReturn(resultSet);

        try (MockedStatic<DBManager> mockedStatic = mockStatic(DBManager.class)) {
            mockedStatic.when(DBManager::getInstance).thenReturn(dbManager);
            when(dbManager.getCredentialsDAO()).thenReturn(credentialsDAO);
            when(credentialsDAO.findByPrimaryKey("test@email.com")).thenReturn(testCredentials);

            // Execute
            Admin result = adminDAO.findByPrimaryKey(1);

            // Verify
            assertNotNull(result);
            assertEquals(1, result.getId());
            assertEquals("test@email.com", result.getCredentials().getEmail());
            verify(preparedStatement).setInt(1, 1);
        }
    }

    @Test
    void testFindByPrimaryKeyNotFound() throws SQLException {
        // Setup
        when(resultSet.next()).thenReturn(false);
        when(preparedStatement.executeQuery()).thenReturn(resultSet);

        // Execute
        Admin result = adminDAO.findByPrimaryKey(999);

        // Verify
        assertNull(result);
        verify(preparedStatement).setInt(1, 999);
    }

    @Test
    void testSaveNewAdmin() throws SQLException {
        // Setup
        when(resultSet.next()).thenReturn(false).thenReturn(true);
        when(resultSet.getInt(1)).thenReturn(1);
        when(preparedStatement.getGeneratedKeys()).thenReturn(resultSet);
        when(preparedStatement.executeQuery()).thenReturn(resultSet);

        // Execute
        adminDAO.saveOrUpdate(testAdmin);

        // Verify
        verify(preparedStatement).setString(1, testAdmin.getCredentials().getEmail());
        verify(preparedStatement).executeUpdate();
    }

    @Test
    void testUpdateExistingAdmin() throws SQLException {
        // Setup
        when(resultSet.next()).thenReturn(true);
        when(resultSet.getInt("id")).thenReturn(1);
        when(resultSet.getString("email")).thenReturn("test@email.com");
        when(preparedStatement.executeQuery()).thenReturn(resultSet);

        try (MockedStatic<DBManager> mockedStatic = mockStatic(DBManager.class)) {
            mockedStatic.when(DBManager::getInstance).thenReturn(dbManager);
            when(dbManager.getCredentialsDAO()).thenReturn(credentialsDAO);
            when(credentialsDAO.findByPrimaryKey("test@email.com")).thenReturn(testCredentials);

            // Execute
            adminDAO.saveOrUpdate(testAdmin);

            // Verify
            verify(preparedStatement).setString(1, testAdmin.getCredentials().getEmail());
            verify(preparedStatement).setInt(2, testAdmin.getId());
            verify(preparedStatement).executeUpdate();
        }
    }

    @Test
    void testVerifyUpdateChanges() throws SQLException {
        when(preparedStatement.executeQuery()).thenReturn(resultSet);
        // Setup initial state
        Credentials oldCredentials = new Credentials("old@email.com", "password");
        Credentials newCredentials = new Credentials("new@email.com", "password");
        Admin admin = new Admin(1, oldCredentials);

        // Mock first query to find existing admin
        when(resultSet.next()).thenReturn(true);
        when(resultSet.getInt("id")).thenReturn(1);
        when(resultSet.getString("email")).thenReturn("old@email.com");

        try (MockedStatic<DBManager> mockedStatic = mockStatic(DBManager.class)) {
            mockedStatic.when(DBManager::getInstance).thenReturn(dbManager);
            when(dbManager.getCredentialsDAO()).thenReturn(credentialsDAO);
            when(credentialsDAO.findByPrimaryKey("old@email.com")).thenReturn(oldCredentials);

            // Verify initial state
            Admin initialAdmin = adminDAO.findByPrimaryKey(1);
            assertEquals("old@email.com", initialAdmin.getCredentials().getEmail());

            // Perform update
            admin.setCredentials(newCredentials);
            adminDAO.saveOrUpdate(admin);

            // Reset mocks for the second query after update
            when(resultSet.getString("email")).thenReturn("new@email.com");
            when(credentialsDAO.findByPrimaryKey("new@email.com")).thenReturn(newCredentials);

            // Verify the update
            Admin updatedAdmin = adminDAO.findByPrimaryKey(1);
            assertNotNull(updatedAdmin);
            assertEquals("new@email.com", updatedAdmin.getCredentials().getEmail());

            // Verify that the update query was called with correct parameters
            verify(preparedStatement, times(1)).setString(1, "new@email.com");
            verify(preparedStatement, times(1)).setInt(2, 1);
        }
    }

    @Test
    void testDelete() throws SQLException {
        // Setup
        when(preparedStatement.executeUpdate()).thenReturn(1); // Assicurati che questo sia necessario

        // Execute
        boolean result = adminDAO.delete(testAdmin);

        // Verify
        assertTrue(result);
        verify(preparedStatement).setInt(1, testAdmin.getId());
        verify(preparedStatement).executeUpdate();
    }

    @Test
    void testFindAll() throws SQLException {
        // Setup
        when(resultSet.next()).thenReturn(true, true, false);
        when(preparedStatement.executeQuery()).thenReturn(resultSet);
        when(resultSet.getInt("id")).thenReturn(1, 2);
        when(resultSet.getString("email")).thenReturn("test1@email.com", "test2@email.com");

        try (MockedStatic<DBManager> mockedStatic = mockStatic(DBManager.class)) {
            mockedStatic.when(DBManager::getInstance).thenReturn(dbManager);
            when(dbManager.getCredentialsDAO()).thenReturn(credentialsDAO);
            when(credentialsDAO.findByPrimaryKey(anyString())).thenReturn(testCredentials);

            // Execute
            List<Admin> results = adminDAO.findAll();

            // Verify
            assertNotNull(results);
            assertEquals(2, results.size());
            verify(preparedStatement).executeQuery();
            verify(credentialsDAO, times(2)).findByPrimaryKey(anyString());
        }
    }

    @Test
    void testFindAllWithNullCredentials() throws SQLException {
        // Setup
        when(resultSet.next()).thenReturn(true);
        when(resultSet.getString("email")).thenReturn("test@email.com");

        try (MockedStatic<DBManager> mockedStatic = mockStatic(DBManager.class)) {
            mockedStatic.when(DBManager::getInstance).thenReturn(dbManager);
            when(dbManager.getCredentialsDAO()).thenReturn(credentialsDAO);
            when(credentialsDAO.findByPrimaryKey(anyString())).thenReturn(null);
            when(preparedStatement.executeQuery()).thenReturn(resultSet);

            // Execute
            List<Admin> results = adminDAO.findAll();

            // Verify
            assertNull(results);
        }
    }

}