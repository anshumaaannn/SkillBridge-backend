package com.example.demo.service;

import com.example.demo.Entity.Skill;
import com.example.demo.Entity.User;
import com.example.demo.dto.SkillResponse;
import com.example.demo.dto.SkillsResponse;
import com.example.demo.repository.SkillRepository;
import com.example.demo.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class SkillService {
   private final CurrentUserService currentUserService;
   private final UserRepository userRepository;
   private final SkillRepository skillRepository;
   public SkillService( CurrentUserService currentUserService, SkillRepository skillRepository, UserRepository userRepository) {
       this.currentUserService = currentUserService;
        this.userRepository = userRepository;
       this.skillRepository = skillRepository;
   }

    public SkillsResponse addSkill(Long skillId){
        User currentUser = currentUserService.getCurrentUser();
        Skill skill = skillRepository.findById(skillId).orElseThrow(() -> new RuntimeException("skill not found"));
        if(currentUser.getSkills().contains(skill)){
            throw new RuntimeException("Skill already exists");
        }
        currentUser.getSkills().add(skill);
        userRepository.save(currentUser);

      return toSkillsResponse(currentUser);
    }
    private SkillsResponse toSkillsResponse(User user){
        List<SkillResponse> skillResponses = new ArrayList<>();

        for(Skill currentSkill : user.getSkills()){
            SkillResponse dto = new SkillResponse(
                    currentSkill.getId(),
                    currentSkill.getName()
            );
            skillResponses.add(dto);
        }
        return new SkillsResponse(skillResponses);
    }
    public SkillsResponse getSkills(){
       return toSkillsResponse(currentUserService.getCurrentUser());
    }
    public SkillsResponse deleteSkill(Long skillId){
        User currentUser = currentUserService.getCurrentUser();
        Skill skillToDelete = null;
        for(Skill skill : currentUser.getSkills()){
            if(skill.getId().equals(skillId)){
                skillToDelete = skill;
                break;
            }
        }
        if(skillToDelete == null){
            throw new RuntimeException("Skill not found");
        }
        currentUser.getSkills().remove(skillToDelete);

        userRepository.save(currentUser);

        return toSkillsResponse(currentUser);
    }
}
