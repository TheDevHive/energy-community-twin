package com.example.demo.persistence;

import com.example.demo.persistence.DAO.*;

import java.nio.file.Files;
import java.nio.file.Path;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.sql.Statement;

public class DBManager {
    private final String dbPath = "src/main/resources/";
    private final String dbName = "database.db";

    private static DBManager instance;

    private DBManager() {}

    public static synchronized DBManager getInstance() {
        if (instance == null) {
            instance = new DBManager();
        }
        return instance;
    }

    private Connection connection;

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

            statement.execute("CREATE TABLE IF NOT EXISTS credentials ("+
                    "email VARCHAR PRIMARY KEY, "+
                    "password VARCHAR NOT NULL);");

            statement.execute("CREATE TABLE IF NOT EXISTS admin ("+
                    "id INTEGER PRIMARY KEY AUTOINCREMENT, "+
                    "email VARCHAR NOT NULL UNIQUE, "+
                    "FOREIGN KEY (email) REFERENCES credentials(email));");

            statement.execute("CREATE TABLE IF NOT EXISTS user ("+
                    "id INTEGER PRIMARY KEY AUTOINCREMENT, "+
                    "email VARCHAR NOT NULL UNIQUE, "+
                    "name VARCHAR NOT NULL, "+
                    "surname VARCHAR NOT NULL, "+
                    "birth_date DATE NOT NULL, " +
                    "phone VARCHAR, " +
                    "FOREIGN KEY (email) REFERENCES credentials(email));");

            statement.execute("CREATE TABLE IF NOT EXISTS community ("+
                    "id INTEGER PRIMARY KEY AUTOINCREMENT, "+
                    "name VARCHAR NOT NULL, "+
                    "admin_id INTEGER NOT NULL, "+
                    "FOREIGN KEY (admin_id) REFERENCES admin(id));");

            statement.execute("CREATE TABLE IF NOT EXISTS building ("+
                    "id INTEGER PRIMARY KEY AUTOINCREMENT, "+
                    "community_id INTEGER NOT NULL, "+
                    "address VARCHAR NOT NULL, "+
                    "floors INTEGER NOT NULL, " +
                    "FOREIGN KEY (community_id) REFERENCES community(id));");

            statement.execute("CREATE TABLE IF NOT EXISTS building_device ("+
                    "id INTEGER PRIMARY KEY AUTOINCREMENT, "+
                    "name VARCHAR NOT NULL, "+
                    "consumes_energy BOOLEAN NOT NULL, " + // Flag for consumption vs. production
                    "energy_class CHAR(1), " +
                    "building_id INTEGER NOT NULL, "+
                    "energy_curve BLOB, "+
                    "FOREIGN KEY (building_id) REFERENCES building(id));");

            statement.execute("CREATE TABLE IF NOT EXISTS apartment ("+
                    "id INTEGER PRIMARY KEY AUTOINCREMENT, "+
                    "residents INTEGER NOT NULL, "+
                    "square_footage FLOAT NOT NULL, "+
                    "energy_class CHAR(1), " +
                    "building_id INTEGER NOT NULL, "+
                    "user_id INTEGER,"+
                    "FOREIGN KEY (user_id) REFERENCES user(id), "+
                    "FOREIGN KEY (building_id) REFERENCES building(id));");

            statement.execute("CREATE TABLE IF NOT EXISTS apartment_device ("+
                    "id INTEGER PRIMARY KEY AUTOINCREMENT, "+
                    "name VARCHAR NOT NULL, "+
                    "consumes_energy BOOLEAN NOT NULL, " + // Flag for consumption vs. production
                    "energy_class CHAR(1), " +
                    "apartment_id INTEGER NOT NULL, "+
                    "energy_curve BLOB, "+
                    "FOREIGN KEY (apartment_id) REFERENCES apartment(id));");

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

    public CredentialsDAO getCredentialsDAO() {
        return new CredentialsDAO(getConnection());
    }

    public AdminDAO getAdminDAO() {
        return new AdminDAO(getConnection());
    }

    public UserDAO getUserDAO() {
        return new UserDAO(getConnection());
    }

    public CommunityDAO getCommunityDAO() {
        return new CommunityDAO(getConnection());
    }

    public BuildingDAO getBuildingDAO() {
        return new BuildingDAO(getConnection());
    }

    public BuildingDeviceDAO getBuildingDeviceDAO() {
        return new BuildingDeviceDAO(getConnection());
    }

    public ApartmentDAO getApartmentDAO() {
        return new ApartmentDAO(getConnection());
    }

    public ApartmentDeviceDAO getApartmentDeviceDAO() {
        return new ApartmentDeviceDAO(getConnection());
    }
}
