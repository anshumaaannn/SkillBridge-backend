package com.example.demo.service;

import com.example.demo.Authentication.JwtUtil;
import com.example.demo.Entity.Profile;
import com.example.demo.Entity.Role;
import com.example.demo.Entity.User;
import com.example.demo.dto.AuthResponse;
import com.example.demo.dto.RegisterRequest;
import com.example.demo.dto.UserResponse;
import com.example.demo.dto.loginRequest;
import com.example.demo.exception.BadRequestException;
import com.example.demo.exception.DuplicateResourceException;
import com.example.demo.repository.ProfileRepository;
import com.example.demo.repository.UserRepository;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class AuthService {
    private final JwtUtil jwtUtil;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;
    private final UserRepository userRepository;
    private final ProfileRepository profileRepository;

    public AuthService(UserRepository userRepository,
                       ProfileRepository profileRepository,
                       BCryptPasswordEncoder bCryptPasswordEncoder,
                       JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.profileRepository = profileRepository;
        this.bCryptPasswordEncoder = bCryptPasswordEncoder;
        this.jwtUtil = jwtUtil;
    }

    @Transactional
    public UserResponse register(RegisterRequest request) {
        Optional<User> existingUser = userRepository.findByEmail(request.getEmail());
        if (existingUser.isPresent()) {
            throw new DuplicateResourceException("Email already present");
        }
        if (request.getRole() == Role.ADMIN) {
            throw new BadRequestException("Admin registration is not allowed");
        }

        String encodedPassword = bCryptPasswordEncoder.encode(request.getPassword());

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(encodedPassword);
        user.setRole(request.getRole());
        user.setProfessionalTitle(request.getProfessionalTitle());

        User savedUser = userRepository.save(user);

        // Invariant: Every registered User has exactly one Profile created on registration
        Profile profile = new Profile();
        profile.setUser(savedUser);
        profile.setName(savedUser.getName());
        profile.setTitle(savedUser.getProfessionalTitle());
        profileRepository.save(profile);

        UserResponse response = new UserResponse();
        response.setId(savedUser.getId());
        response.setName(savedUser.getName());
        response.setEmail(savedUser.getEmail());
        response.setRole(savedUser.getRole());
        response.setProfessionalTitle(savedUser.getProfessionalTitle());

        return response;
    }

    public AuthResponse login(loginRequest request) {
        Optional<User> existingUser = userRepository.findByEmail(request.getEmail());
        if (existingUser.isEmpty()) {
            throw new BadRequestException("Invalid email or password");
        }

        boolean passwordMatches = bCryptPasswordEncoder.matches(request.getPassword(), existingUser.get().getPassword());
        if (!passwordMatches) {
            throw new BadRequestException("Invalid email or password");
        }

        String token = jwtUtil.generateToken(existingUser.get().getEmail());
        AuthResponse response = new AuthResponse();
        response.setToken(token);
        response.setEmail(existingUser.get().getEmail());
        response.setId(existingUser.get().getId());
        response.setName(existingUser.get().getName());
        response.setRole(existingUser.get().getRole());
        return response;
    }
}
