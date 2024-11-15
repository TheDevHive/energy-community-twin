package com.example.demo;

import com.example.demo.model.TS_Device;
import com.example.demo.persistence.DAO.TS_DeviceDAO;
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

public class TS_DeviceDAOTest {
    @Mock
    private Connection mockConnection;

    @Mock
    private PreparedStatement mockPreparedStatement;

    @Mock
    private ResultSet mockResultSet;

    private TS_Device device;

    @InjectMocks
    private TS_DeviceDAO deviceDAO;

    private TS_DeviceDAO spyDeviceDAO;

    @BeforeEach
    public void setUp() throws Exception {
        MockitoAnnotations.openMocks(this);
        deviceDAO = new TS_DeviceDAO(mockConnection);
        device = new TS_Device(1, "B12345");
        spyDeviceDAO = Mockito.spy(deviceDAO);
    }

    @Test
    public void testSaveOrUpdate_InsertNewDevice() throws SQLException {
        // Set up
        doReturn(null).when(spyDeviceDAO).findByPrimaryKey(device.getId());

        when(mockConnection.prepareStatement(anyString())).thenReturn(mockPreparedStatement);
        when(mockPreparedStatement.executeUpdate()).thenReturn(1);
        when(mockPreparedStatement.getGeneratedKeys()).thenReturn(mockResultSet);
        when(mockResultSet.next()).thenReturn(true);
        when(mockResultSet.getInt(1)).thenReturn(1);

        // Execute
        spyDeviceDAO.saveOrUpdate(device);

        // Assert
        verify(mockPreparedStatement).setString(1, device.getUuid());
        verify(mockPreparedStatement).executeUpdate();
    }

    @Test
    public void testSaveOrUpdate_UpdateExistingDevice() throws SQLException {
        // Set up
        doReturn(device).when(spyDeviceDAO).findByPrimaryKey(device.getId());

        when(mockConnection.prepareStatement(anyString())).thenReturn(mockPreparedStatement);
        when(mockPreparedStatement.executeUpdate()).thenReturn(1);

        // Execute
        spyDeviceDAO.saveOrUpdate(device);

        // Assert
        verify(mockPreparedStatement).setString(1, device.getUuid());
        verify(mockPreparedStatement).setInt(2, device.getId());
        verify(mockPreparedStatement).executeUpdate();
    }

    @Test
    public void testFindByPrimaryKey_Found() throws SQLException {
        // Set up
        when(mockConnection.prepareStatement(anyString())).thenReturn(mockPreparedStatement);
        when(mockPreparedStatement.executeQuery()).thenReturn(mockResultSet);
        when(mockResultSet.next()).thenReturn(true);
        when(mockResultSet.getInt("device_id")).thenReturn(1);
        when(mockResultSet.getString("device_uuid")).thenReturn("B12345");

        // Execute
        TS_Device result = deviceDAO.findByPrimaryKey(1);

        // Assert
        assertNotNull(result);
        assertEquals(1, result.getId());
        assertEquals("B12345", result.getUuid());
    }

    @Test
    public void testFindByPrimaryKey_NotFound() throws SQLException {
        // Set up
        when(mockConnection.prepareStatement(anyString())).thenReturn(mockPreparedStatement);
        when(mockPreparedStatement.executeQuery()).thenReturn(mockResultSet);
        when(mockResultSet.next()).thenReturn(false);

        // Execute
        TS_Device result = deviceDAO.findByPrimaryKey(1);

        // Assert
        assertNull(result);
    }

    @Test
    public void testFindByUuid_Found() throws SQLException {
        // Set up
        when(mockConnection.prepareStatement(anyString())).thenReturn(mockPreparedStatement);
        when(mockPreparedStatement.executeQuery()).thenReturn(mockResultSet);
        when(mockResultSet.next()).thenReturn(true);
        when(mockResultSet.getInt("device_id")).thenReturn(1);
        when(mockResultSet.getString("device_uuid")).thenReturn("B12345");

        // Execute
        TS_Device result = deviceDAO.findByUuid("B12345");

        // Assert
        assertNotNull(result);
        assertEquals(1, result.getId());
        assertEquals("B12345", result.getUuid());
    }

    @Test
    public void testDelete_Success() throws SQLException {
        // Set up
        when(mockConnection.prepareStatement(anyString())).thenReturn(mockPreparedStatement);
        when(mockPreparedStatement.executeUpdate()).thenReturn(1);

        // Execute
        boolean result = deviceDAO.delete(device);

        // Assert
        assertTrue(result);
        verify(mockPreparedStatement).setInt(1, device.getId());
        verify(mockPreparedStatement).executeUpdate();
    }

    @Test
    public void testFindAll() throws SQLException {
        // Set up
        when(mockConnection.prepareStatement(anyString())).thenReturn(mockPreparedStatement);
        when(mockPreparedStatement.executeQuery()).thenReturn(mockResultSet);
        when(mockResultSet.next()).thenReturn(true, true, false);
        when(mockResultSet.getInt("device_id")).thenReturn(1, 2);
        when(mockResultSet.getString("device_uuid")).thenReturn("B12345", "B67890");

        // Execute
        List<TS_Device> devices = deviceDAO.findAll();

        // Assert
        assertNotNull(devices);
        assertEquals(2, devices.size());
        assertEquals(1, devices.get(0).getId());
        assertEquals("B12345", devices.get(0).getUuid());
        assertEquals(2, devices.get(1).getId());
        assertEquals("B67890", devices.get(1).getUuid());
    }
}