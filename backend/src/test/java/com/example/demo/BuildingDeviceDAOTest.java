package com.example.demo;

import com.example.demo.model.*;
import com.example.demo.persistence.DAO.*;
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
import static org.mockito.Mockito.*;

public class BuildingDeviceDAOTest{

    @Mock
    private Connection mockConnection;

    @Mock
    private PreparedStatement mockPreparedStatement;

    @Mock
    private ResultSet mockResultSet;

    @Mock
    private Building mockBuilding;

    @InjectMocks
    private BuildingDeviceDAO buildingDeviceDAO;

    private BuildingDevice buildingDevice;

    private BuildingDeviceDAO spyBuildingDeviceDAO;

    @BeforeEach
    public void setUp() throws Exception {
        MockitoAnnotations.openMocks(this);
        buildingDeviceDAO = new BuildingDeviceDAO(mockConnection);
        spyBuildingDeviceDAO = Mockito.spy(buildingDeviceDAO);
        buildingDevice = new BuildingDevice(1, "Device", 1, "A", mockBuilding);
    }

    @Test
    public void testSaveOrUpdate_InsertNewApartment() throws SQLException {
        // Set up
        when(mockBuilding.getId()).thenReturn(1);

        doReturn(null).when(spyBuildingDeviceDAO).findByPrimaryKey(buildingDevice.getId());

        when(mockConnection.prepareStatement(anyString())).thenReturn(mockPreparedStatement);
        when(mockPreparedStatement.executeUpdate()).thenReturn(1);
        when(mockPreparedStatement.getGeneratedKeys()).thenReturn(mockResultSet);
        when(mockResultSet.next()).thenReturn(true);
        when(mockResultSet.getInt(1)).thenReturn(1);

        // Execute
        spyBuildingDeviceDAO.saveOrUpdate(buildingDevice);

        // Assert
        verify(mockPreparedStatement).setString(1, buildingDevice.getName());
        verify(mockPreparedStatement).setInt(2, buildingDevice.getEnergy());
        verify(mockPreparedStatement).setString(3, buildingDevice.getEnergyClass());
        verify(mockPreparedStatement).executeUpdate();
        assertEquals(1, buildingDevice.getId());
    }

    @Test
    public void testSaveOrUpdate_UpdateExistingApartment() throws SQLException {
        // Set up
        when(mockBuilding.getId()).thenReturn(1);

        doReturn(buildingDevice).when(spyBuildingDeviceDAO).findByPrimaryKey(buildingDevice.getId());

        when(mockConnection.prepareStatement(anyString())).thenReturn(mockPreparedStatement);
        when(mockPreparedStatement.executeUpdate()).thenReturn(1);

        // Execute
        spyBuildingDeviceDAO.saveOrUpdate(buildingDevice);

        // Assert
        verify(mockPreparedStatement).setInt(1, buildingDevice.getBuilding().getId());
        verify(mockPreparedStatement).setString(2, buildingDevice.getName());
        verify(mockPreparedStatement).setInt(3, buildingDevice.getEnergy());
        verify(mockPreparedStatement).setString(4, buildingDevice.getEnergyClass());
        verify(mockPreparedStatement).executeUpdate();
    }

    @Test
    public void testFindByPrimaryKey_Found() throws SQLException {
        when(mockConnection.prepareStatement(anyString())).thenReturn(mockPreparedStatement);
        when(mockPreparedStatement.executeQuery()).thenReturn(mockResultSet);

        when(mockResultSet.next()).thenReturn(true);
        when(mockResultSet.getInt("id")).thenReturn(1);
        when(mockResultSet.getString("name")).thenReturn("Device");
        when(mockResultSet.getInt("energy")).thenReturn(1);
        when(mockResultSet.getString("energy_class")).thenReturn("A");
        when(mockResultSet.getInt("building_id")).thenReturn(1);

        BuildingDAO mockBuildingDAO = mock(BuildingDAO.class);
        Building mockBuilding = mock(Building.class);
        when(mockBuildingDAO.findByPrimaryKey(1)).thenReturn(mockBuilding);

        DBManager mockDBManager = mock(DBManager.class);
        try (MockedStatic<DBManager> mockedDBManager = Mockito.mockStatic(DBManager.class)) {
            mockedDBManager.when(DBManager::getInstance).thenReturn(mockDBManager);
            when(mockDBManager.getBuildingDAO()).thenReturn(mockBuildingDAO);

            // Execute
            BuildingDevice resultBuildingDevice = buildingDeviceDAO.findByPrimaryKey(1);

            // Assert
            assertNotNull(resultBuildingDevice);
            assertEquals(1, resultBuildingDevice.getId());
            assertEquals("Device", resultBuildingDevice.getName());
            assertEquals(1, resultBuildingDevice.getEnergy());
            assertEquals("A", resultBuildingDevice.getEnergyClass());
            assertEquals(mockBuilding, resultBuildingDevice.getBuilding());
        }
    }

    @Test
    public void testFindByPrimaryKey_NotFound() throws SQLException {
        when(mockConnection.prepareStatement(anyString())).thenReturn(mockPreparedStatement);
        when(mockPreparedStatement.executeQuery()).thenReturn(mockResultSet);
        when(mockResultSet.next()).thenReturn(false);

        // Execute
        BuildingDevice resultBuildingDevice = buildingDeviceDAO.findByPrimaryKey(1);

        // Assert
        assertNull(resultBuildingDevice);
    }

    @Test
    public void testFindAll() throws SQLException {
        // Set up
        when(mockConnection.prepareStatement(anyString())).thenReturn(mockPreparedStatement);
        when(mockPreparedStatement.executeQuery()).thenReturn(mockResultSet);

        when(mockResultSet.next()).thenReturn(true, true, false);
        when(mockResultSet.getInt("id")).thenReturn(1, 2);
        when(mockResultSet.getString("name")).thenReturn("Device1", "Device2");
        when(mockResultSet.getInt("energy")).thenReturn(1, 2);
        when(mockResultSet.getString("energy_class")).thenReturn("A", "B");
        when(mockResultSet.getInt("building_id")).thenReturn(1, 2);

        BuildingDAO mockBuildingDAO = mock(BuildingDAO.class);
        Building mockBuilding1 = mock(Building.class);
        Building mockBuilding2 = mock(Building.class);
        when(mockBuildingDAO.findByPrimaryKey(1)).thenReturn(mockBuilding1);
        when(mockBuildingDAO.findByPrimaryKey(2)).thenReturn(mockBuilding2);

        DBManager mockDBManager = mock(DBManager.class);
        try (MockedStatic<DBManager> mockedDBManager = Mockito.mockStatic(DBManager.class)) {
            mockedDBManager.when(DBManager::getInstance).thenReturn(mockDBManager);
            when(mockDBManager.getBuildingDAO()).thenReturn(mockBuildingDAO);

            // Execute
            List<BuildingDevice> buildingDevices = buildingDeviceDAO.findAll();

            // Assert
            assertNotNull(buildingDevices);
            assertEquals(2, buildingDevices.size());
        }
    }

    @Test
    public void testDelete_Success() throws SQLException {
        // Set up
        when(mockConnection.prepareStatement(anyString())).thenReturn(mockPreparedStatement);
        when(mockPreparedStatement.executeUpdate()).thenReturn(1);

        // Execute
        boolean result = buildingDeviceDAO.delete(buildingDevice);

        // Assert
        assertTrue(result);
        verify(mockPreparedStatement).setInt(1, buildingDevice.getId());
        verify(mockPreparedStatement).executeUpdate();
    }
}

