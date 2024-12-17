package com.example.demo.persistence.DAO;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import com.example.demo.model.WeatherData;
import com.example.demo.model.generation.TimeRange;

public class TS_WeatherDAO {

    Connection connection;
    
    public TS_WeatherDAO(Connection connection) {
        this.connection = connection;
    }

    public WeatherData findByPrimaryKey(LocalDateTime date) {
        String sql = "SELECT * FROM weather_data WHERE date = ?";
        try (PreparedStatement pstmt = connection.prepareStatement(sql)) {
            pstmt.setTimestamp(1,  Timestamp.valueOf(date));
            ResultSet rs = pstmt.executeQuery();
            if (rs.next()) {
                return new WeatherData(
                        rs.getTimestamp("date").toLocalDateTime(),
                        rs.getFloat("temperature"),
                        rs.getFloat("precipitation"),
                        rs.getFloat("cloud_cover"),
                        rs.getFloat("wind_speed")
                );
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return null;
    }

    public boolean saveOrUpdate(WeatherData weatherData){
        try{
            if(findByPrimaryKey(weatherData.getDate()) == null){
                String sql = "INSERT INTO weather_data (date, temperature, precipitation, cloud_cover, wind_speed) VALUES (?, ?, ?, ?, ?)";
                PreparedStatement pstmt = connection.prepareStatement(sql);
                pstmt.setTimestamp(1, Timestamp.valueOf(weatherData.getDate()));
                pstmt.setFloat(2, weatherData.getTemperature());
                pstmt.setFloat(3, weatherData.getPrecipitation());
                pstmt.setFloat(4, weatherData.getCloudCover());
                pstmt.setFloat(5, weatherData.getWindSpeed());
                pstmt.executeUpdate();
                return true;
            } else {
                String sql = "UPDATE weather_data SET temperature = ?, precipitation = ?, cloud_cover = ?, wind_speed = ? WHERE date = ?";
                PreparedStatement pstmt = connection.prepareStatement(sql);
                pstmt.setFloat(1, weatherData.getTemperature());
                pstmt.setFloat(2, weatherData.getPrecipitation());
                pstmt.setFloat(3, weatherData.getCloudCover());
                pstmt.setFloat(4, weatherData.getWindSpeed());
                pstmt.setTimestamp(5, Timestamp.valueOf(weatherData.getDate()));
                pstmt.executeUpdate();
                return true;
            }
        } catch (SQLException e){
            e.printStackTrace();
            return false;
        }
    }

    public List<WeatherData> findByInterval(LocalDateTime dateStart, LocalDateTime dateEnd) {
        List<WeatherData> weatherDataList = new ArrayList<>();
        for (LocalDateTime date = dateStart; date.isBefore(dateEnd); date = date.plusHours(1)) {
            WeatherData weatherData = findByPrimaryKey(date);
            if (weatherData != null) {
                weatherDataList.add(weatherData);
            } else {
                weatherDataList.add(null);
            }
        }
        return weatherDataList;
    }

    public List<TimeRange> findGaps(LocalDateTime dateStart, LocalDateTime dateEnd) {
        List<TimeRange> gaps = new ArrayList<>();
        LocalDateTime date = dateStart;
        while (date.isBefore(dateEnd)) {
            WeatherData weatherData = findByPrimaryKey(date);
            if (weatherData == null) {
                LocalDateTime start = date;
                while (date.isBefore(dateEnd) && findByPrimaryKey(date) == null) {
                    date = date.plusHours(1);
                }
                gaps.add(new TimeRange(start, date));
            } else {
                date = date.plusHours(1);
            }
        }
        return gaps;
    }

}
