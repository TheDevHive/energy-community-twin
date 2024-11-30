package com.example.demo.model;

import java.sql.Date;

public class User extends Credentials {
    private int id;
    private String name;
    private String surname;
    private Date birth_date;
    private String phone;
    private Credentials credentials;

    public User(){}

    public User(int id, String name, String surname, Credentials credentials, Date birth_date, String phone) {
        this.id = id;
        this.name = name;
        this.credentials = credentials;
        this.surname = surname;
        this.birth_date = birth_date;
        this.phone = phone;
    }

    public int getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getSurname() {
        return surname;
    }

    public Date getBirthDate() {
        return birth_date;
    }

    public String getPhone() {
        return phone;
    }

    public Credentials getCredentials() {
        return credentials;
    }

    public String toString() {
        return "User{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", surname='" + surname + '\'' +
                ", birth_date=" + birth_date +
                ", phone='" + phone + '\'' +
                ", credentials=" + credentials +
                '}';
    }

    public void setId(int id) {
        this.id = id;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setSurname(String surname) {
        this.surname = surname;
    }

    public void setBirthDate(Date birth_date) {
        this.birth_date = birth_date;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public void setCredentials(Credentials credentials) {
        this.credentials = credentials;
    }

    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        User user = (User) o;
        return id == user.id;
    }
}

