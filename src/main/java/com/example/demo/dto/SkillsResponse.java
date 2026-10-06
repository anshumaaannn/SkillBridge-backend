package com.example.demo.dto;

import java.util.List;

public class SkillsResponse {

    private List<SkillResponse> skills;

    public List<SkillResponse> getSkills() {
        return skills;
    }
    public SkillsResponse(List<SkillResponse> skills) {
        this.skills = skills;
    }
}
