package com.example.demo;

import com.example.demo.persistence.DBManager;
import org.junit.jupiter.api.*;
import java.sql.Connection;
import java.sql.SQLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.sql.Statement;
import static org.junit.jupiter.api.Assertions.*;

public class DBManagerTest {
    private static DBManager dbManager;
    private static final String TEST_DB_PATH = "src/main/resources/";
    private static final String TEST_DB_NAME = "database.db";

    @BeforeAll
    static void setUp() {
        dbManager = DBManager.getInstance();
    }

    @Test
    void testGetInstance() {
        DBManager instance1 = DBManager.getInstance();
        DBManager instance2 = DBManager.getInstance();

        // Test singleton pattern
        assertNotNull(instance1);
        assertSame(instance1, instance2, "DBManager instances should be the same (singleton)");
    }

    @Test
    void testGetConnection() {
        Connection conn = null;
        try {
            conn = dbManager.getConnection();
            assertNotNull(conn, "Connection should not be null");
            assertFalse(conn.isClosed(), "Connection should be open");
        } catch (SQLException e) {
            fail("Should not throw SQLException: " + e.getMessage());
        } finally {
            if (conn != null) {
                try {
                    conn.close();
                } catch (SQLException e) {
                    e.printStackTrace();
                }
            }
        }
    }

    @Test
    void testCheckAndCreateDatabase() {
        boolean result = dbManager.checkAndCreateDatabase();
        assertTrue(Files.exists(Path.of(TEST_DB_PATH + TEST_DB_NAME)),
                "Database file should exist after creation");

        // Test if tables were created by trying to access them
        try (Connection conn = dbManager.getConnection();
             Statement stmt = conn.createStatement()) {

            // Test a few key tables
            stmt.executeQuery("SELECT * FROM credentials LIMIT 1");
            stmt.executeQuery("SELECT * FROM user LIMIT 1");
            stmt.executeQuery("SELECT * FROM community LIMIT 1");
            stmt.executeQuery("SELECT * FROM building LIMIT 1");
            stmt.executeQuery("SELECT * FROM apartment LIMIT 1");

            // If we get here, tables exist and are queryable
            assertTrue(true, "All tables should be created and queryable");
        } catch (SQLException e) {
            fail("Failed to query tables: " + e.getMessage());
        }
    }

    @Test
    void testGetDAOs() {
        // Test that all DAO getters return non-null objects
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
    void testMultipleConnections() {
        // Test that we can get multiple valid connections
        try (Connection conn1 = dbManager.getConnection();
             Connection conn2 = dbManager.getConnection()) {

            assertNotNull(conn1, "First connection should not be null");
            assertNotNull(conn2, "Second connection should not be null");
            assertNotSame(conn1, conn2, "Connections should be different instances");
            assertFalse(conn1.isClosed(), "First connection should be open");
            assertFalse(conn2.isClosed(), "Second connection should be open");
        } catch (SQLException e) {
            fail("Should not throw SQLException: " + e.getMessage());
        }
    }

    @Test
    void testDatabaseCreationIdempotency() {
        // Test that running creation multiple times doesn't cause errors
        boolean firstResult = dbManager.checkAndCreateDatabase();
        boolean secondResult = dbManager.checkAndCreateDatabase();

        // Second creation should return false as DB already exists
        assertFalse(secondResult, "Second database creation should return false");
    }
}