package com.example.demo.service;

import com.example.demo.Entity.Skill;
import com.example.demo.Entity.User;
import com.example.demo.dto.SkillResponse;
import com.example.demo.dto.SkillsResponse;
import com.example.demo.exception.DuplicateResourceException;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.repository.SkillRepository;
import com.example.demo.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
public class SkillService {
    private final CurrentUserService currentUserService;
    private final UserRepository userRepository;
    private final SkillRepository skillRepository;

    public SkillService(CurrentUserService currentUserService, SkillRepository skillRepository, UserRepository userRepository) {
        this.currentUserService = currentUserService;
        this.userRepository = userRepository;
        this.skillRepository = skillRepository;
    }

    @Transactional
    public SkillsResponse addSkill(Long skillId) {
        User currentUser = currentUserService.getCurrentUser();
        Skill skill = skillRepository.findById(skillId)
                .orElseThrow(() -> new ResourceNotFoundException("Skill not found with id: " + skillId));

        boolean alreadyHasSkill = currentUser.getSkills().stream()
                .anyMatch(s -> s.getId().equals(skillId));

        if (alreadyHasSkill) {
            throw new DuplicateResourceException("Skill is already added to user");
        }

        currentUser.getSkills().add(skill);
        userRepository.save(currentUser);

        return toSkillsResponse(currentUser);
    }

    public SkillsResponse getSkills() {
        return toSkillsResponse(currentUserService.getCurrentUser());
    }

    @Transactional
    public SkillsResponse deleteSkill(Long skillId) {
        User currentUser = currentUserService.getCurrentUser();
        Skill skillToDelete = currentUser.getSkills().stream()
                .filter(skill -> skill.getId().equals(skillId))
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Skill not associated with current user"));

        currentUser.getSkills().remove(skillToDelete);
        userRepository.save(currentUser);

        return toSkillsResponse(currentUser);
    }

    public List<SkillResponse> getAllSkills() {
        return skillRepository.findAll().stream()
                .map(skill -> new SkillResponse(skill.getId(), skill.getName()))
                .toList();
    }

    private SkillsResponse toSkillsResponse(User user) {
        List<SkillResponse> skillResponses = new ArrayList<>();

        for (Skill currentSkill : user.getSkills()) {
            SkillResponse dto = new SkillResponse(
                    currentSkill.getId(),
                    currentSkill.getName()
            );
            skillResponses.add(dto);
        }
        return new SkillsResponse(skillResponses);
    }
}
