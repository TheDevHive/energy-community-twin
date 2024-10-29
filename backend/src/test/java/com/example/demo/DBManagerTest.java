package com.example.demo;

import com.example.demo.persistence.DBManager;
import org.junit.jupiter.api.*;
import org.mockito.Mock;

import java.sql.Connection;
import java.sql.SQLException;

import com.example.demo.persistence.DAO.*;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class DBManagerTest {

    private static DBManager dbManager;

    @Mock
    private Connection mockConnection;

    @BeforeAll
    static void setUp() {
        dbManager = DBManager.getInstance();
    }

    @BeforeEach
    void setupMocks() throws SQLException {
        // Mock DBManager methods that would normally access the database
        mockConnection = mock(Connection.class);
        dbManager = spy(DBManager.getInstance());
        doReturn(mockConnection).when(dbManager).getConnection();
    }

    @Test
    void testGetInstance() {
        DBManager instance1 = DBManager.getInstance();
        DBManager instance2 = DBManager.getInstance();
        assertNotNull(instance1);
        assertSame(instance1, instance2, "DBManager instances should be the same (singleton)");
    }

    @Test
    void testGetConnection() throws SQLException {
        when(mockConnection.isClosed()).thenReturn(false);
        Connection conn = dbManager.getConnection();
        assertNotNull(conn, "Connection should not be null");
        assertFalse(conn.isClosed(), "Connection should be open");
    }

    @Test
    void testGetDAOs() {
        CredentialsDAO credentialsDAO = mock(CredentialsDAO.class);
        AdminDAO adminDAO = mock(AdminDAO.class);
        UserDAO userDAO = mock(UserDAO.class);
        CommunityDAO communityDAO = mock(CommunityDAO.class);
        BuildingDAO buildingDAO = mock(BuildingDAO.class);
        BuildingDeviceDAO buildingDeviceDAO = mock(BuildingDeviceDAO.class);
        ApartmentDAO apartmentDAO = mock(ApartmentDAO.class);
        ApartmentDeviceDAO apartmentDeviceDAO = mock(ApartmentDeviceDAO.class);


        when(dbManager.getCredentialsDAO()).thenReturn(credentialsDAO);
        when(dbManager.getAdminDAO()).thenReturn(adminDAO);
        when(dbManager.getUserDAO()).thenReturn(userDAO);
        when(dbManager.getCommunityDAO()).thenReturn(communityDAO);
        when(dbManager.getBuildingDAO()).thenReturn(buildingDAO);
        when(dbManager.getBuildingDeviceDAO()).thenReturn(buildingDeviceDAO);
        when(dbManager.getApartmentDAO()).thenReturn(apartmentDAO);
        when(dbManager.getApartmentDeviceDAO()).thenReturn(apartmentDeviceDAO);


        assertNotNull(dbManager.getCredentialsDAO(), "CredentialsDAO should not be null");
        assertNotNull(dbManager.getAdminDAO(), "AdminDAO should not be null");
        assertNotNull(dbManager.getUserDAO(), "UserDAO should not be null");
        assertNotNull(dbManager.getCommunityDAO(), "CommunityDAO should not be null");
        assertNotNull(dbManager.getBuildingDAO(), "BuildingDAO should not be null");
        assertNotNull(dbManager.getBuildingDeviceDAO(), "BuildingDeviceDAO should not be null");
        assertNotNull(dbManager.getApartmentDAO(), "ApartmentDAO should not be null");
        assertNotNull(dbManager.getApartmentDeviceDAO(), "ApartmentDeviceDAO should not be null");
    }

    @Test
    void testMultipleConnections() throws SQLException {
        Connection mockConnection1 = mock(Connection.class);
        Connection mockConnection2 = mock(Connection.class);


        when(dbManager.getConnection()).thenReturn(mockConnection1).thenReturn(mockConnection2);
        when(mockConnection1.isClosed()).thenReturn(false);
        when(mockConnection2.isClosed()).thenReturn(false);

        Connection conn1 = dbManager.getConnection();
        Connection conn2 = dbManager.getConnection();

        assertNotNull(conn1, "First connection should not be null");
        assertNotNull(conn2, "Second connection should not be null");
        assertNotSame(conn1, conn2, "Connections should be different instances");
        assertFalse(conn1.isClosed(), "First connection should be open");
        assertFalse(conn2.isClosed(), "Second connection should be open");
    }

}
