package com.example.demo;

import com.example.demo.model.WeatherData;
import com.example.demo.model.generation.GenerateWeatherData;
import com.fasterxml.jackson.databind.ObjectMapper;
import okhttp3.mockwebserver.MockResponse;
import okhttp3.mockwebserver.MockWebServer;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import java.io.IOException;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class GenerateWeatherDataTest
{
    private static MockWebServer mockWebServer;
    private static final ObjectMapper objectMapper = new ObjectMapper();

    @BeforeAll
    static void setUp() throws IOException {
        mockWebServer = new MockWebServer();
        mockWebServer.start();
    }

    @AfterAll
    static void tearDown() throws IOException {
        mockWebServer.shutdown();
    }

    @Test
    void testFetchWeatherDataSuccess() throws Exception {
        // Given a well-formed JSON response
        String jsonResponse = """
        {
          "hourly": {
            "time": ["2024-12-05T10:00", "2024-12-05T11:00"],
            "temperature_2m": [10.5, 11.0],
            "precipitation": [0.0, 0.1],
            "cloud_cover": [20, 30],
            "wind_speed_10m": [3.5, 4.0]
          }
        }
        """;

        mockWebServer.enqueue(new MockResponse().setBody(jsonResponse).setResponseCode(200));

        String startDate = "2024-12-05";
        String endDate = "2024-12-06";
        String apiUrl = String.format("http://localhost:%s?start_date=%s&end_date=%s",
                mockWebServer.getPort(), startDate, endDate);

        List<WeatherData> result = GenerateWeatherData.fetchWeatherData(startDate, endDate, apiUrl);

        assertNotNull(result);
        assertEquals(2, result.size());

        WeatherData firstHour = result.get(0);
        assertEquals(10.5f, firstHour.getTemperature(), 0.001);
        assertEquals(0.0f, firstHour.getPrecipitation(), 0.001);
        assertEquals(20.0f, firstHour.getCloudCover(), 0.001);
        assertEquals(3.5, firstHour.getWindSpeed(), 0.001);
        assertEquals("2024-12-05T10:00", firstHour.getDate().toString().replace(' ', 'T'));

        WeatherData secondHour = result.get(1);
        assertEquals(11.0f, secondHour.getTemperature(), 0.001);
        assertEquals(0.1f, secondHour.getPrecipitation(), 0.001);
        assertEquals(30.0f, secondHour.getCloudCover(), 0.001);
        assertEquals(4.0, secondHour.getWindSpeed(), 0.001);
    }

    @Test
    void testFetchWeatherDataNoData() throws Exception {

        String jsonResponse = """
        {
          "hourly": {
            "time": [],
            "temperature_2m": [],
            "precipitation": [],
            "cloud_cover": [],
            "wind_speed_10m": []
          }
        }
        """;

        mockWebServer.enqueue(new MockResponse().setBody(jsonResponse).setResponseCode(200));

        String startDate = "2024-12-05";
        String endDate = "2024-12-06";
        String apiUrl = String.format("http://localhost:%s?start_date=%s&end_date=%s",
                mockWebServer.getPort(), startDate, endDate);

        List<WeatherData> result = GenerateWeatherData.fetchWeatherData(startDate, endDate, apiUrl);

        assertNotNull(result);
        assertTrue(result.isEmpty(), "Expected no weather data");
    }

    @Test
    void testFetchWeatherDataErrorResponse() throws Exception {

        mockWebServer.enqueue(new MockResponse().setResponseCode(500).setBody("Internal Server Error"));

        String startDate = "2024-12-05";
        String endDate = "2024-12-06";
        String apiUrl = String.format("http://localhost:%s?start_date=%s&end_date=%s",
                mockWebServer.getPort(), startDate, endDate);


        assertThrows(IOException.class, () -> GenerateWeatherData.fetchWeatherData(startDate, endDate, apiUrl));
    }

    @Test
    void testFetchWeatherDataIncompleteData() throws Exception {
        String jsonResponse = """
        {
          "hourly": {
            "time": ["2024-12-05T10:00"],
            "temperature_2m": [10.5],
            "precipitation": [0.0],
            "cloud_cover": [20]
            // wind_speed_10m is missing
          }
        }
        """;

        mockWebServer.enqueue(new MockResponse().setBody(jsonResponse).setResponseCode(200));

        String startDate = "2024-12-05";
        String endDate = "2024-12-06";
        String apiUrl = String.format("http://localhost:%s?start_date=%s&end_date=%s",
                mockWebServer.getPort(), startDate, endDate);

        assertThrows(Exception.class, () -> GenerateWeatherData.fetchWeatherData(startDate, endDate, apiUrl));
    }
}
