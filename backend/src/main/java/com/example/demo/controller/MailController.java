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
    @PostMapping("/{isRegister}")
    public ResponseEntity<Boolean> requestAuthCode(@RequestBody String mail, @PathVariable boolean isRegister)
    {
        if (mail == null)
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);

        AdminDAO adminDAO = DBManager.getInstance().getAdminDAO();
        if (adminDAO.findByEmail(mail) != null && isRegister)
            return new ResponseEntity<>(HttpStatus.CONFLICT);
        else if (adminDAO.findByEmail(mail) == null && !isRegister)
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);

        boolean status = MailManager.getInstance().setAuthCode(mail);
        return new ResponseEntity<>(status, (status? HttpStatus.OK : HttpStatus.INTERNAL_SERVER_ERROR));
    }

    @PostMapping("/try/{authCode}/{isRegister}")
    public ResponseEntity<String> tryAuthCode(@RequestBody String mail, @PathVariable Integer authCode, @PathVariable boolean isRegister)
    {
        if (authCode == null || mail == null)
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);

        AdminDAO adminDAO = DBManager.getInstance().getAdminDAO();
        if (adminDAO.findByEmail(mail) != null && isRegister)
            return new ResponseEntity<>(HttpStatus.CONFLICT);
        else if (adminDAO.findByEmail(mail) == null && !isRegister)
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);

        String outcome = MailManager.getInstance().tryAuthCode(mail, authCode);
        return new ResponseEntity<>(outcome, HttpStatus.OK);
    }
}
