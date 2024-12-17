package com.example.demo;

import com.example.demo.model.Apartment;
import com.example.demo.model.ApartmentDevice;
import com.example.demo.model.EnergyCurve;
import com.example.demo.persistence.DAO.ApartmentDAO;
import com.example.demo.persistence.DAO.ApartmentDeviceDAO;
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

public class ApartmentDeviceDAOTest {

    @Mock
    private Connection mockConnection;

    @Mock
    private PreparedStatement mockPreparedStatement;

    @Mock
    private ResultSet mockResultSet;

    @Mock
    private Apartment mockApartment;

    @InjectMocks
    private ApartmentDeviceDAO apartmentDeviceDAO;

    private ApartmentDevice apartmentDevice;

    private ApartmentDeviceDAO spyApartmentDeviceDAO;

    @BeforeEach
    public void setUp() throws Exception {
        MockitoAnnotations.openMocks(this);
        apartmentDeviceDAO = new ApartmentDeviceDAO(mockConnection);
        spyApartmentDeviceDAO = Mockito.spy(apartmentDeviceDAO);
        apartmentDevice = new ApartmentDevice(1, "Device", 0, new EnergyCurve(Arrays.asList(1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24)), mockApartment, 1.0f,1.0f, 1.0f, 1.0f);
    }

    @Test
    public void testSaveOrUpdate_InsertNewApartmentDevice() throws SQLException, JsonProcessingException {
        // Set up
        when(mockApartment.getId()).thenReturn(1);
        SQLiteBlobConverter spyBlobConverter = Mockito.spy(new SQLiteBlobConverter());
        ApartmentDeviceDAO spyApartmentDeviceDAO = Mockito.spy(new ApartmentDeviceDAO(mockConnection));
        spyApartmentDeviceDAO.blobConverter = spyBlobConverter;

        doReturn(null).when(spyApartmentDeviceDAO).findByPrimaryKey(apartmentDevice.getId());

        when(mockConnection.prepareStatement(anyString())).thenReturn(mockPreparedStatement);
        when(mockPreparedStatement.executeUpdate()).thenReturn(1);
        when(mockPreparedStatement.getGeneratedKeys()).thenReturn(mockResultSet);
        when(mockResultSet.next()).thenReturn(true);
        when(mockResultSet.getInt(1)).thenReturn(1);


        // Execute
        spyApartmentDeviceDAO.saveOrUpdate(apartmentDevice);

        // Verify
        verify(mockPreparedStatement).setString(1, apartmentDevice.getName());
        verify(mockPreparedStatement).setInt(2, apartmentDevice.getConsumesEnergy());
        verify(spyBlobConverter).setBlob(mockPreparedStatement, 3, apartmentDevice.getEnergyCurve());
        verify(mockPreparedStatement).setInt(4, apartmentDevice.getApartment().getId());
        verify(mockPreparedStatement).setFloat(5, apartmentDevice.getWindSensitivity());
        verify(mockPreparedStatement).setFloat(6, apartmentDevice.getLightSensitivity());
        verify(mockPreparedStatement).setFloat(7, apartmentDevice.getTemperatureSensitivity());
        verify(mockPreparedStatement).setFloat(8, apartmentDevice.getPrecipitationSensitivity());
        verify(mockPreparedStatement).executeUpdate();
        assertEquals(1, apartmentDevice.getId());
    }

