package com.example.demo;

import com.example.demo.model.Apartment;
import com.example.demo.model.ApartmentDevice;
import com.example.demo.model.Building;
import com.example.demo.model.Credentials;
import com.example.demo.model.EnergyCurve;
import com.example.demo.model.User;
import com.example.demo.persistence.DAO.ApartmentDeviceDAO;
import com.example.demo.persistence.DBManager;
import com.example.demo.utility.SQLiteBlobConverter;
import com.fasterxml.jackson.core.JsonProcessingException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import java.io.IOException;
import java.sql.Connection;
import java.sql.Date;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.Mockito.*;

public class ApartmentDeviceDAOTest {

    private Connection connection;
    private ApartmentDeviceDAO apartmentDeviceDAO;
    private SQLiteBlobConverter blobConverter;

    @BeforeEach
    public void setUp() {
        connection = mock(Connection.class);
        blobConverter = mock(SQLiteBlobConverter.class);
        apartmentDeviceDAO = new ApartmentDeviceDAO(connection);
        apartmentDeviceDAO.blobConverter = blobConverter;
    }

    @Test
    public void testFindByPrimaryKey() throws SQLException, IOException {
        PreparedStatement pstmt = mock(PreparedStatement.class);
        ResultSet rs = mock(ResultSet.class);
        when(connection.prepareStatement(any(String.class))).thenReturn(pstmt);
        when(pstmt.executeQuery()).thenReturn(rs);
        when(rs.next()).thenReturn(true);
        when(rs.getInt("id")).thenReturn(1);
        when(rs.getString("name")).thenReturn("Device1");
        when(rs.getBoolean("consumes_energy")).thenReturn(true);
        when(rs.getInt("apartment_id")).thenReturn(1);

        Apartment apartment = mock(Apartment.class);
        when(DBManager.getInstance().getApartmentDAO().findByPrimaryKey(anyInt())).thenReturn(apartment);

        ApartmentDevice apartmentDevice = apartmentDeviceDAO.findByPrimaryKey(1);
        assertNotNull(apartmentDevice);
        assertEquals(1, apartmentDevice.getId());
        assertEquals("Device1", apartmentDevice.getName());
        assertTrue(apartmentDevice.getConsumesEnergy());
    }

    @Test
    public void testSaveOrUpdate_Insert() throws SQLException, JsonProcessingException {
        ApartmentDevice apartmentDevice = new ApartmentDevice(0, "Device1", true, new EnergyCurve(), new Apartment(1, new Building(), 1, 1, "A", new User(0, "User1", "come", new Credentials("ciao", "ciao"), new Date(0),"1234567890")));
        when(connection.prepareStatement(any(String.class), anyInt())).thenReturn(mock(PreparedStatement.class));
        when(connection.prepareStatement(any(String.class))).thenReturn(mock(PreparedStatement.class));

        boolean result = apartmentDeviceDAO.saveOrUpdate(apartmentDevice);
        assertTrue(result);
    }

    @Test
    public void testSaveOrUpdate_Update() throws SQLException, JsonProcessingException {
        ApartmentDevice apartmentDevice = new ApartmentDevice(1, "Device1", true, new EnergyCurve(), new Apartment(1, new Building(), 1, 1, "A", new User(0, "User1", "come", new Credentials("ciao", "ciao"), new Date(0),"1234567890")));
        when(connection.prepareStatement(any(String.class))).thenReturn(mock(PreparedStatement.class));
        when(apartmentDeviceDAO.findByPrimaryKey(anyInt())).thenReturn(apartmentDevice);

        boolean result = apartmentDeviceDAO.saveOrUpdate(apartmentDevice);
        assertTrue(result);
    }

    @Test
    public void testDelete() throws SQLException {
        ApartmentDevice apartmentDevice = new ApartmentDevice(1, "Device1", true, new EnergyCurve(), new Apartment(1, new Building(), 1, 1, "A", new User(0, "User1", "come", new Credentials("ciao", "ciao"), new Date(0),"1234567890")));
        PreparedStatement pstmt = mock(PreparedStatement.class);
        when(connection.prepareStatement(any(String.class))).thenReturn(pstmt);

        boolean result = apartmentDeviceDAO.delete(apartmentDevice);
        assertTrue(result);
    }

    @Test
    public void testFindAll() throws SQLException, IOException {
        PreparedStatement pstmt = mock(PreparedStatement.class);
        ResultSet rs = mock(ResultSet.class);
        when(connection.prepareStatement(any(String.class))).thenReturn(pstmt);
        when(pstmt.executeQuery()).thenReturn(rs);
        when(rs.next()).thenReturn(true).thenReturn(false);
        when(rs.getInt("id")).thenReturn(1);
        when(rs.getString("name")).thenReturn("Device1");
        when(rs.getBoolean("consumes_energy")).thenReturn(true);
        when(rs.getInt("apartment_id")).thenReturn(1);

        Apartment apartment = mock(Apartment.class);
        when(DBManager.getInstance().getApartmentDAO().findByPrimaryKey(anyInt())).thenReturn(apartment);

        List<ApartmentDevice> apartmentDevices = apartmentDeviceDAO.findAll();
        assertNotNull(apartmentDevices);
        assertEquals(1, apartmentDevices.size());
    }
}