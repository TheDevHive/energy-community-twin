package com.example.demo.controller.Auth;

import com.example.demo.model.Admin;
import com.example.demo.model.Credentials;
import com.example.demo.persistence.DAO.AdminDAO;
import com.example.demo.persistence.DAO.CredentialsDAO;
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

    @PostMapping("/changePass")
    public ResponseEntity<Boolean> changePassword(@RequestBody Credentials creds)
    {
        if (creds.getEmail() == null || creds.getEmail().isEmpty() ||
                creds.getPassword() == null || creds.getPassword().isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(false);
        }
        creds.setPassword(BCrypt.hashpw(creds.getPassword(), BCrypt.gensalt(10)));
        AdminDAO adminDAO = DBManager.getInstance().getAdminDAO();
        Admin admin = adminDAO.findByEmail(creds.getEmail());
        if (admin == null)
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(false);

        CredentialsDAO credentialsDAO = DBManager.getInstance().getCredentialsDAO();
        credentialsDAO.saveOrUpdate(creds);
        admin.setCredentials(creds);
        boolean status = adminDAO.saveOrUpdate(admin);
        return ResponseEntity.ok(status);
    }
}