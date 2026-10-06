package com.example.demo.Entity;

import jakarta.persistence.*;

import javax.xml.stream.Location;

@Entity
public class Profile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String bio;
    private String githubUrl;
    private String linkedinUrl;
    private String profileImageUrl;
    private String location;

    @OneToOne
    @JoinColumn(name="user_id",nullable = false,unique = true)
    private User user;
}
