package com.example.demo.persistence;

import java.nio.file.Files;
import java.nio.file.Path;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.sql.Statement;

public class TS_DBManager {
    private final String dbPath = "src/main/resources/";
    private final String dbName = "timeseries.db";

    private static TS_DBManager instance;
    private Connection connection;

    private TS_DBManager() {
    }

    public static synchronized TS_DBManager getInstance() {
        if (instance == null) {
            instance = new TS_DBManager();
        }
        return instance;
    }

    public Connection getConnection() {
        try {
            if (connection == null || connection.isClosed()) {
                connection = DriverManager.getConnection("jdbc:sqlite:" + dbPath + dbName);
            }
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
        return connection;
    }

    public boolean checkAndCreateDatabase() {
        Path path = Path.of(dbPath + dbName);
        if (!Files.exists(path)) {
            try {
                return createDatabase();
            } catch (SQLException e) {
                throw new RuntimeException(e);
            }
        }
        return false;
    }

    private boolean createDatabase() throws SQLException {
        Connection connection = null;
        Statement statement = null;

        try {
            connection = getConnection();
            statement = connection.createStatement();

            // Tabella dei dispositivi
            statement.execute("""
                        CREATE TABLE IF NOT EXISTS device (
                            device_id INTEGER PRIMARY KEY AUTOINCREMENT,
                            device_uuid INTEGER NOT NULL UNIQUE,
                        )
                    """);

            // Tabella delle misurazioni
            statement.execute("""
                        CREATE TABLE IF NOT EXISTS measurement (
                            measurement_id INTEGER PRIMARY KEY AUTOINCREMENT,
                            device_id INTEGER NOT NULL,
                            timestamp TIMESTAMP NOT NULL,
                            value REAL NOT NULL,
                            FOREIGN KEY (device_id) REFERENCES device(device_id)
                        )
                    """);

            // Indici per ottimizzare le query
            statement.execute("""
                        CREATE INDEX IF NOT EXISTS idx_device_name
                        ON device(device_name)
                    """);

            statement.execute("""
                        CREATE INDEX IF NOT EXISTS idx_measurement_device_timestamp
                        ON measurement(device_id, timestamp)
                    """);

            statement.execute("""
                        CREATE INDEX IF NOT EXISTS idx_measurement_timestamp
                        ON measurement(timestamp)
                    """);

        } catch (SQLException e) {
            return false;
        } finally {
            if (statement != null) {
                statement.close();
            }
            if (connection != null) {
                connection.close();
            }
        }
        return true;
    }

    public TS_DeviceDAO getTS_DeviceDAO() {
        return new TS_DeviceDAO(getConnection());
    }

    public TS_MeasurementDAO getTS_MeasurementDAO() {
        return new TS_MeasurementDAO(getConnection());
    }
}