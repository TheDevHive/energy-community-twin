package com.example.demo;

import com.example.demo.model.Credentials;
import com.example.demo.persistence.DAO.CredentialsDAO;
import com.example.demo.persistence.DBManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;
import static org.mockito.Mockito.verify;

public class CredentialsDAOTest {
    @Mock
    private Connection mockConnection;

    @Mock
    private PreparedStatement mockPreparedStatement;

    @Mock
    private ResultSet mockResultSet;

    private Credentials credentials;

    @InjectMocks
    private CredentialsDAO credentialsDAO;

    private CredentialsDAO spyCredentialsDAO;

    @BeforeEach
    public void setUp() throws Exception {
        MockitoAnnotations.openMocks(this);
        credentialsDAO= new CredentialsDAO(mockConnection);
        credentials= new Credentials("username@email.com", "password");
        spyCredentialsDAO= Mockito.spy(credentialsDAO);
    }

    @Test
    public void testSaveOrUpdate_InsertNewBuilding() throws SQLException {
        // Set Up
        doReturn(null).when(spyCredentialsDAO).findByPrimaryKey(credentials.getEmail());

        when(mockConnection.prepareStatement(anyString())).thenReturn(mockPreparedStatement);
        when(mockPreparedStatement.executeUpdate()).thenReturn(1);
        when(mockPreparedStatement.getGeneratedKeys()).thenReturn(mockResultSet);
        when(mockResultSet.next()).thenReturn(true);
        when(mockResultSet.getInt(1)).thenReturn(1);
        // Execute
        spyCredentialsDAO.saveOrUpdate(credentials);

        // Assert
        verify(mockPreparedStatement).setString(1, credentials.getEmail());
        verify(mockPreparedStatement).setString(2, credentials.getPassword());
        verify(mockPreparedStatement).executeUpdate();
        assertEquals("username@email.com", credentials.getEmail());
    }


    @Test
    public void testSaveOrUpdate_UpdateExistingApartment() throws SQLException {
        // Set Up
        doReturn(credentials).when(spyCredentialsDAO).findByPrimaryKey(credentials.getEmail());

        when(mockConnection.prepareStatement(anyString())).thenReturn(mockPreparedStatement);
        when(mockPreparedStatement.executeUpdate()).thenReturn(1);

        // Execute
        spyCredentialsDAO.saveOrUpdate(credentials);

        // Assert
        verify(mockPreparedStatement).setString(2, credentials.getEmail());
        verify(mockPreparedStatement).setString(1, credentials.getPassword());
        verify(mockPreparedStatement).executeUpdate();
    }

    @Test
    public void testFindAll() throws SQLException {
        // Set Up
        when(mockConnection.prepareStatement(anyString())).thenReturn(mockPreparedStatement);
        when(mockPreparedStatement.executeQuery()).thenReturn(mockResultSet);

        when(mockResultSet.next()).thenReturn(true, true, false);
        when(mockResultSet.getString("email")).thenReturn("Test Community 1", "Test Community 2");
        when(mockResultSet.getString("password")).thenReturn("password1", "password2");

        DBManager mockDBManager = mock(DBManager.class);
        try (MockedStatic<DBManager> mockedDBManager = Mockito.mockStatic(DBManager.class)) {
            mockedDBManager.when(DBManager::getInstance).thenReturn(mockDBManager);
            when(mockDBManager.getCredentialsDAO()).thenReturn(credentialsDAO);

            // Execute
            List<Credentials> credentials = credentialsDAO.findAll();

            // Assert
            assertNotNull(credentials);
            assertEquals(2, credentials.size());
        }
    }

    @Test
    public void testFindByPrimaryKey_Found() throws SQLException {
        // Set Up
        when(mockConnection.prepareStatement(anyString())).thenReturn(mockPreparedStatement);
        when(mockPreparedStatement.executeQuery()).thenReturn(mockResultSet);

        when(mockResultSet.next()).thenReturn(true);
        when(mockResultSet.getString("email")).thenReturn("Test Community 1");
        when(mockResultSet.getString("password")).thenReturn("password1");

        DBManager mockDBManager = mock(DBManager.class);
        try (MockedStatic<DBManager> mockedDBManager = Mockito.mockStatic(DBManager.class)) {
            mockedDBManager.when(DBManager::getInstance).thenReturn(mockDBManager);
            when(mockDBManager.getCredentialsDAO()).thenReturn(credentialsDAO);

            // Execute
            Credentials result = credentialsDAO.findByPrimaryKey("Test Community 1");

            // Assert
            assertNotNull(result);
            assertEquals("Test Community 1", result.getEmail());
            assertEquals("password1", result.getPassword());
        }
    }

    @Test
    public void testFindByPrimaryKey_NotFound() throws SQLException {

        when(mockConnection.prepareStatement(anyString())).thenReturn(mockPreparedStatement);
        when(mockPreparedStatement.executeQuery()).thenReturn(mockResultSet);
        when(mockResultSet.next()).thenReturn(false);

        // Execute
        Credentials result = credentialsDAO.findByPrimaryKey("Test Community 1");

        // Assert
        assertNull(result);
    }

    @Test
    public void testDelete_Success() throws SQLException {
        // Set Up
        Credentials cred = new Credentials();
        cred.setEmail("Test Community 1");

        when(mockConnection.prepareStatement(anyString())).thenReturn(mockPreparedStatement);
        when(mockPreparedStatement.executeUpdate()).thenReturn(1);

        // Execute
        boolean result = credentialsDAO.delete(cred);

        // Assert
        assertTrue(result);
    }
}
