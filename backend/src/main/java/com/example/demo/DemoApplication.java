package com.example.demo;

import com.example.demo.model.*;
import com.example.demo.persistence.DBManager;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.sqlite.core.DB;

import java.sql.Date;


@SpringBootApplication
public class DemoApplication {

    public static void main(String[] args) {
        // Run the Spring Boot application
        SpringApplication.run(DemoApplication.class, args);
        if(DBManager.getInstance().checkAndCreateDatabase()) {
            System.out.println("Database created successfully");
        }
        else {
            System.out.println("Database already exists");
        }
    }

}
