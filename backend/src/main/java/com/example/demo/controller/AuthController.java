package com.example.demo.controller;

import com.example.demo.model.Admin;
import com.example.demo.model.Credentials;
import com.example.demo.persistence.DBManager;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCrypt;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.Base64;

@RestController
@CrossOrigin(value = "http://localhost:4200", allowCredentials = "true")
public class AuthController {

    @PostMapping("/login")
    public ResponseEntity<AuthToken> login(@RequestBody Credentials creds, HttpServletRequest req) {
        Credentials storedCreds = DBManager.getInstance().getCredentialsDAO().findByPrimaryKey(creds.getEmail());

        if (storedCreds == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
        if (!checkPassword(creds.getPassword(), storedCreds)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }

        // Create a new session for the user
        HttpSession session = req.getSession();
        session.setAttribute("user", creds);

        AuthToken token;
        if (DBManager.getInstance().getCredentialsDAO().isAdmin(storedCreds)) {
            // Generate token for admin
            token = generateToken(creds, "A");
        } else {
            // Generate token for regular user
            token = generateToken(creds, "U");
        }

        return ResponseEntity.ok(token);
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(HttpServletRequest req) {
        HttpSession session = req.getSession(false);

        if (session != null) {
            session.invalidate();
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    private AuthToken generateToken(Credentials creds, String role){
        String token = encodeBase64(creds.getEmail() + ":tkn:" +  BCrypt.hashpw(creds.getPassword(), BCrypt.gensalt(10)) + ":tkn:" + role);
        AuthToken auth = new AuthToken();
        auth.setToken(token);
        auth.setRole(role);
        return auth;
    }

    private boolean checkPassword(String plainPW, Credentials storedCreds){
        return BCrypt.checkpw(plainPW, storedCreds.getPassword());
    }

    private String encodeBase64(String value){
        return Base64.getEncoder().encodeToString(value.getBytes());
    }
}
