package com.example.demo.dto;

public class ProfileResponse {
    private Long id;
    private Long userId;
    private String name;
    private String title;
    private String bio;
    private String location;
    private String profileImageUrl;
    private String githubUrl;
    private String linkedinUrl;

    public ProfileResponse() {
    }

    public ProfileResponse(Long id, Long userId, String name, String title, String bio, String location, String profileImageUrl, String githubUrl, String linkedinUrl) {
        this.id = id;
        this.userId = userId;
        this.name = name;
        this.title = title;
        this.bio = bio;
        this.location = location;
        this.profileImageUrl = profileImageUrl;
        this.githubUrl = githubUrl;
        this.linkedinUrl = linkedinUrl;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getBio() {
        return bio;
    }

    public void setBio(String bio) {
        this.bio = bio;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getProfileImageUrl() {
        return profileImageUrl;
    }

    public void setProfileImageUrl(String profileImageUrl) {
        this.profileImageUrl = profileImageUrl;
    }

    public String getGithubUrl() {
        return githubUrl;
    }

    public void setGithubUrl(String githubUrl) {
        this.githubUrl = githubUrl;
    }

    public String getLinkedinUrl() {
        return linkedinUrl;
    }

    public void setLinkedinUrl(String linkedinUrl) {
        this.linkedinUrl = linkedinUrl;
    }
}