    @Test
    public void testSaveOrUpdate_UpdateExistingApartmentDevice() throws SQLException, JsonProcessingException {
        ApartmentDevice mockApartmentDevice = Mockito.mock(ApartmentDevice.class);
        Apartment mockApartment = Mockito.mock(Apartment.class);
        SQLiteBlobConverter spyBlobConverter = Mockito.spy(new SQLiteBlobConverter());
        ApartmentDeviceDAO spyApartmentDeviceDAO = Mockito.spy(new ApartmentDeviceDAO(mockConnection));
        spyApartmentDeviceDAO.blobConverter = spyBlobConverter;

        Mockito.doReturn(mockApartmentDevice).when(spyApartmentDeviceDAO).findByPrimaryKey(1);
        Mockito.when(mockApartmentDevice.getId()).thenReturn(1);
        Mockito.when(mockApartmentDevice.getName()).thenReturn("Test Device");
        Mockito.when(mockApartmentDevice.getConsumesEnergy()).thenReturn(0);
        Mockito.when(mockApartmentDevice.getApartment()).thenReturn(mockApartment);
        Mockito.when(mockApartment.getId()).thenReturn(1);
        Mockito.when(mockApartmentDevice.getWindSensitivity()).thenReturn(1.0f);
        Mockito.when(mockApartmentDevice.getLightSensitivity()).thenReturn(1.0f);
        Mockito.when(mockApartmentDevice.getTemperatureSensitivity()).thenReturn(1.0f);
        Mockito.when(mockApartmentDevice.getPrecipitationSensitivity()).thenReturn(1.0f);

        EnergyCurve mockEnergyCurve = new EnergyCurve();
        Mockito.when(mockApartmentDevice.getEnergyCurve()).thenReturn(mockEnergyCurve);

        Mockito.when(mockConnection.prepareStatement(Mockito.anyString())).thenReturn(mockPreparedStatement);
        Mockito.when(mockPreparedStatement.executeUpdate()).thenReturn(1);

        boolean result = spyApartmentDeviceDAO.saveOrUpdate(mockApartmentDevice);

        assertTrue(result);
        Mockito.verify(mockPreparedStatement).setString(1, "Test Device");
        Mockito.verify(mockPreparedStatement).setInt(2, 0);
        Mockito.verify(spyBlobConverter).setBlob(mockPreparedStatement, 3, mockEnergyCurve);
        Mockito.verify(mockPreparedStatement).setInt(4, 1);
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
        when(mockResultSet.getObject("energy_curve")).thenReturn(Arrays.asList(1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24));
        when(mockResultSet.getInt("apartment_id")).thenReturn(1);
        when(mockResultSet.getFloat("wind_sensitivity")).thenReturn(1.0f);
        when(mockResultSet.getFloat("light_sensitivity")).thenReturn(1.0f);
        when(mockResultSet.getFloat("temperature_sensitivity")).thenReturn(1.0f);
        when(mockResultSet.getFloat("precipitation_sensitivity")).thenReturn(1.0f);

        ApartmentDAO mockApartmentDAO = mock(ApartmentDAO.class);
        Apartment mockApartment = mock(Apartment.class);
        when(mockApartmentDAO.findByPrimaryKey(1)).thenReturn(mockApartment);

        DBManager mockDBManager = mock(DBManager.class);
        try (MockedStatic<DBManager> mockedDBManager = Mockito.mockStatic(DBManager.class)) {
            mockedDBManager.when(DBManager::getInstance).thenReturn(mockDBManager);
            when(mockDBManager.getApartmentDAO()).thenReturn(mockApartmentDAO);

            // Execute
            ApartmentDevice resultApartmentDevice = apartmentDeviceDAO.findByPrimaryKey(1);

            // Assert
            assertNotNull(resultApartmentDevice);
            assertEquals(1, resultApartmentDevice.getId());
            assertEquals("Device", resultApartmentDevice.getName());
            assertEquals(0, resultApartmentDevice.getConsumesEnergy());
            assertEquals(1.0f, resultApartmentDevice.getWindSensitivity());
            assertEquals(1.0f, resultApartmentDevice.getLightSensitivity());
            assertEquals(1.0f, resultApartmentDevice.getTemperatureSensitivity());
            assertEquals(1.0f, resultApartmentDevice.getPrecipitationSensitivity());
            assertEquals(mockApartment, resultApartmentDevice.getApartment());
        }
    }

    @Test
    public void testFindByPrimaryKey_NotFound() throws SQLException {
        when(mockConnection.prepareStatement(anyString())).thenReturn(mockPreparedStatement);
        when(mockPreparedStatement.executeQuery()).thenReturn(mockResultSet);
        when(mockResultSet.next()).thenReturn(false);

        // Execute
        ApartmentDevice resultApartmentDevice = apartmentDeviceDAO.findByPrimaryKey(1);

        // Assert
        assertNull(resultApartmentDevice);
    }

    @Test
    public void testFindAll() throws SQLException {
        // Set up
        when(mockConnection.prepareStatement(anyString())).thenReturn(mockPreparedStatement);
        when(mockPreparedStatement.executeQuery()).thenReturn(mockResultSet);

        when(mockResultSet.next()).thenReturn(true, true, false);
        when(mockResultSet.getInt("id")).thenReturn(1, 2);
        when(mockResultSet.getString("name")).thenReturn("Device1", "Device2");
        when(mockResultSet.getInt("consumes_energy")).thenReturn(0,1);
        when(mockResultSet.getObject("energy_class")).thenReturn(Arrays.asList(1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24), Arrays.asList(1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,25));
        when(mockResultSet.getInt("apartment_id")).thenReturn(1, 2);
        when(mockResultSet.getFloat("wind_sensitivity")).thenReturn(1.0f, 2.0f);
        when(mockResultSet.getFloat("light_sensitivity")).thenReturn(1.0f, 2.0f);
        when(mockResultSet.getFloat("temperature_sensitivity")).thenReturn(1.0f, 2.0f);
        when(mockResultSet.getFloat("precipitation_sensitivity")).thenReturn(1.0f, 2.0f);

        ApartmentDAO mockApartmentDAO = mock(ApartmentDAO.class);

        Apartment mockApartment1 = mock(Apartment.class);
        Apartment mockApartment2 = mock(Apartment.class);
        when(mockApartmentDAO.findByPrimaryKey(1)).thenReturn(mockApartment1);
        when(mockApartmentDAO.findByPrimaryKey(2)).thenReturn(mockApartment2);

        DBManager mockDBManager = mock(DBManager.class);
        try (MockedStatic<DBManager> mockedDBManager = Mockito.mockStatic(DBManager.class)) {
            mockedDBManager.when(DBManager::getInstance).thenReturn(mockDBManager);
            when(mockDBManager.getApartmentDAO()).thenReturn(mockApartmentDAO);

            // Execute
            List<ApartmentDevice> apartmentDevices = apartmentDeviceDAO.findAll();

            // Assert
            assertNotNull(apartmentDevices);
            assertEquals(2, apartmentDevices.size());
        }
    }

    @Test
    public void testDelete_Success() throws SQLException {
        // Set up
        when(mockConnection.prepareStatement(anyString())).thenReturn(mockPreparedStatement);
        when(mockPreparedStatement.executeUpdate()).thenReturn(1);

        // Execute
        boolean result = apartmentDeviceDAO.delete(apartmentDevice);

        // Assert
        assertTrue(result);
        verify(mockPreparedStatement).setInt(1, apartmentDevice.getId());
        verify(mockPreparedStatement).executeUpdate();
    }
}

