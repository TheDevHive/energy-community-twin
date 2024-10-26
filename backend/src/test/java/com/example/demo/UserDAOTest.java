package com.example.demo;

import com.example.demo.model.Credentials;
import com.example.demo.model.User;
import com.example.demo.persistence.DAO.CredentialsDAO;
import com.example.demo.persistence.DAO.UserDAO;
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
class UserDAOTest {

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

    private UserDAO userDAO;
    private Credentials testCredentials;
    private User testUser;

    @BeforeEach
    void setUp() throws SQLException {
        userDAO = new UserDAO(connection);
        testCredentials = new Credentials("test@email.com", "password");
        testUser = new User(1, "name","surname",  testCredentials, new Date(0), "phone");

        // Setup common mock behaviors
        when(connection.prepareStatement(anyString())).thenReturn(preparedStatement);
    }

    @Test
    void testFindByPrimaryKey() throws SQLException {
        // Setup
        when(resultSet.next()).thenReturn(true);
        when(resultSet.getString("name")).thenReturn("name");
        when(resultSet.getString("surname")).thenReturn("surname");
        when(resultSet.getString("email")).thenReturn("test@email.com");
        when(resultSet.getDate("birth_date")).thenReturn(new Date(0));
        when(resultSet.getString("phone")).thenReturn("phone");
        when(preparedStatement.executeQuery()).thenReturn(resultSet);

        try (MockedStatic<DBManager> mockedStatic = mockStatic(DBManager.class)) {
            mockedStatic.when(DBManager::getInstance).thenReturn(dbManager);
            when(dbManager.getCredentialsDAO()).thenReturn(credentialsDAO);
            when(credentialsDAO.findByPrimaryKey("test@email.com")).thenReturn(testCredentials);

            // Execute
            User result = userDAO.findByPrimaryKey(1);

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
        User result = userDAO.findByPrimaryKey(999);

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
        userDAO.saveOrUpdate(testUser);

        // Verify
        verify(preparedStatement).setString(1, testUser.getCredentials().getEmail());
        verify(preparedStatement).executeUpdate();
    }

    @Test
    void testUpdateExistingAdmin() throws SQLException {
        // Setup
        when(resultSet.next()).thenReturn(true);
        when(resultSet.getString("email")).thenReturn("test@email.com");
        when(resultSet.getString("name")).thenReturn("name");
        when(resultSet.getString("surname")).thenReturn("surname");
        when(resultSet.getDate("birth_date")).thenReturn(new Date(0));
        when(resultSet.getString("phone")).thenReturn("phone");
        when(preparedStatement.executeQuery()).thenReturn(resultSet);

        try (MockedStatic<DBManager> mockedStatic = mockStatic(DBManager.class)) {
            mockedStatic.when(DBManager::getInstance).thenReturn(dbManager);
            when(dbManager.getCredentialsDAO()).thenReturn(credentialsDAO);
            when(credentialsDAO.findByPrimaryKey("test@email.com")).thenReturn(testCredentials);

            // Execute
            userDAO.saveOrUpdate(testUser);

            // Verify
            verify(preparedStatement).setString(1, testUser.getName());
            verify(preparedStatement).setString(2, testUser.getSurname());
            verify(preparedStatement).setString(3, testUser.getCredentials().getEmail());
            verify(preparedStatement).setDate(4, testUser.getBirthDate());
            verify(preparedStatement).setString(5, testUser.getPhone());
            verify(preparedStatement).setInt(6, testUser.getId());
            verify(preparedStatement).executeUpdate();
        }
    }

    @Test
    void testVerifyUpdateChanges() throws SQLException {
        when(preparedStatement.executeQuery()).thenReturn(resultSet);
        // Setup initial state
        Credentials oldCredentials = new Credentials("old@email.com", "password");
        Credentials newCredentials = new Credentials("new@email.com", "password");
        User user = new User(1, "name","surname", oldCredentials, new Date(0), "phone");


        // Mock first query to find existing admin
        when(resultSet.next()).thenReturn(true);
        when(resultSet.getString("email")).thenReturn("old@email.com");
        when(resultSet.getString("name")).thenReturn("name");
        when(resultSet.getString("surname")).thenReturn("surname");
        when(resultSet.getDate("birth_date")).thenReturn(new Date(0));
        when(resultSet.getString("phone")).thenReturn("phone");

        try (MockedStatic<DBManager> mockedStatic = mockStatic(DBManager.class)) {
            mockedStatic.when(DBManager::getInstance).thenReturn(dbManager);
            when(dbManager.getCredentialsDAO()).thenReturn(credentialsDAO);
            when(credentialsDAO.findByPrimaryKey("old@email.com")).thenReturn(oldCredentials);

            // Verify initial state
            User initialUser = userDAO.findByPrimaryKey(1);
            assertEquals("old@email.com", initialUser.getCredentials().getEmail());

            // Perform update
            user.setCredentials(newCredentials);
            userDAO.saveOrUpdate(user);

            // Reset mocks for the second query after update
            when(resultSet.next()).thenReturn(true);
            when(resultSet.getString("email")).thenReturn("new@email.com");
            when(resultSet.getString("name")).thenReturn("name");
            when(resultSet.getString("surname")).thenReturn("surname");
            when(resultSet.getDate("birth_date")).thenReturn(new Date(0));
            when(resultSet.getString("phone")).thenReturn("phone");
            when(credentialsDAO.findByPrimaryKey("new@email.com")).thenReturn(newCredentials);

            // Verify the update
            User updatedUser = userDAO.findByPrimaryKey(1);
            assertNotNull(updatedUser);
            assertEquals("new@email.com", updatedUser.getCredentials().getEmail());

            // Verify that the update query was called with correct parameters
            verify(preparedStatement).setString(1, user.getName());
            verify(preparedStatement).setString(2, user.getSurname());
            verify(preparedStatement).setString(3, user.getCredentials().getEmail());
            verify(preparedStatement).setDate(4, user.getBirthDate());
            verify(preparedStatement).setString(5, user.getPhone());
            verify(preparedStatement).setInt(6, 1);
            verify(preparedStatement).executeUpdate();
        }
    }

    @Test
    void testDelete() throws SQLException {
        // Setup
        when(preparedStatement.executeUpdate()).thenReturn(1); // Assicurati che questo sia necessario

        // Execute
        boolean result = userDAO.delete(testUser);

        // Verify
        assertTrue(result);
        verify(preparedStatement).setInt(1, testUser.getId());
        verify(preparedStatement).executeUpdate();
    }

    @Test
    void testFindAll() throws SQLException {
        // Setup
        when(resultSet.next()).thenReturn(true, true, false);
        when(preparedStatement.executeQuery()).thenReturn(resultSet);
        when(resultSet.getInt("id")).thenReturn(1, 2);
        when(resultSet.getString("email")).thenReturn("test1@email.com", "test2@email.com");
        when(resultSet.getString("name")).thenReturn("name", "name");
        when(resultSet.getString("surname")).thenReturn("surname", "surname");
        when(resultSet.getDate("birth_date")).thenReturn(new Date(0), new Date(0));
        when(resultSet.getString("phone")).thenReturn("phone", "phone");

        try (MockedStatic<DBManager> mockedStatic = mockStatic(DBManager.class)) {
            mockedStatic.when(DBManager::getInstance).thenReturn(dbManager);
            when(dbManager.getCredentialsDAO()).thenReturn(credentialsDAO);
            when(credentialsDAO.findByPrimaryKey(anyString())).thenReturn(testCredentials);

            // Execute
            List<User> results = userDAO.findAll();

            // Verify
            assertNotNull(results);
            assertEquals(2, results.size());
            verify(preparedStatement).executeQuery();
            verify(credentialsDAO, times(2)).findByPrimaryKey(anyString());
        }
    }

}