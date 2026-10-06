package com.example.demo.service;

import com.example.demo.Entity.Profile;
import com.example.demo.Entity.User;
import com.example.demo.dto.ProfileResponse;
import com.example.demo.dto.UpdateProfileRequest;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.repository.ProfileRepository;
import com.example.demo.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ProfileService {

    private final ProfileRepository profileRepository;
    private final CurrentUserService currentUserService;
    private final UserRepository userRepository;

    public ProfileService(ProfileRepository profileRepository, CurrentUserService currentUserService, UserRepository userRepository) {
        this.profileRepository = profileRepository;
        this.currentUserService = currentUserService;
        this.userRepository = userRepository;
    }

    public ProfileResponse getCurrentUserProfile() {
        User currentUser = currentUserService.getCurrentUser();
        Profile profile = profileRepository.findByUser(currentUser)
                .orElseThrow(() -> new ResourceNotFoundException("Profile not found for current user"));

        return toResponse(profile);
    }

    @Transactional
    public ProfileResponse updateCurrentUserProfile(UpdateProfileRequest request) {
        User currentUser = currentUserService.getCurrentUser();
        Profile profile = profileRepository.findByUser(currentUser)
                .orElseGet(() -> {
                    Profile newProfile = new Profile();
                    newProfile.setUser(currentUser);
                    return newProfile;
                });

        if (request.getName() != null) {
            profile.setName(request.getName());
            currentUser.setName(request.getName());
            userRepository.save(currentUser);
        }
        if (request.getTitle() != null) {
            profile.setTitle(request.getTitle());
        }
        if (request.getBio() != null) {
            profile.setBio(request.getBio());
        }
        if (request.getLocation() != null) {
            profile.setLocation(request.getLocation());
        }
        if (request.getProfileImageUrl() != null) {
            profile.setProfileImageUrl(request.getProfileImageUrl());
        }
        if (request.getGithubUrl() != null) {
            profile.setGithubUrl(request.getGithubUrl());
        }
        if (request.getLinkedinUrl() != null) {
            profile.setLinkedinUrl(request.getLinkedinUrl());
        }

        Profile saved = profileRepository.save(profile);
        return toResponse(saved);
    }

    public ProfileResponse getProfileByUserId(Long userId) {
        Profile profile = profileRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Profile not found for user ID: " + userId));
        return toResponse(profile);
    }

    private ProfileResponse toResponse(Profile profile) {
        return new ProfileResponse(
                profile.getId(),
                profile.getUser() != null ? profile.getUser().getId() : null,
                profile.getName(),
                profile.getTitle(),
                profile.getBio(),
                profile.getLocation(),
                profile.getProfileImageUrl(),
                profile.getGithubUrl(),
                profile.getLinkedinUrl()
        );
    }
}
