package com.example.demo.model;

public class Community {
    private int id;
    private String name;
    private Admin admin;

    public Community(int id, String name, Admin admin) {
        this.id = id;
        this.name = name;
        this.admin = admin;
    }

    public int getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public Admin getAdmin() {
        return admin;
    }

    public String toString() {
        return "Comunity{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", admin=" + admin +
                '}';
    }

    public void setId(int id) {
        this.id = id;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setAdmin(Admin admin) {
        this.admin = admin;
    }

    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Community community = (Community) o;
        if (id != community.id) return false;
        return true;
    }
}

