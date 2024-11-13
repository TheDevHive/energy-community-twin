package com.example.demo.utility;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;

import java.io.IOException;
import java.nio.charset.Charset;
import java.nio.charset.StandardCharsets;
import java.sql.Blob;
import java.sql.Connection;
import java.sql.SQLException;

public class JSONBlobConverter {
    private static final ObjectMapper DEFAULT_MAPPER = createDefaultObjectMapper();
    private static final Charset DEFAULT_CHARSET = StandardCharsets.UTF_8;
    
    private ObjectMapper objectMapper;
    private Charset charset;

    /**
     * Creates and configures the default ObjectMapper instance
     *
     * @return Configured ObjectMapper instance
     */
    private static ObjectMapper createDefaultObjectMapper() {
        return new ObjectMapper()
                .registerModule(new JavaTimeModule())
                .configure(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS, false);
    }

    /**
     * Constructor with default UTF-8 encoding and default ObjectMapper
     */
    public JSONBlobConverter() {
        this(DEFAULT_MAPPER, DEFAULT_CHARSET);
    }

    /**
     * Constructor with custom charset and default ObjectMapper
     *
     * @param charset The character encoding to use
     */
    public JSONBlobConverter(Charset charset) {
        this(DEFAULT_MAPPER, charset);
    }

    /**
     * Constructor with custom ObjectMapper and default charset
     *
     * @param objectMapper The ObjectMapper to use
     */
    public JSONBlobConverter(ObjectMapper objectMapper) {
        this(objectMapper, DEFAULT_CHARSET);
    }

    /**
     * Constructor with custom ObjectMapper and charset
     *
     * @param objectMapper The ObjectMapper to use
     * @param charset The character encoding to use
     */
    public JSONBlobConverter(ObjectMapper objectMapper, Charset charset) {
        this.objectMapper = objectMapper;
        this.charset = charset;
    }

    /**
     * Converts a Java object to a JDBC Blob
     *
     * @param connection Database connection to create the Blob
     * @param data      Object to convert
     * @return SQL Blob containing the JSON data
     * @throws SQLException           If there's an error creating the Blob
     * @throws JsonProcessingException If the object cannot be converted to JSON
     */
    public Blob toBlob(Connection connection, Object data) throws SQLException, JsonProcessingException {
        byte[] jsonBytes = toBytes(data);
        Blob blob = connection.createBlob();
        blob.setBytes(1, jsonBytes);
        return blob;
    }

    /**
     * Converts a Java object to a byte array
     *
     * @param data Object to convert
     * @return byte array containing the JSON data
     * @throws JsonProcessingException If the object cannot be converted to JSON
     */
    public byte[] toBytes(Object data) throws JsonProcessingException {
        String jsonString = objectMapper.writeValueAsString(data);
        return jsonString.getBytes(charset);
    }

    /**
     * Converts a JDBC Blob to a Java object
     *
     * @param blob  The Blob to convert
     * @param clazz The class of the target object
     * @param <T>   The type of the target object
     * @return The converted object
     * @throws SQLException If there's an error reading the Blob
     * @throws IOException  If there's an error parsing the JSON
     */
    public <T> T fromBlob(Blob blob, Class<T> clazz) throws SQLException, IOException {
        byte[] bytes = blob.getBytes(1, (int) blob.length());
        return fromBytes(bytes, clazz);
    }

    /**
     * Converts a byte array to a Java object
     *
     * @param bytes The byte array to convert
     * @param clazz The class of the target object
     * @param <T>   The type of the target object
     * @return The converted object
     * @throws IOException If there's an error parsing the JSON
     */
    public <T> T fromBytes(byte[] bytes, Class<T> clazz) throws IOException {
        String jsonString = new String(bytes, charset);
        return objectMapper.readValue(jsonString, clazz);
    }
}