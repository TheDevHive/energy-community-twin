package com.example.demo;

import com.example.demo.model.Admin;
import com.example.demo.model.Community;
import com.example.demo.persistence.DAO.AdminDAO;
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

public class CommunityDAOTest {
    @Mock
    private Connection mockConnection;

    @Mock
    private PreparedStatement mockPreparedStatement;

    @Mock
    private ResultSet mockResultSet;

    @Mock
    private Admin mockAdmin;

    private Community community;

    @InjectMocks
    private CommunityDAO communityDAO;

    @BeforeEach
    public void setUp() throws Exception {
        MockitoAnnotations.openMocks(this);
        communityDAO = new CommunityDAO(mockConnection);
        community= new Community(1, "Test Community", mockAdmin);
    }

    @Test
    public void testSaveOrUpdate_InsertNewBuilding() throws SQLException {
        // Arrange
        when(mockAdmin.getId()).thenReturn(1);

        CommunityDAO spyCommunityDAO = Mockito.spy(communityDAO);
        doReturn(null).when(spyCommunityDAO).findByPrimaryKey(community.getId());

        when(mockConnection.prepareStatement(anyString())).thenReturn(mockPreparedStatement);
        when(mockPreparedStatement.executeUpdate()).thenReturn(1);
        when(mockPreparedStatement.getGeneratedKeys()).thenReturn(mockResultSet);
        when(mockResultSet.next()).thenReturn(true);
        when(mockResultSet.getInt(1)).thenReturn(1);

        // Act
        spyCommunityDAO.saveOrUpdate(community);

        // Assert
        verify(mockPreparedStatement).setString(1, community.getName());
        verify(mockPreparedStatement).setInt(2, community.getAdmin().getId());
        verify(mockPreparedStatement).executeUpdate();
        assertEquals(1, community.getId());
    }


    @Test
    public void testSaveOrUpdate_UpdateExistingApartment() throws SQLException {
        // Arrange
        when(mockAdmin.getId()).thenReturn(1);

        CommunityDAO spyCommunityDAO = Mockito.spy(communityDAO);
        doReturn(community).when(spyCommunityDAO).findByPrimaryKey(community.getId());

        when(mockConnection.prepareStatement(anyString())).thenReturn(mockPreparedStatement);
        when(mockPreparedStatement.executeUpdate()).thenReturn(1);

        // Act
        spyCommunityDAO.saveOrUpdate(community);

        // Assert
        verify(mockPreparedStatement).setString(1, community.getName());
        verify(mockPreparedStatement).setInt(2, community.getAdmin().getId());
        verify(mockPreparedStatement).setInt(3, community.getId());
        verify(mockPreparedStatement).executeUpdate();
    }

    @Test
    public void testFindAll() throws SQLException {
        // Arrange
        when(mockConnection.prepareStatement(anyString())).thenReturn(mockPreparedStatement);
        when(mockPreparedStatement.executeQuery()).thenReturn(mockResultSet);

        when(mockResultSet.next()).thenReturn(true, true, false);
        when(mockResultSet.getInt("id")).thenReturn(1, 2);
        when(mockResultSet.getString("name")).thenReturn("Test Community 1", "Test Community 2");
        when(mockResultSet.getInt("admin_id")).thenReturn(1,2);

        AdminDAO mockAdminDAO = mock(AdminDAO.class);
        when(mockAdminDAO.findByPrimaryKey(1)).thenReturn(mockAdmin);
        when(mockAdminDAO.findByPrimaryKey(2)).thenReturn(mockAdmin);

        DBManager mockDBManager = mock(DBManager.class);
        try (MockedStatic<DBManager> mockedDBManager = Mockito.mockStatic(DBManager.class)) {
            mockedDBManager.when(DBManager::getInstance).thenReturn(mockDBManager);
            when(mockDBManager.getAdminDAO()).thenReturn(mockAdminDAO);

            // Act
            List<Community> communities = communityDAO.findAll();

            // Assert
            assertNotNull(communities);
            assertEquals(2, communities.size());
        }
    }

    @Test
    public void testFindByPrimaryKey_Found() throws SQLException {
        // Arrange
        when(mockConnection.prepareStatement(anyString())).thenReturn(mockPreparedStatement);
        when(mockPreparedStatement.executeQuery()).thenReturn(mockResultSet);

        when(mockResultSet.next()).thenReturn(true);
        when(mockResultSet.getInt("id")).thenReturn(1);
        when(mockResultSet.getString("name")).thenReturn("Test Community");
        when(mockResultSet.getInt("admin_id")).thenReturn(1);

        AdminDAO mockAdminDAO = mock(AdminDAO.class);
        when(mockAdminDAO.findByPrimaryKey(1)).thenReturn(mockAdmin);
        DBManager mockDBManager = mock(DBManager.class);
        try (MockedStatic<DBManager> mockedDBManager = Mockito.mockStatic(DBManager.class)) {
            mockedDBManager.when(DBManager::getInstance).thenReturn(mockDBManager);
            when(mockDBManager.getAdminDAO()).thenReturn(mockAdminDAO);

            // Act
            Community result = communityDAO.findByPrimaryKey(1);

            // Assert
            assertNotNull(result);
            assertEquals(1, result.getId());
            assertEquals(mockAdmin, result.getAdmin());
            assertEquals("Test Community", result.getName());
        }
    }

    @Test
    public void testFindByPrimaryKey_NotFound() throws SQLException {

        when(mockConnection.prepareStatement(anyString())).thenReturn(mockPreparedStatement);
        when(mockPreparedStatement.executeQuery()).thenReturn(mockResultSet);
        when(mockResultSet.next()).thenReturn(false);

        // Act
        Community result = communityDAO.findByPrimaryKey(1);

        // Assert
        assertNull(result);
    }

    @Test
    public void testDelete_Success() throws SQLException {
        // Arrange
        Community com = new Community();
        com.setId(1);

        when(mockConnection.prepareStatement(anyString())).thenReturn(mockPreparedStatement);
        when(mockPreparedStatement.executeUpdate()).thenReturn(1);

        // Act
        boolean result = communityDAO.delete(community);

        // Assert
        assertTrue(result);
        verify(mockPreparedStatement).setInt(1, com.getId());
        verify(mockPreparedStatement).executeUpdate();
    }
}
