package com.example.demo;

import com.example.demo.model.*;
import com.example.demo.persistence.DAO.*;
import com.example.demo.persistence.DBManager;
import com.example.demo.utility.SQLiteBlobConverter;
import com.fasterxml.jackson.core.JsonProcessingException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Arrays;
import java.util.List;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.anyString;
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
        buildingDevice = new BuildingDevice(1, "Device", 0, new EnergyCurve(Arrays.asList(1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24)), mockBuilding, 1.0f,1.0f, 1.0f, 1.0f);
    }

    @Test
    public void testSaveOrUpdate_InsertNewBuildingDevice() throws SQLException, JsonProcessingException {
        // Set up
        when(mockBuilding.getId()).thenReturn(1);
        SQLiteBlobConverter spyBlobConverter = Mockito.spy(new SQLiteBlobConverter());
        BuildingDeviceDAO spyBuildingDeviceDAO = Mockito.spy(new BuildingDeviceDAO(mockConnection));
        spyBuildingDeviceDAO.blobConverter = spyBlobConverter;


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
        verify(mockPreparedStatement).setInt(2, buildingDevice.getConsumesEnergy());
        verify(spyBlobConverter).setBlob(mockPreparedStatement, 3, buildingDevice.getEnergyCurve());
        verify(mockPreparedStatement).setInt(4, buildingDevice.getBuilding().getId());
        verify(mockPreparedStatement).setFloat(5, buildingDevice.getWindSensitivity());
        verify(mockPreparedStatement).setFloat(6, buildingDevice.getLightSensitivity());
        verify(mockPreparedStatement).setFloat(7, buildingDevice.getTemperatureSensitivity());
        verify(mockPreparedStatement).setFloat(8, buildingDevice.getPrecipitationSensitivity());
        verify(mockPreparedStatement).executeUpdate();
        assertEquals(1, buildingDevice.getId());
    }

    @Test
    public void testSaveOrUpdate_UpdateExistingBuildingDevice() throws SQLException, JsonProcessingException {
        // Set up
        BuildingDevice mockBuildingDevice= Mockito.mock(BuildingDevice.class);
        Building mockBuilding = Mockito.mock(Building.class);
        SQLiteBlobConverter spyBlobConverter = Mockito.spy(new SQLiteBlobConverter());
        BuildingDeviceDAO spyBuildingDeviceDAO = Mockito.spy(new BuildingDeviceDAO(mockConnection));
        spyBuildingDeviceDAO.blobConverter = spyBlobConverter;

        Mockito.doReturn(mockBuildingDevice).when(spyBuildingDeviceDAO).findByPrimaryKey(1);
        Mockito.when(mockBuildingDevice.getId()).thenReturn(1);
        Mockito.when(mockBuildingDevice.getName()).thenReturn("Test Device");
        Mockito.when(mockBuildingDevice.getConsumesEnergy()).thenReturn(0);
        Mockito.when(mockBuildingDevice.getBuilding()).thenReturn(mockBuilding);
        Mockito.when(mockBuildingDevice.getId()).thenReturn(1);
        Mockito.when(mockBuildingDevice.getWindSensitivity()).thenReturn(1.0f);
        Mockito.when(mockBuildingDevice.getLightSensitivity()).thenReturn(1.0f);
        Mockito.when(mockBuildingDevice.getTemperatureSensitivity()).thenReturn(1.0f);
        Mockito.when(mockBuildingDevice.getPrecipitationSensitivity()).thenReturn(1.0f);

        EnergyCurve mockEnergyCurve = new EnergyCurve();
        Mockito.when(mockBuildingDevice.getEnergyCurve()).thenReturn(mockEnergyCurve);

        Mockito.when(mockConnection.prepareStatement(Mockito.anyString())).thenReturn(mockPreparedStatement);
        Mockito.when(mockPreparedStatement.executeUpdate()).thenReturn(1);

        // Execute
        boolean result=spyBuildingDeviceDAO.saveOrUpdate(mockBuildingDevice);

        // Assert
        assertTrue(result);
        Mockito.verify(mockPreparedStatement).setInt(1, 0);
        Mockito.verify(mockPreparedStatement).setString(2, "Test Device");
        Mockito.verify(mockPreparedStatement).setInt(3, 0);
        Mockito.verify(spyBlobConverter).setBlob(mockPreparedStatement, 4, mockEnergyCurve);
        Mockito.verify(mockPreparedStatement).setFloat(5, 1.0f);
        Mockito.verify(mockPreparedStatement).setFloat(6, 1.0f);
        Mockito.verify(mockPreparedStatement).setFloat(7, 1.0f);
        Mockito.verify(mockPreparedStatement).setFloat(8, 1.0f);
        Mockito.verify(mockPreparedStatement).setInt(9, 1);
        Mockito.verify(mockPreparedStatement).executeUpdate();
    }

    @Test
    public void testFindByPrimaryKey_Found() throws SQLException {
        when(mockConnection.prepareStatement(anyString())).thenReturn(mockPreparedStatement);
        when(mockPreparedStatement.executeQuery()).thenReturn(mockResultSet);

        when(mockResultSet.next()).thenReturn(true);
        when(mockResultSet.getInt("id")).thenReturn(1);
        when(mockResultSet.getString("name")).thenReturn("Device");
        when(mockResultSet.getInt("consumes_energy")).thenReturn(0);
        when(mockResultSet.getObject("energy_curve")).thenReturn(new EnergyCurve(Arrays.asList(1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24)));
        when(mockResultSet.getInt("building_id")).thenReturn(1);
        when(mockResultSet.getFloat("wind_sensitivity")).thenReturn(1.0f);
        when(mockResultSet.getFloat("light_sensitivity")).thenReturn(1.0f);
        when(mockResultSet.getFloat("temperature_sensitivity")).thenReturn(1.0f);
        when(mockResultSet.getFloat("precipitation_sensitivity")).thenReturn(1.0f);

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
            assertEquals(0, resultBuildingDevice.getConsumesEnergy());
            assertEquals(1.0f, resultBuildingDevice.getWindSensitivity());
            assertEquals(1.0f, resultBuildingDevice.getLightSensitivity());
            assertEquals(1.0f, resultBuildingDevice.getTemperatureSensitivity());
            assertEquals(1.0f, resultBuildingDevice.getPrecipitationSensitivity());
            // assertEquals(Arrays.asList(1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24), resultBuildingDevice.getEnergyCurve()); // TODO: vedi sopra
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
        when(mockResultSet.getInt("consumes_energy")).thenReturn(0, 1);
        when(mockResultSet.getObject("energy_curve")).thenReturn(new EnergyCurve(Arrays.asList(1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24)), new EnergyCurve(Arrays.asList(1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,25)));
        when(mockResultSet.getInt("building_id")).thenReturn(1, 2);
        when(mockResultSet.getFloat("wind_sensitivity")).thenReturn(1.0f, 2.0f);
        when(mockResultSet.getFloat("light_sensitivity")).thenReturn(1.0f, 2.0f);
        when(mockResultSet.getFloat("temperature_sensitivity")).thenReturn(1.0f, 2.0f);
        when(mockResultSet.getFloat("precipitation_sensitivity")).thenReturn(1.0f, 2.0f);

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

