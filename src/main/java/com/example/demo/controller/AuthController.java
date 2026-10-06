package com.example.demo.controller;

import com.example.demo.dto.AuthResponse;
import com.example.demo.dto.RegisterRequest;
import com.example.demo.dto.UserResponse;
import com.example.demo.dto.loginRequest;
import com.example.demo.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
public class AuthController {
    private final AuthService authService;
    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/auth/register")
    public UserResponse register(@Valid @RequestBody  RegisterRequest request ){
      return authService.register(request);
    }

    @PostMapping("/auth/login")
    public AuthResponse login(@Valid @RequestBody loginRequest login){
        return authService.login(login);
    }

    @GetMapping("/test")
    public String test(Authentication authentication) {
        return "Authenticated as: " + authentication.getName();
    }
}
