package com.example.demo.utility;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.nio.charset.Charset;
import java.nio.charset.StandardCharsets;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

public class SQLiteBlobConverter {
    private static final ObjectMapper DEFAULT_MAPPER = createDefaultObjectMapper();
    private static final Charset DEFAULT_CHARSET = StandardCharsets.UTF_8;
    
    private final ObjectMapper objectMapper;
    private final Charset charset;

    private static ObjectMapper createDefaultObjectMapper() {
        return new ObjectMapper()
                .registerModule(new JavaTimeModule())
                .configure(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS, false);
    }

    public SQLiteBlobConverter() {
        this(DEFAULT_MAPPER, DEFAULT_CHARSET);
    }

    public SQLiteBlobConverter(Charset charset) {
        this(DEFAULT_MAPPER, charset);
    }

    public SQLiteBlobConverter(ObjectMapper objectMapper) {
        this(objectMapper, DEFAULT_CHARSET);
    }

    public SQLiteBlobConverter(ObjectMapper objectMapper, Charset charset) {
        this.objectMapper = objectMapper;
        this.charset = charset;
    }

    /**
     * Sets a BLOB parameter in a PreparedStatement for SQLite
     *
     * @param pstmt The PreparedStatement
     * @param parameterIndex The parameter index
     * @param data The object to convert to BLOB
     * @throws SQLException If there's an error setting the parameter
     * @throws JsonProcessingException If the object cannot be converted to JSON
     */
    public void setBlob(PreparedStatement pstmt, int parameterIndex, Object data) 
            throws SQLException, JsonProcessingException {
        byte[] bytes = toBytes(data);
        ByteArrayInputStream bais = new ByteArrayInputStream(bytes);
        pstmt.setBinaryStream(parameterIndex, bais, bytes.length);
    }

    /**
     * Gets a BLOB from a ResultSet and converts it to an object
     *
     * @param rs The ResultSet
     * @param columnIndex The column index
     * @param clazz The class to convert to
     * @return The converted object
     * @throws SQLException If there's an error reading the BLOB
     * @throws IOException If there's an error parsing the JSON
     */
    public <T> T getBlob(ResultSet rs, int columnIndex, Class<T> clazz) 
            throws SQLException, IOException {
        byte[] bytes = rs.getBytes(columnIndex);
        if (bytes == null) {
            return null;
        }
        return fromBytes(bytes, clazz);
    }

    /**
     * Gets a BLOB from a ResultSet and converts it to an object
     *
     * @param rs The ResultSet
     * @param columnLabel The column label
     * @param clazz The class to convert to
     * @return The converted object
     * @throws SQLException If there's an error reading the BLOB
     * @throws IOException If there's an error parsing the JSON
     */
    public <T> T getBlob(ResultSet rs, String columnLabel, Class<T> clazz) 
            throws SQLException, IOException {
        byte[] bytes = rs.getBytes(columnLabel);
        if (bytes == null) {
            return null;
        }
        return fromBytes(bytes, clazz);
    }

    public byte[] toBytes(Object data) throws JsonProcessingException {
        String jsonString = objectMapper.writeValueAsString(data);
        return jsonString.getBytes(charset);
    }

    public <T> T fromBytes(byte[] bytes, Class<T> clazz) throws IOException {
        String jsonString = new String(bytes, charset);
        return objectMapper.readValue(jsonString, clazz);
    }
}