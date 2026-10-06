package com.example.demo.config;

import com.example.demo.Entity.*;
import com.example.demo.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Component
public class DemoDataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DemoDataInitializer.class);

    private final UserRepository userRepository;
    private final ProfileRepository profileRepository;
    private final SkillRepository skillRepository;
    private final ProjectRepository projectRepository;
    private final ProjectApplicationRepository projectApplicationRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    public DemoDataInitializer(UserRepository userRepository,
                               ProfileRepository profileRepository,
                               SkillRepository skillRepository,
                               ProjectRepository projectRepository,
                               ProjectApplicationRepository projectApplicationRepository,
                               BCryptPasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.profileRepository = profileRepository;
        this.skillRepository = skillRepository;
        this.projectRepository = projectRepository;
        this.projectApplicationRepository = projectApplicationRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public void run(String... args) {
        log.info("Checking and seeding development demo data for SkillBridge...");

        // 1. Seed Skills (~10 core platform skills)
        Map<String, Skill> skillsMap = seedSkills();

        // 2. Seed Demo Users & Profiles
        User user1 = seedUser(
                "demo1@skillbridge.com",
                "Demo@123",
                "Ansh Sharma",
                "Backend Developer",
                Role.STUDENT,
                "Computer science student interested in backend development and building real-world applications.",
                "Ghaziabad, India",
                "https://github.com/example",
                "https://linkedin.com/in/example"
        );

        User user2 = seedUser(
                "demo2@skillbridge.com",
                "Demo@123",
                "Rahul Verma",
                "Frontend Developer",
                Role.STUDENT,
                "Developer interested in React and modern web applications.",
                "Delhi, India",
                "https://github.com/example",
                "https://linkedin.com/in/example"
        );

        // 3. Attach Skills to Users
        attachSkillsToUser(user1, skillsMap, List.of("Java", "Spring Boot", "PostgreSQL"));
        attachSkillsToUser(user2, skillsMap, List.of("React", "JavaScript", "HTML/CSS"));

        // 4. Seed Demo Projects
        Project project1 = seedProject(
                "Student Portfolio Platform",
                "Build a responsive portfolio platform for students to showcase their projects and technical skills.",
                15000.0,
                user1
        );

        Project project2 = seedProject(
                "React Dashboard for Startup",
                "Build a responsive dashboard interface for managing startup project information.",
                10000.0,
                user2
        );

        Project project3 = seedProject(
                "REST API Integration",
                "Integrate a REST API into an existing web application and implement the required frontend flows.",
                8000.0,
                user1
        );

        // 5. Seed Demo Application: Demo User 2 applies to Student Portfolio Platform (owned by User 1)
        if (project1 != null) {
            seedApplication(
                    project1,
                    user2,
                    "I would love to help build this responsive student portfolio platform using React and Tailwind CSS."
            );
        }

        log.info("Development demo data initialization completed successfully.");
    }

    private Map<String, Skill> seedSkills() {
        List<String> skillNames = List.of(
                "Java",
                "Spring Boot",
                "Spring Security",
                "PostgreSQL",
                "React",
                "JavaScript",
                "HTML/CSS",
                "Docker",
                "Git",
                "REST APIs"
        );

        Map<String, Skill> map = new HashMap<>();
        for (String name : skillNames) {
            Optional<Skill> existing = skillRepository.findByName(name);
            Skill skill = existing.orElseGet(() -> {
                log.info("Seeding skill: {}", name);
                return skillRepository.save(new Skill(name));
            });
            map.put(name, skill);
        }
        return map;
    }

    private User seedUser(String email,
                          String rawPassword,
                          String name,
                          String professionalTitle,
                          Role role,
                          String bio,
                          String location,
                          String githubUrl,
                          String linkedinUrl) {
        Optional<User> existingUser = userRepository.findByEmail(email);
        User user;
        if (existingUser.isPresent()) {
            user = existingUser.get();
        } else {
            log.info("Seeding demo user: {}", email);
            user = new User();
            user.setEmail(email);
            user.setPassword(passwordEncoder.encode(rawPassword));
            user.setName(name);
            user.setProfessionalTitle(professionalTitle);
            user.setRole(role);
            user = userRepository.save(user);
        }

        // Ensure 1:1 Profile exists and is populated
        Optional<Profile> existingProfile = profileRepository.findByUser(user);
        if (existingProfile.isEmpty()) {
            log.info("Seeding demo profile for user: {}", email);
            Profile profile = new Profile();
            profile.setUser(user);
            profile.setName(name);
            profile.setTitle(professionalTitle);
            profile.setBio(bio);
            profile.setLocation(location);
            profile.setGithubUrl(githubUrl);
            profile.setLinkedinUrl(linkedinUrl);
            profileRepository.save(profile);
        } else {
            Profile profile = existingProfile.get();
            boolean updated = false;
            if (profile.getBio() == null && bio != null) {
                profile.setBio(bio);
                updated = true;
            }
            if (profile.getLocation() == null && location != null) {
                profile.setLocation(location);
                updated = true;
            }
            if (profile.getGithubUrl() == null && githubUrl != null) {
                profile.setGithubUrl(githubUrl);
                updated = true;
            }
            if (profile.getLinkedinUrl() == null && linkedinUrl != null) {
                profile.setLinkedinUrl(linkedinUrl);
                updated = true;
            }
            if (updated) {
                profileRepository.save(profile);
            }
        }

        return user;
    }

    private void attachSkillsToUser(User user, Map<String, Skill> skillsMap, List<String> skillNames) {
        boolean updated = false;
        for (String skillName : skillNames) {
            Skill skill = skillsMap.get(skillName);
            if (skill != null) {
                boolean alreadyHas = user.getSkills().stream()
                        .anyMatch(s -> (s.getId() != null && s.getId().equals(skill.getId()))
                                || s.getName().equalsIgnoreCase(skill.getName()));
                if (!alreadyHas) {
                    log.info("Attaching skill '{}' to user '{}'", skill.getName(), user.getEmail());
                    user.getSkills().add(skill);
                    updated = true;
                }
            }
        }
        if (updated) {
            userRepository.save(user);
        }
    }

    private Project seedProject(String title, String description, Double budget, User owner) {
        List<Project> existing = projectRepository.findByOwner(owner);
        Optional<Project> found = existing.stream()
                .filter(p -> p.getTitle().equalsIgnoreCase(title))
                .findFirst();
        if (found.isPresent()) {
            return found.get();
        }

        log.info("Seeding demo project '{}' for owner '{}'", title, owner.getEmail());
        Project project = new Project();
        project.setTitle(title);
        project.setDescription(description);
        project.setBudget(budget);
        project.setOwner(owner);
        project.setStatus("OPEN");
        return projectRepository.save(project);
    }

    private void seedApplication(Project project, User applicant, String message) {
        if (projectApplicationRepository.existsByProjectIdAndApplicantId(project.getId(), applicant.getId())) {
            return;
        }

        log.info("Seeding demo application from '{}' to project '{}'", applicant.getEmail(), project.getTitle());
        ProjectApplication application = new ProjectApplication();
        application.setProject(project);
        application.setApplicant(applicant);
        application.setStatus(ApplicationStatus.PENDING);
        application.setMessage(message);
        projectApplicationRepository.save(application);
    }
}
