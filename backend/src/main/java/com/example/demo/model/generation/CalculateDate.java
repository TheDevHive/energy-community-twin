package com.example.demo.model.generation;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.time.temporal.ChronoUnit;

public final class CalculateDate {

    public static int dateDifferenceHours(LocalDateTime dateEnd, LocalDateTime dateStart) {
        return (int) ChronoUnit.HOURS.between(dateStart, dateEnd);
    }

    public static LocalDateTime parseDateTime(String date, boolean isStart) {
        try {
            // Try to parse date as LocalDateTime
            return LocalDateTime.parse(date, DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
        } catch (DateTimeParseException e) {
            // If parsing fails, try to parse date as LocalDate
            LocalDate localDate = LocalDate.parse(date);
            return isStart ? localDate.atTime(0, 0, 0) : localDate.atTime(23, 59, 59);
        }
    }

    public static LocalDateTime hoursAdd(LocalDateTime date, int hours) {
        return date.plusHours(hours);
    }

    public static boolean validate(String date) {
        try {
            LocalDateTime.parse(date, DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
            return true;
        } catch (DateTimeParseException e) {
            try {
                LocalDate.parse(date);
                return true;
            } catch (DateTimeParseException e2) {
                return false;
            }
        }
    }

}
