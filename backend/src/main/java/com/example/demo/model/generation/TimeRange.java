package com.example.demo.model.generation;

public class TimeRange {
    private String start;
    private String end;

    public TimeRange(String start, String end) {
        this.start = start;
        this.end = end;
    }

    public String getStart() {
        return start;
    }

    public String getEnd() {
        return end;
    }

    public boolean validate() {
        return CalculateDate.validate(start) && CalculateDate.validate(end);
    }
}
