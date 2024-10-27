package com.example.demo.controller;

import com.example.demo.model.Admin;
import com.example.demo.model.Credentials;
import com.example.demo.persistence.DBManager;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCrypt;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/admin")
public class AdminController {

    @PostMapping("/register")
    public ResponseEntity<String> registerAdmin(@RequestBody Credentials creds) {
        // Encrypt the password before saving it
        creds.setPassword(BCrypt.hashpw(creds.getPassword(), BCrypt.gensalt(10)));
        Admin admin = new Admin(creds);
        if (DBManager.getInstance().getAdminDAO().registerAdmin(admin)) {
            return ResponseEntity.ok("Admin registered successfully");
        } else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error registering admin");
        }
    }
}