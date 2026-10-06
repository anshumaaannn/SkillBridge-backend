package com.example.demo.controller;

import com.example.demo.dto.ProfileResponse;
import com.example.demo.dto.UpdateProfileRequest;
import com.example.demo.service.ProfileService;
import org.springframework.web.bind.annotation.*;

@RestController
public class ProfileController {

    private final ProfileService profileService;

    public ProfileController(ProfileService profileService) {
        this.profileService = profileService;
    }

    @GetMapping("/users/me/profile")
    public ProfileResponse getCurrentUserProfile() {
        return profileService.getCurrentUserProfile();
    }

    @PutMapping("/users/me/profile")
    public ProfileResponse updateCurrentUserProfile(@RequestBody UpdateProfileRequest request) {
        return profileService.updateCurrentUserProfile(request);
    }

    @GetMapping("/users/{userId}/profile")
    public ProfileResponse getUserProfile(@PathVariable("userId") Long userId) {
        return profileService.getProfileByUserId(userId);
    }
}
