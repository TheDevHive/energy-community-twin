package com.example.demo.controller.Auth;

import com.example.demo.model.Admin;
import com.example.demo.model.Credentials;
import com.example.demo.persistence.DBManager;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCrypt;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
@RequestMapping("/admin")
public class AdminController {

    @PostMapping("/register")
    public ResponseEntity<Boolean> registerAdmin(@RequestBody Credentials creds) {
        // Encrypt the password before saving it
        creds.setPassword(BCrypt.hashpw(creds.getPassword(), BCrypt.gensalt(10)));
        Admin admin = new Admin(creds);
        if (DBManager.getInstance().getAdminDAO().registerAdmin(admin)) {
            return ResponseEntity.ok(true);
        } else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(false);
        }
    }
}