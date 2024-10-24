package com.example.demo.persistence;

import java.nio.file.Files;
import java.nio.file.Path;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.sql.Statement;

public class DBManager {
    private final String dbPath = "backend/src/main/resources/";
    private final String dbName = "database.db";

    private static DBManager instance;

    private DBManager() {}

    public static synchronized DBManager getInstance() {
        if (instance == null) {
            instance = new DBManager();
        }
        return instance;
    }

    public Connection getConnection(){
        try {
            return DriverManager.getConnection("jdbc:sqlite:" + dbPath + dbName);
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
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

            statement.execute("CREATE TABLE IF NOT EXISTS credentials ("+
                    "email varchar PRIMARY KEY, "+
                    "password varchar not null);");

        } catch (SQLException ignored) {
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
}
