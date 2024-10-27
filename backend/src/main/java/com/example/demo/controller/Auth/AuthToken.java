package com.example.demo.controller.Auth;

public class AuthToken {

    String token;

    // Used to distinguish between "admin" and "user"
    String role;

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }
}
