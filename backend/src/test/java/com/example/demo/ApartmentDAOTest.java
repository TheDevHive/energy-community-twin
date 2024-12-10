package com.example.demo;

import com.example.demo.model.Apartment;
import com.example.demo.model.Building;
import com.example.demo.model.User;
import com.example.demo.persistence.DAO.ApartmentDAO;
import com.example.demo.persistence.DAO.BuildingDAO;
import com.example.demo.persistence.DAO.UserDAO;
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

public class ApartmentDAOTest {

    @Mock
    private Connection mockConnection;

    @Mock
    private PreparedStatement mockPreparedStatement;

    @Mock
    private ResultSet mockResultSet;

    @Mock
    private Building mockBuilding;

    @Mock
    private User mockUser;

    @InjectMocks
    private ApartmentDAO apartmentDAO;

    private Apartment apartment;

    private ApartmentDAO spyApartmentDAO;

    @BeforeEach
    public void setUp() throws Exception {
        MockitoAnnotations.openMocks(this);
        apartmentDAO = new ApartmentDAO(mockConnection);
        spyApartmentDAO = Mockito.spy(apartmentDAO);
        apartment = new Apartment(0, mockBuilding, 3, 100, "A", 0.20, mockUser);
    }

    @Test
    public void testSaveOrUpdate_InsertNewApartment() throws SQLException {
        // Set up
        when(mockBuilding.getId()).thenReturn(1);
        when(mockUser.getId()).thenReturn(1);

        doReturn(null).when(spyApartmentDAO).findByPrimaryKey(apartment.getId());

        when(mockConnection.prepareStatement(anyString())).thenReturn(mockPreparedStatement);
        when(mockPreparedStatement.executeUpdate()).thenReturn(1);
        when(mockPreparedStatement.getGeneratedKeys()).thenReturn(mockResultSet);
        when(mockResultSet.next()).thenReturn(true);
        when(mockResultSet.getInt(1)).thenReturn(1);

        // Execute
        spyApartmentDAO.saveOrUpdate(apartment);

        // Assert
        verify(mockPreparedStatement).setInt(1, apartment.getResidents());
        verify(mockPreparedStatement).setInt(2, apartment.getSquareFootage());
        verify(mockPreparedStatement).setString(3, apartment.getEnergyClass());
        verify(mockPreparedStatement).setDouble(4, apartment.getEnergyCost());
        verify(mockPreparedStatement).setInt(5, apartment.getBuilding().getId());
        verify(mockPreparedStatement).setInt(6, apartment.getUser().getId());
        verify(mockPreparedStatement).executeUpdate();
        assertEquals(1, apartment.getId());
    }

    @Test
    public void testSaveOrUpdate_UpdateExistingApartment() throws SQLException {
        // Set up
        when(mockBuilding.getId()).thenReturn(1);
        when(mockUser.getId()).thenReturn(1);

        doReturn(apartment).when(spyApartmentDAO).findByPrimaryKey(apartment.getId());

        when(mockConnection.prepareStatement(anyString())).thenReturn(mockPreparedStatement);
        when(mockPreparedStatement.executeUpdate()).thenReturn(1);

        // Execute
        spyApartmentDAO.saveOrUpdate(apartment);

        // Assert
        verify(mockPreparedStatement).setInt(1, apartment.getResidents());
        verify(mockPreparedStatement).setInt(2, apartment.getSquareFootage());
        verify(mockPreparedStatement).setString(3, apartment.getEnergyClass());
        verify(mockPreparedStatement).setDouble(4, apartment.getEnergyCost());
        verify(mockPreparedStatement).setInt(5, apartment.getBuilding().getId());
        verify(mockPreparedStatement).setInt(6, apartment.getUser().getId());
        verify(mockPreparedStatement).setInt(7, apartment.getId());
        verify(mockPreparedStatement).executeUpdate();
    }

