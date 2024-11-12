package com.example.demo;

import com.example.demo.model.Apartment;
import com.example.demo.model.ApartmentDevice;
import com.example.demo.persistence.DAO.ApartmentDAO;
import com.example.demo.persistence.DAO.ApartmentDeviceDAO;
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
        apartmentDevice = new ApartmentDevice(1, "Device", 1, "A", mockApartment);
    }

    @Test
    public void testSaveOrUpdate_InsertNewApartment() throws SQLException {
        // Set up
        when(mockApartment.getId()).thenReturn(1);

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
        verify(mockPreparedStatement).setInt(2, apartmentDevice.getEnergy());
        verify(mockPreparedStatement).setString(3, apartmentDevice.getEnergyClass());
        verify(mockPreparedStatement).setInt(4, apartmentDevice.getApartment().getId());
        verify(mockPreparedStatement).executeUpdate();
        assertEquals(1, apartmentDevice.getId());
    }

    @Test
    public void testSaveOrUpdate_UpdateExistingApartment() throws SQLException {
        // Set up
        when(mockApartment.getId()).thenReturn(1);
        doReturn(apartmentDevice).when(spyApartmentDeviceDAO).findByPrimaryKey(apartmentDevice.getId());

        when(mockConnection.prepareStatement(anyString())).thenReturn(mockPreparedStatement);
        when(mockPreparedStatement.executeUpdate()).thenReturn(1);

        // Execute
        spyApartmentDeviceDAO.saveOrUpdate(apartmentDevice);

        // Verify
        verify(mockPreparedStatement).setInt(1, apartmentDevice.getApartment().getId());
        verify(mockPreparedStatement).setString(2, apartmentDevice.getName());
        verify(mockPreparedStatement).setInt(3, apartmentDevice.getEnergy());
        verify(mockPreparedStatement).setString(4, apartmentDevice.getEnergyClass());
        verify(mockPreparedStatement).setInt(5, apartmentDevice.getId());
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
        when(mockResultSet.getInt("apartment_id")).thenReturn(1);

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
            assertEquals(1, resultApartmentDevice.getEnergy());
            assertEquals("A", resultApartmentDevice.getEnergyClass());
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
        when(mockResultSet.getInt("energy")).thenReturn(1, 2);
        when(mockResultSet.getString("energy_class")).thenReturn("A", "B");
        when(mockResultSet.getInt("apartment_id")).thenReturn(1, 2);

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

