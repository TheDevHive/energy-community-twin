package com.example.demo.mail;

import com.example.demo.utility.Pair;

import java.util.HashMap;
import java.util.Map;
import java.util.Properties;
import javax.mail.*;
import javax.mail.internet.*;

public class MailManager
{
    private static MailManager instance = new MailManager();
    private Properties properties;
    private Session session;
    private Map<String, Pair<Integer, Integer>> authCodes;
    private final int MAX_TRIES = 3;

    private MailManager()
    {
        init();
    }

    public static MailManager getInstance()
    {
        return instance;
    }

    private void init()
    {
        this.authCodes = new HashMap<>();
        properties = System.getProperties();
        properties.setProperty("mail.smtp.host", MailSettings.server);
        properties.put("mail.smtp.auth", "true");
        properties.put("mail.smtp.starttls.enable", "true");
        properties.put("mail.smtp.port", "587");

        session = Session.getDefaultInstance(properties, new Authenticator() {
            @Override
            protected PasswordAuthentication getPasswordAuthentication() {
                return new PasswordAuthentication(MailSettings.mail, MailSettings.password);
            }
        });
    }

    public boolean send(String dest, String text)
    {
        try {
            MimeMessage message = new MimeMessage(session);
            message.setFrom(new InternetAddress(MailSettings.mail));
            message.addRecipient(Message.RecipientType.TO, new InternetAddress(dest));
            message.setSubject("The DevHive");
            message.setContent(text, "text/html");
            Transport.send(message);
        } catch (MessagingException e) {
            System.out.println("ERROR SENDING THE EMAIL.");
            e.printStackTrace();
            return false;
        }
        return true;
    }


    public boolean setAuthCode(String userMail)
    {
        int authCode = 10000 + (int)(Math.random() * 90000);
        Pair<Integer, Integer> authPair = new Pair<>(authCode, MAX_TRIES);
        authCodes.put(userMail, authPair);
        String messageText = String.format(
                "<html>" +
                        "<body>" +
                        "<p>Dear User,</p>" +
                        "<p>Your verification code is: <b>%d</b></p>" +
                        "<p>Please use this code to complete your authentication process. The code will expire after %d attempts.</p>" +
                        "<p>Thank you.</p>" +
                        "</body>" +
                        "</html>",
                authCode, MAX_TRIES
        );
        return send(userMail, messageText);
    }

    public String tryAuthCode(String userMail, int authCode)
    {
        if (!authCodes.containsKey(userMail))
            return "not_requested";

        Pair<Integer, Integer> authPair = authCodes.get(userMail);
        if (authPair.first != authCode)
        {
            if (authPair.second == 1) {
                authCodes.remove(userMail);
                return "removed";
            }
            else {
                authCodes.put(userMail, new Pair<>(authPair.first, authPair.second - 1));
                return "wrong";
            }
        }
        authCodes.remove(userMail);
        return "correct";
    }

    public void close()
    {
        if (session != null)
        {
            session.getProperties().clear();
            session = null;
        }
    }

    public Map<String, Pair<Integer, Integer>> getAuthCodes()
    {
        return this.authCodes;
    }

    public Session getSession()
    {
        return session;
    }
}
