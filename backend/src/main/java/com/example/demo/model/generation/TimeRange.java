package com.example.demo.model.generation;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonFormat;

public class TimeRange {

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", timezone = "UTC")
    private LocalDateTime start;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", timezone = "UTC")
    private LocalDateTime end;

    public TimeRange(LocalDateTime start, LocalDateTime end) {
        this.start = start;
        this.end = end;
    }

    public LocalDateTime getStart() {
        return start.withHour(0).withMinute(0).withSecond(0).withNano(0);
    }

    public LocalDateTime getEnd() {
        return end;
    }
}