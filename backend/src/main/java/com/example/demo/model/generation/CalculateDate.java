package com.example.demo.model.generation;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.time.temporal.ChronoUnit;

public class CalculateDate {

    public static int dateDifference(String dateEnd, String dateStart) {
        try {
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
            LocalDate firstDate = LocalDate.parse(dateEnd, formatter);
            LocalDate secondDate = LocalDate.parse(dateStart, formatter);
            
            Long result = Math.abs(ChronoUnit.DAYS.between(firstDate, secondDate));

            // Calculate absolute difference in days
            return result == null ? null : result.intValue();
        } catch (DateTimeParseException e) {
            throw new DateTimeParseException(
                "Dates must be in yyyy-MM-dd format. Example: 2024-03-14", 
                e.getParsedString(), 
                e.getErrorIndex()
            );
        }
    }

    public static String dateAdd(String dateStart, int days) {
        try {
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
            LocalDate date = LocalDate.parse(dateStart, formatter);
            LocalDate resultDate = date.plusDays(days);
            return resultDate.format(formatter);
        } catch (DateTimeParseException e) {
            throw new DateTimeParseException(
                "Date must be in yyyy-MM-dd format. Example: 2024-03-14",
                e.getParsedString(),
                e.getErrorIndex()
            );
        }
    }
    
}
