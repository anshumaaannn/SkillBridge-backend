package com.example.demo.service;
import com.example.demo.repository.UserRepository;
import com.example.demo.Entity.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class CustomUserDetailsService implements UserDetailsService {
    private final UserRepository userRepository;
    public CustomUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String email){
        Optional<User> existingUser = userRepository.findByEmail(email);
        if(!existingUser.isPresent()){
            throw new UsernameNotFoundException("User not found");
        }
        User user = existingUser.get();
        UserDetails userDetails = org.springframework.security.core.userdetails.User.withUsername(email).password(user.getPassword()).authorities("ROLE_" + user.getRole().name()).build();
        return userDetails;
    }
}
