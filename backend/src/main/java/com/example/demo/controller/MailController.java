package com.example.demo.controller;

import com.example.demo.mail.MailManager;
import com.example.demo.persistence.DAO.AdminDAO;
import com.example.demo.persistence.DBManager;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
@RequestMapping("/api/auth")
public class MailController
{
    @PostMapping
    public ResponseEntity<Boolean> requestAuthCode(@RequestBody String mail)
    {
        if (mail == null)
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);

        AdminDAO adminDAO = DBManager.getInstance().getAdminDAO();
        if (adminDAO.findByEmail(mail) != null)
            return new ResponseEntity<>(HttpStatus.CONFLICT);

        boolean status = MailManager.getInstance().setAuthCode(mail);
        return new ResponseEntity<>(status, (status? HttpStatus.OK : HttpStatus.INTERNAL_SERVER_ERROR));
    }

    @PostMapping("/try/{authCode}")
    public ResponseEntity<String> tryAuthCode(@RequestBody String mail, @PathVariable Integer authCode)
    {
        if (authCode == null || mail == null)
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);

        AdminDAO adminDAO = DBManager.getInstance().getAdminDAO();
        if (adminDAO.findByEmail(mail) != null)
            return new ResponseEntity<>(HttpStatus.CONFLICT);

        String outcome = MailManager.getInstance().tryAuthCode(mail, authCode);
        return new ResponseEntity<>(outcome, HttpStatus.OK);
    }
}