    @Test
    public void testFindByPrimaryKey_Found() throws SQLException {
        // Set up
        when(mockConnection.prepareStatement(anyString())).thenReturn(mockPreparedStatement);
        when(mockPreparedStatement.executeQuery()).thenReturn(mockResultSet);

        when(mockResultSet.next()).thenReturn(true);
        when(mockResultSet.getInt("id")).thenReturn(1);
        when(mockResultSet.getInt("building_id")).thenReturn(2);
        when(mockResultSet.getInt("user_id")).thenReturn(3);
        when(mockResultSet.getInt("residents")).thenReturn(3);
        when(mockResultSet.getInt("square_footage")).thenReturn(100);
        when(mockResultSet.getString("energy_class")).thenReturn("A");
        when(mockResultSet.getDouble("energy_cost")).thenReturn(0.20);

        BuildingDAO mockBuildingDAO = mock(BuildingDAO.class);
        UserDAO mockUserDAO = mock(UserDAO.class);

        Building mockBuilding = mock(Building.class);
        User mockUser = mock(User.class);

        when(mockBuildingDAO.findByPrimaryKey(2)).thenReturn(mockBuilding);
        when(mockUserDAO.findByPrimaryKey(3)).thenReturn(mockUser);

        DBManager mockDBManager = mock(DBManager.class);
        try (MockedStatic<DBManager> mockedDBManager = Mockito.mockStatic(DBManager.class)) {
            mockedDBManager.when(DBManager::getInstance).thenReturn(mockDBManager);
            when(mockDBManager.getBuildingDAO()).thenReturn(mockBuildingDAO);
            when(mockDBManager.getUserDAO()).thenReturn(mockUserDAO);

            // Execute
            Apartment resultApartment = apartmentDAO.findByPrimaryKey(1);

            // Assert
            assertNotNull(resultApartment);
            assertEquals(1, resultApartment.getId());
            assertEquals(mockBuilding, resultApartment.getBuilding());
            assertEquals(mockUser, resultApartment.getUser());
            assertEquals(3, resultApartment.getResidents());
            assertEquals(100, resultApartment.getSquareFootage());
            assertEquals("A", resultApartment.getEnergyClass());
            assertEquals(0.20, resultApartment.getEnergyCost());
        }
    }

    @Test
    public void testFindByPrimaryKey_NotFound() throws SQLException {
        // Set up
        int apartmentId = 1;

        when(mockConnection.prepareStatement(anyString())).thenReturn(mockPreparedStatement);
        when(mockPreparedStatement.executeQuery()).thenReturn(mockResultSet);
        when(mockResultSet.next()).thenReturn(false);

        // Execute
        Apartment resultApartment = apartmentDAO.findByPrimaryKey(apartmentId);

        // Assert
        assertNull(resultApartment);
    }

    @Test
    public void testFindAll() throws SQLException {
        // Set up
        when(mockConnection.prepareStatement(anyString())).thenReturn(mockPreparedStatement);
        when(mockPreparedStatement.executeQuery()).thenReturn(mockResultSet);

        when(mockResultSet.next()).thenReturn(true, true, false);
        when(mockResultSet.getInt("id")).thenReturn(1, 2);
        when(mockResultSet.getInt("building_id")).thenReturn(1, 2);
        when(mockResultSet.getInt("user_id")).thenReturn(1, 2);
        when(mockResultSet.getInt("residents")).thenReturn(3, 4);
        when(mockResultSet.getInt("square_footage")).thenReturn(100, 120);
        when(mockResultSet.getString("energy_class")).thenReturn("A", "B");
        when(mockResultSet.getDouble("energy_cost")).thenReturn(0.20, 0.25);

        BuildingDAO mockBuildingDAO = mock(BuildingDAO.class);
        UserDAO mockUserDAO = mock(UserDAO.class);

        Building building1 = mock(Building.class);
        Building building2 = mock(Building.class);
        User user1 = mock(User.class);
        User user2 = mock(User.class);

        when(mockBuildingDAO.findByPrimaryKey(1)).thenReturn(building1);
        when(mockBuildingDAO.findByPrimaryKey(2)).thenReturn(building2);
        when(mockUserDAO.findByPrimaryKey(1)).thenReturn(user1);
        when(mockUserDAO.findByPrimaryKey(2)).thenReturn(user2);

        DBManager mockDBManager = mock(DBManager.class);
        try (MockedStatic<DBManager> mockedDBManager = Mockito.mockStatic(DBManager.class)) {
            mockedDBManager.when(DBManager::getInstance).thenReturn(mockDBManager);
            when(mockDBManager.getBuildingDAO()).thenReturn(mockBuildingDAO);
            when(mockDBManager.getUserDAO()).thenReturn(mockUserDAO);

            // Execute
            List<Apartment> apartments = apartmentDAO.findAll();

            // Assert
            assertNotNull(apartments);
            assertEquals(2, apartments.size());
        }
    }

    @Test
    public void testDelete_Success() throws SQLException {
        // Set up
        when(mockConnection.prepareStatement(anyString())).thenReturn(mockPreparedStatement);
        when(mockPreparedStatement.executeUpdate()).thenReturn(1);

        // Execute
        boolean result = apartmentDAO.delete(apartment);

        // Assert
        assertTrue(result);
        verify(mockPreparedStatement).setInt(1, apartment.getId());
        verify(mockPreparedStatement).executeUpdate();
    }
}
