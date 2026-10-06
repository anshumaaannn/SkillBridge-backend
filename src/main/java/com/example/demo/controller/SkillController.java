package com.example.demo.controller;

import com.example.demo.dto.AddSkillRequest;
import com.example.demo.dto.SkillsResponse;
import com.example.demo.service.SkillService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/users/me/skills")
public class SkillController {
    private final SkillService skillService;
    public SkillController(SkillService skillService) {
        this.skillService = skillService;
    }
    @PostMapping
    public SkillsResponse addSkill(@RequestBody AddSkillRequest addSkillRequest) {
        return skillService.addSkill(addSkillRequest.getSkillId());
    }
    @GetMapping
    public SkillsResponse getSkills() {
        return skillService.getSkills();
    }
    @DeleteMapping("/{skillsId}")
    public SkillsResponse deleteSkill(@PathVariable Long skillsId) {
        return skillService.deleteSkill(skillsId);
    }

}
