package com.example.demo.mail;

public class MailSettings
{
    public static final String mail = System.getenv("MAIL_ADDR");
    public static final String password = System.getenv("MAIL_PASSWD");
    public static final String server = "smtp.gmail.com";
}
