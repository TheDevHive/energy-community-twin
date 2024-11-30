package com.example.demo;

import com.example.demo.model.TS_Measurement;
import com.example.demo.persistence.DAO.TS_MeasurementDAO;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

public class TS_MeasurementDAOTest {
    @Mock
    private Connection mockConnection;

    @Mock
    private PreparedStatement mockPreparedStatement;

    @Mock
    private ResultSet mockResultSet;

    private TS_Measurement measurement;

    @InjectMocks
    private TS_MeasurementDAO measurementDAO;

    private TS_MeasurementDAO spyMeasurementDAO;

    @BeforeEach
    public void setUp() throws Exception {
        MockitoAnnotations.openMocks(this);
        measurementDAO = new TS_MeasurementDAO(mockConnection);
        measurement = new TS_Measurement(1, 1, 100, LocalDateTime.of(2024, 1, 1, 13, 0), 42.5); // Added reportId
        spyMeasurementDAO = Mockito.spy(measurementDAO);
    }

    @Test
    public void testSaveOrUpdate_InsertNewMeasurement() throws SQLException {
        // Set up
        doReturn(null).when(spyMeasurementDAO).findByPrimaryKey(measurement.getId());

        when(mockConnection.prepareStatement(anyString())).thenReturn(mockPreparedStatement);
        when(mockPreparedStatement.executeUpdate()).thenReturn(1);
        when(mockPreparedStatement.getGeneratedKeys()).thenReturn(mockResultSet);
        when(mockResultSet.next()).thenReturn(true);
        when(mockResultSet.getInt(1)).thenReturn(1);

        // Execute
        spyMeasurementDAO.saveOrUpdate(measurement);

        // Assert
        verify(mockPreparedStatement).setInt(1, measurement.getDeviceId());
        verify(mockPreparedStatement).setInt(2, measurement.getReportId());
        verify(mockPreparedStatement).setTimestamp(3, Timestamp.valueOf(measurement.getTimestamp()));
        verify(mockPreparedStatement).setDouble(4, measurement.getValue());
        verify(mockPreparedStatement).executeUpdate();
    }

    @Test
    public void testSaveOrUpdate_UpdateExistingMeasurement() throws SQLException {
        // Set up
        doReturn(measurement).when(spyMeasurementDAO).findByPrimaryKey(measurement.getId());

        when(mockConnection.prepareStatement(anyString())).thenReturn(mockPreparedStatement);
        when(mockPreparedStatement.executeUpdate()).thenReturn(1);

        // Execute
        spyMeasurementDAO.saveOrUpdate(measurement);

        // Assert
        verify(mockPreparedStatement).setInt(1, measurement.getDeviceId());
        verify(mockPreparedStatement).setInt(2, measurement.getReportId());
        verify(mockPreparedStatement).setTimestamp(3, Timestamp.valueOf(measurement.getTimestamp()));
        verify(mockPreparedStatement).setDouble(4, measurement.getValue());
        verify(mockPreparedStatement).setInt(5, measurement.getId());
        verify(mockPreparedStatement).executeUpdate();
    }

    @Test
    public void testFindByDeviceId() throws SQLException {
        // Set up
        when(mockConnection.prepareStatement(anyString())).thenReturn(mockPreparedStatement);
        when(mockPreparedStatement.executeQuery()).thenReturn(mockResultSet);
        when(mockResultSet.next()).thenReturn(true, true, false);
        when(mockResultSet.getInt("measurement_id")).thenReturn(1, 2);
        when(mockResultSet.getInt("device_id")).thenReturn(1, 1);
        when(mockResultSet.getTimestamp("timestamp"))
                .thenReturn(Timestamp.valueOf("2024-01-01 12:00:00"), Timestamp.valueOf("2024-01-01 13:00:00"));
        when(mockResultSet.getDouble("value")).thenReturn(42.5, 43.5);

        // Execute
        List<TS_Measurement> measurements = measurementDAO.findByDeviceId(1);

        // Assert
        assertNotNull(measurements);
        assertEquals(2, measurements.size());
        assertEquals(LocalDateTime.of(2024, 1, 1, 12, 0), measurements.get(0).getTimestamp());
        assertEquals(42.5, measurements.get(0).getValue(), 0.001);
    }


    @Test
    public void testFindByDeviceIdAndTimeRange() throws SQLException {
        // Set up
        String startTime = "2024-01-01 12:00:00";
        String endTime = "2024-01-01 14:00:00";

        when(mockConnection.prepareStatement(anyString())).thenReturn(mockPreparedStatement);
        when(mockPreparedStatement.executeQuery()).thenReturn(mockResultSet);
        when(mockResultSet.next()).thenReturn(true, false);
        when(mockResultSet.getInt("measurement_id")).thenReturn(1);
        when(mockResultSet.getInt("device_id")).thenReturn(1);
        when(mockResultSet.getTimestamp("timestamp"))
                .thenReturn(Timestamp.valueOf("2024-01-01 13:00:00"));
        when(mockResultSet.getDouble("value")).thenReturn(42.5);

        // Execute
        List<TS_Measurement> measurements = measurementDAO.findByDeviceIdAndTimeRange(1, startTime, endTime);

        // Assert
        assertNotNull(measurements);
        assertEquals(1, measurements.size());
        assertEquals(LocalDateTime.of(2024, 1, 1, 13, 0), measurements.get(0).getTimestamp());
        assertEquals(42.5, measurements.get(0).getValue(), 0.001);

        verify(mockPreparedStatement).setInt(1, 1);
        verify(mockPreparedStatement).setString(2, startTime);
        verify(mockPreparedStatement).setString(3, endTime);
    }


    @Test
    public void testDeleteByDeviceId() throws SQLException {
        // Set up
        when(mockConnection.prepareStatement(anyString())).thenReturn(mockPreparedStatement);
        when(mockPreparedStatement.executeUpdate()).thenReturn(1);

        // Execute
        boolean result = measurementDAO.deleteByDeviceId(1);

        // Assert
        assertTrue(result);
        verify(mockPreparedStatement).setInt(1, 1);
        verify(mockPreparedStatement).executeUpdate();
    }

    @Test
    public void testFindAll() throws SQLException {
        when(mockConnection.prepareStatement(anyString())).thenReturn(mockPreparedStatement);
        when(mockPreparedStatement.executeQuery()).thenReturn(mockResultSet);
        when(mockResultSet.next()).thenReturn(true, true, false);
        when(mockResultSet.getInt("measurement_id")).thenReturn(1, 2);
        when(mockResultSet.getInt("device_id")).thenReturn(1, 2);
        when(mockResultSet.getTimestamp("timestamp"))
                .thenReturn(Timestamp.valueOf("2024-01-01 12:00:00"), Timestamp.valueOf("2024-01-01 13:00:00"));
        when(mockResultSet.getDouble("value")).thenReturn(42.5, 43.5);

        List<TS_Measurement> measurements = measurementDAO.findAll();

        assertNotNull(measurements);
        assertEquals(2, measurements.size());
    }

}