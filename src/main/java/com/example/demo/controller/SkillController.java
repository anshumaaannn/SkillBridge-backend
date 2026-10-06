package com.example.demo.controller;

import com.example.demo.dto.AddSkillRequest;
import com.example.demo.dto.SkillResponse;
import com.example.demo.dto.SkillsResponse;
import com.example.demo.service.SkillService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class SkillController {

    private final SkillService skillService;

    public SkillController(SkillService skillService) {
        this.skillService = skillService;
    }

    @PostMapping("/users/me/skills")
    public SkillsResponse addSkill(@RequestBody AddSkillRequest addSkillRequest) {
        return skillService.addSkill(addSkillRequest.getSkillId());
    }

    @GetMapping("/users/me/skills")
    public SkillsResponse getSkills() {
        return skillService.getSkills();
    }

    @DeleteMapping("/users/me/skills/{skillId}")
    public SkillsResponse deleteSkill(@PathVariable("skillId") Long skillId) {
        return skillService.deleteSkill(skillId);
    }

    @GetMapping("/skills")
    public List<SkillResponse> getAllSkills() {
        return skillService.getAllSkills();
    }
}
