package com.example.demo.service;

import com.example.demo.Authentication.JwtUtil;
import com.example.demo.Entity.Role;
import com.example.demo.Entity.User;
import com.example.demo.dto.AuthResponse;
import com.example.demo.dto.RegisterRequest;
import com.example.demo.dto.UserResponse;
import com.example.demo.dto.loginRequest;
import com.example.demo.repository.UserRepository;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthService {
    private final JwtUtil jwtUtil;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;
    private final UserRepository userRepository;
    public AuthService(UserRepository userRepository,BCryptPasswordEncoder bCryptPasswordEncoder, JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.bCryptPasswordEncoder = bCryptPasswordEncoder;
        this.jwtUtil = jwtUtil;
    }
    public UserResponse register(RegisterRequest request){
        Optional<User> existingUser = userRepository.findByEmail(request.getEmail());
        if(existingUser.isPresent()){
            throw new RuntimeException("Email already present");
        }
        String encodedPassword = bCryptPasswordEncoder.encode(request.getPassword());
        if (request.getRole() == Role.ADMIN) {
            throw new RuntimeException("Admin registration is not allowed");
        }
        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(encodedPassword);
        user.setRole(request.getRole());
        user.setProfessionalTitle(request.getProfessionalTitle());

        User savedUser = userRepository.save(user);


        UserResponse response = new UserResponse();
        response.setId(savedUser.getId());
        response.setName(savedUser.getName());
        response.setEmail(savedUser.getEmail());
        response.setRole(savedUser.getRole());
        response.setProfessionalTitle(savedUser.getProfessionalTitle());

        return response;
    }
    public AuthResponse login(loginRequest request)
    {
        Optional<User> existingUser = userRepository.findByEmail(request.getEmail());
        if(!existingUser.isPresent()){
            throw new RuntimeException("Email Not Found");
        }
        boolean passwordMatches = bCryptPasswordEncoder.matches(request.getPassword(), existingUser.get().getPassword());
        if(!passwordMatches){
            throw new RuntimeException("Password doesnt match");
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
