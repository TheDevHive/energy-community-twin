package com.example.demo.model;

public class Admin {
    private int id;
    private Credentials credentials;

    public Admin(int id, Credentials credentials) {
        this.id = id;
        this.credentials = credentials;
    }

    public Admin(Credentials credentials) {
        this.credentials = credentials;
    }

    public int getId() {
        return id;
    }

    public Credentials getCredentials() {
        return credentials;
    }

    public String toString() {
        return "Admin{" +
                "id=" + id +
                ", credentials=" + credentials +
                '}';
    }

    public void setId(int id) {
        this.id = id;
    }

    public void setCredentials(Credentials credentials) {
        this.credentials = credentials;
    }

    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Admin admin = (Admin) o;
        if (id != admin.id) return false;
        return true;
    }
}
