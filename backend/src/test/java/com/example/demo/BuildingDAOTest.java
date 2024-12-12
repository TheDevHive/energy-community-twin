package com.example.demo;

import com.example.demo.model.Building;
import com.example.demo.model.Community;
import com.example.demo.model.User;
import com.example.demo.persistence.DAO.BuildingDAO;
import com.example.demo.persistence.DAO.CommunityDAO;
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

public class BuildingDAOTest {
    @Mock
    private Connection mockConnection;

    @Mock
    private PreparedStatement mockPreparedStatement;

    @Mock
    private ResultSet mockResultSet;

    @Mock
    private User mockUser;

    @Mock
    private Community mockCommunity;

    private Building building;

    @InjectMocks
    private BuildingDAO buildingDAO;

    @BeforeEach
    public void setUp() throws Exception {
        MockitoAnnotations.openMocks(this);
        buildingDAO = new BuildingDAO(mockConnection);
        building = new Building(1, mockCommunity, "123 Main St", 3, 0.20);
    }

    @Test
    public void testSaveOrUpdate_InsertNewBuilding() throws SQLException {
        // Set up
        when(mockCommunity.getId()).thenReturn(1);
        when(mockUser.getId()).thenReturn(1);

        BuildingDAO spyBuildingDAO = Mockito.spy(buildingDAO);
        doReturn(null).when(spyBuildingDAO).findByPrimaryKey(building.getId());

        when(mockConnection.prepareStatement(anyString())).thenReturn(mockPreparedStatement);
        when(mockPreparedStatement.executeUpdate()).thenReturn(1);
        when(mockPreparedStatement.getGeneratedKeys()).thenReturn(mockResultSet);
        when(mockResultSet.next()).thenReturn(true);
        when(mockResultSet.getInt(1)).thenReturn(1);

        // Execute
        spyBuildingDAO.saveOrUpdate(building);

        // Assert
        verify(mockPreparedStatement).setInt(1, building.getCommunity().getId());
        verify(mockPreparedStatement).setString(2, building.getAddress());
        verify(mockPreparedStatement).setInt(3, building.getFloors());
        verify(mockPreparedStatement).setDouble(4, building.getEnergyCost());
        verify(mockPreparedStatement).executeUpdate();
        assertEquals(1, building.getId());
    }

    @Test
    public void testSaveOrUpdate_UpdateExistingApartment() throws SQLException {
        // Set up
        when(mockCommunity.getId()).thenReturn(1);
        when(mockUser.getId()).thenReturn(1);

        BuildingDAO spyBuildingDAO = Mockito.spy(buildingDAO);
        doReturn(building).when(spyBuildingDAO).findByPrimaryKey(building.getId());

        when(mockConnection.prepareStatement(anyString())).thenReturn(mockPreparedStatement);
        when(mockPreparedStatement.executeUpdate()).thenReturn(1);

        // Execute
        spyBuildingDAO.saveOrUpdate(building);

        // Assert
        verify(mockPreparedStatement).setInt(1, building.getCommunity().getId());
        verify(mockPreparedStatement).setString(2, building.getAddress());
        verify(mockPreparedStatement).setInt(3, building.getFloors());
        verify(mockPreparedStatement).setDouble(4, building.getEnergyCost());
        verify(mockPreparedStatement).setInt(5, building.getId());
        verify(mockPreparedStatement).executeUpdate();
    }

    @Test
    public void testFindAll() throws SQLException {
        // Set up
        when(mockConnection.prepareStatement(anyString())).thenReturn(mockPreparedStatement);
        when(mockPreparedStatement.executeQuery()).thenReturn(mockResultSet);

        when(mockResultSet.next()).thenReturn(true, true, false);
        when(mockResultSet.getInt("id")).thenReturn(1, 2);
        when(mockResultSet.getInt("community_id")).thenReturn(1, 2);
        when(mockResultSet.getString("address")).thenReturn("123 Main St", "456 Elm St");
        when(mockResultSet.getInt("floors")).thenReturn(3, 4);
        when(mockResultSet.getDouble("energy_cost")).thenReturn(0.20, 0.25);

        CommunityDAO mockCommunityDAO = mock(CommunityDAO.class);
        when(mockCommunityDAO.findByPrimaryKey(1)).thenReturn(mockCommunity);
        when(mockCommunityDAO.findByPrimaryKey(2)).thenReturn(mockCommunity);

        DBManager mockDBManager = mock(DBManager.class);
        try (MockedStatic<DBManager> mockedDBManager = Mockito.mockStatic(DBManager.class)) {
            mockedDBManager.when(DBManager::getInstance).thenReturn(mockDBManager);
            when(mockDBManager.getCommunityDAO()).thenReturn(mockCommunityDAO);

            // Execute
            List<Building> buildings = buildingDAO.findAll();

            // Assert
            assertNotNull(buildings);
            assertEquals(2, buildings.size());
        }
    }

    @Test
    public void testFindByPrimaryKey_Found() throws SQLException {
        // Set up
        when(mockConnection.prepareStatement(anyString())).thenReturn(mockPreparedStatement);
        when(mockPreparedStatement.executeQuery()).thenReturn(mockResultSet);

        when(mockResultSet.next()).thenReturn(true);
        when(mockResultSet.getInt("id")).thenReturn(1);
        when(mockResultSet.getInt("community_id")).thenReturn(1);
        when(mockResultSet.getString("address")).thenReturn("123 Main St");
        when(mockResultSet.getInt("floors")).thenReturn(3);
        when(mockResultSet.getDouble("energy_cost")).thenReturn(0.20);

        CommunityDAO mockCommunityDAO = mock(CommunityDAO.class);
        when(mockCommunityDAO.findByPrimaryKey(1)).thenReturn(mockCommunity);
        DBManager mockDBManager = mock(DBManager.class);
        try (MockedStatic<DBManager> mockedDBManager = Mockito.mockStatic(DBManager.class)) {
            mockedDBManager.when(DBManager::getInstance).thenReturn(mockDBManager);
            when(mockDBManager.getCommunityDAO()).thenReturn(mockCommunityDAO);

            // Execute
            Building result = buildingDAO.findByPrimaryKey(1);

            // Assert
            assertNotNull(result);
            assertEquals(1, result.getId());
            assertEquals(mockCommunity, result.getCommunity());
            assertEquals("123 Main St", result.getAddress());
            assertEquals(3, result.getFloors());
            assertEquals(0.20, result.getEnergyCost());
        }
    }

    @Test
    public void testFindByPrimaryKey_NotFound() throws SQLException {

        when(mockConnection.prepareStatement(anyString())).thenReturn(mockPreparedStatement);
        when(mockPreparedStatement.executeQuery()).thenReturn(mockResultSet);
        when(mockResultSet.next()).thenReturn(false);

        // Execute
        Building result = buildingDAO.findByPrimaryKey(1);

        // Assert
        assertNull(result);
    }

    @Test
    public void testDelete_Success() throws SQLException {
        // Set up
        Building building = new Building();
        building.setId(1);

        when(mockConnection.prepareStatement(anyString())).thenReturn(mockPreparedStatement);
        when(mockPreparedStatement.executeUpdate()).thenReturn(1);

        // Execute
        boolean result = buildingDAO.delete(building);

        // Assert
        assertTrue(result);
        verify(mockPreparedStatement).setInt(1, building.getId());
        verify(mockPreparedStatement).executeUpdate();
    }

}
