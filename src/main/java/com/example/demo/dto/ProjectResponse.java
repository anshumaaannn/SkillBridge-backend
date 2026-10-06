package com.example.demo.dto;

import java.time.LocalDateTime;

public class ProjectResponse {
    private Long id;
    private String title;
    private String description;
    private Double budget;
    private String status;
    private Long ownerId;
    private String ownerName;
    private LocalDateTime createdAt;

    public ProjectResponse() {
    }

    public ProjectResponse(Long id, String title, String description, Double budget, String status, Long ownerId, String ownerName, LocalDateTime createdAt) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.budget = budget;
        this.status = status;
        this.ownerId = ownerId;
        this.ownerName = ownerName;
        this.createdAt = createdAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public Long getOwnerId() {
        return ownerId;
    }

    public void setOwnerId(Long ownerId) {
        this.ownerId = ownerId;
    }

    public String getOwnerName() {
        return ownerName;
    }

    public void setOwnerName(String ownerName) {
        this.ownerName = ownerName;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
