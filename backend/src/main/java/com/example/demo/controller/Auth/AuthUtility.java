package com.example.demo.controller.Auth;

import com.example.demo.model.Credentials;
import com.example.demo.persistence.DBManager;
import jakarta.servlet.http.HttpServletRequest;

import java.util.Base64;

public class AuthUtility {
    public static Credentials getRequestCredential(HttpServletRequest req){
        return DBManager.getInstance().getCredentialsDAO().findByToken(getToken(req));
    }

    private static String getToken(HttpServletRequest req){
        String auth = req.getHeader("Authorization");
        if (auth == null) return "";
        return auth.substring("Basic ".length());
    }

    public static String getTokenEmail(String token){
        return decodeBase64(token).split(":tkn:")[0];
    }

    private static String decodeBase64(String value){
        return new String(Base64.getDecoder().decode(value.getBytes()));
    }

    public static Boolean isAdmin(String token) {
        return getTokenRole(token).equals("A");
    }

    private static String getTokenRole(String token){
        return decodeBase64(token).split(":tkn:")[2];
    }
}
