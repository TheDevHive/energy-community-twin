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
                    "email VARCHAR PRIMARY KEY, "+
                    "password VARCHAR NOT NULL);");

            statement.execute("CREATE TABLE IF NOT EXISTS admin ("+
                    "id INTEGER PRIMARY KEY AUTOINCREMENT, "+
                    "email VARCHAR NOT NULL, "+
                    "FOREIGN KEY (email) REFERENCES credentials(email));");

            statement.execute("CREATE TABLE IF NOT EXISTS user ("+
                    "id INTEGER PRIMARY KEY AUTOINCREMENT, "+
                    "email VARCHAR NOT NULL, "+
                    "FOREIGN KEY (email) REFERENCES credentials(email));");

            statement.execute("CREATE TABLE IF NOT EXISTS community ("+
                    "id INTEGER PRIMARY KEY AUTOINCREMENT, "+
                    "admin_id INTEGER NOT NULL, "+
                    "FOREIGN KEY (admin_id) REFERENCES admin(id));");

            statement.execute("CREATE TABLE IF NOT EXISTS building ("+
                    "id INTEGER PRIMARY KEY AUTOINCREMENT, "+
                    "community_id INTEGER NOT NULL, "+
                    "FOREIGN KEY (community_id) REFERENCES community(id));");

            statement.execute("CREATE TABLE IF NOT EXISTS building_device ("+
                    "id INTEGER PRIMARY KEY AUTOINCREMENT, "+
                    "building_id INTEGER NOT NULL, "+
                    "FOREIGN KEY (building_id) REFERENCES building(id));");

            statement.execute("CREATE TABLE IF NOT EXISTS household ("+
                    "id INTEGER PRIMARY KEY AUTOINCREMENT, "+
                    "building_id INTEGER NOT NULL, "+
                    "user_id INTEGER NOT NULL, "+
                    "FOREIGN KEY (user_id) REFERENCES user(id), "+
                    "FOREIGN KEY (building_id) REFERENCES building(id));");

            statement.execute("CREATE TABLE IF NOT EXISTS household_device ("+
                    "id INTEGER PRIMARY KEY AUTOINCREMENT, "+
                    "household_id INTEGER NOT NULL, "+
                    "FOREIGN KEY (household_id) REFERENCES household(id));");

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
