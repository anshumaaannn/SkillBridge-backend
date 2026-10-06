package com.example.demo.dto;

public class UpdateProjectRequest {
    private String title;
    private String description;
    private Double budget;
    private String status;

    public UpdateProjectRequest() {
    }

    public UpdateProjectRequest(String title, String description, Double budget, String status) {
        this.title = title;
        this.description = description;
        this.budget = budget;
        this.status = status;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Double getBudget() {
        return budget;
    }

    public void setBudget(Double budget) {
        this.budget = budget;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
