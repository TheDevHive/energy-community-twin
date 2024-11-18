package com.example.demo.model.generation;

import java.util.Random;

import com.example.demo.model.EnergyCurve;

public class GenerateData {

    public static double generate(String date, int hour, EnergyCurve energyCurve) {
        if (date == null || date.isEmpty()) {
            throw new IllegalArgumentException("String is empty");
        }
        if (hour < 0 || hour > 23) {
            throw new IllegalArgumentException("Hour must be between 0 and 23");
        }
        if (energyCurve == null) {
            throw new IllegalArgumentException("EnergyCurve is null");
        }
        if (!energyCurve.validate()) {
            throw new IllegalArgumentException("EnergyCurve is not valid");
        }
        Random random = new Random();
        return random.nextGaussian(energyCurve.getEnergyCurve().get(hour), energyCurve.getEnergyCurve().stream().mapToDouble(Integer::doubleValue).average().getAsDouble() * 0.1);
    }
    
}
