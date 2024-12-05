package com.example.demo.model.generation;

import com.example.demo.model.WeatherData;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.IOException;
import java.net.HttpURLConnection;
import java.net.URL;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;

public class GenerateWeatherData {

    /**
     * Fetch weather data from the Open-Meteo API.
     *
     * @param startDate   The start date of the weather data.
     * @param endDate     The end date of the weather data.
     * @param baseApiURL  The base URL of the Open-Meteo API. --> https://api.open-meteo.com/v1/forecast
     * @return A list of weather data.
     * @throws IOException If an error occurs while fetching the data.
     */
    public static List<WeatherData> fetchWeatherData(String startDate, String endDate, String baseApiURL) throws IOException {
        // The latitude and longitude are for the city of Rende, Italy
        // https://api.open-meteo.com/v1/forecast
        String apiUrl = String.format(
                baseApiURL + "?latitude=39.3315&longitude=16.1804&hourly=temperature_2m,precipitation,cloud_cover,wind_speed_10m&timezone=Europe%%2FBerlin&start_date=%s&end_date=%s",
                startDate, endDate
        );

        // Open connection
        HttpURLConnection connection = (HttpURLConnection) new URL(apiUrl).openConnection();
        connection.setRequestMethod("GET");

        // Read response
        StringBuilder jsonResponse = new StringBuilder();
        try (Scanner scanner = new Scanner(connection.getInputStream())) {
            while (scanner.hasNext()) {
                jsonResponse.append(scanner.nextLine());
            }
        }

        // Parse JSON
        ObjectMapper objectMapper = new ObjectMapper();
        JsonNode root = objectMapper.readTree(jsonResponse.toString());
        JsonNode hourlyData = root.path("hourly");

        // Extract data
        List<WeatherData> weatherDataList = new ArrayList<>();
        JsonNode times = hourlyData.path("time");
        JsonNode temperatures = hourlyData.path("temperature_2m");
        JsonNode precipitations = hourlyData.path("precipitation");
        JsonNode cloudCovers = hourlyData.path("cloud_cover");
        JsonNode windSpeeds = hourlyData.path("wind_speed_10m");

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm");

        for (int i = 0; i < times.size(); i++) {
            WeatherData data = new WeatherData();
            data.setDate(LocalDateTime.parse(times.get(i).asText(), formatter));
            data.setTemperature(temperatures.get(i).floatValue());
            data.setPrecipitation(precipitations.get(i).floatValue());
            data.setCloudCover(cloudCovers.get(i).floatValue());
            data.setWindSpeed(windSpeeds.get(i).doubleValue());

            weatherDataList.add(data);
        }

        return weatherDataList;
    }
}

