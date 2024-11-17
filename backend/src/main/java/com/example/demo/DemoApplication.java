package com.example.demo;

import com.example.demo.persistence.DBManager;
import com.example.demo.persistence.TS_DBManager;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;


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
        if(TS_DBManager.getInstance().checkAndCreateDatabase()){
            System.out.println("Time Series Database created successfully");
        }
        else {
            System.out.println("Time Series Database already exists");
        }
    }

}
