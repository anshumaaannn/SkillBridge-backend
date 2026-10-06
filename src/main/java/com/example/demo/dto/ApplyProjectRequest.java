package com.example.demo.dto;

public class ApplyProjectRequest {
    private String message;

    public ApplyProjectRequest() {
    }

    public ApplyProjectRequest(String message) {
        this.message = message;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
