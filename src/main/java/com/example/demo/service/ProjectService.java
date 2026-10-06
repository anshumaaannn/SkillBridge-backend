package com.example.demo.service;

import com.example.demo.Entity.Project;
import com.example.demo.Entity.User;
import com.example.demo.dto.CreateProjectRequest;
import com.example.demo.dto.ProjectResponse;
import com.example.demo.dto.UpdateProjectRequest;
import com.example.demo.exception.ForbiddenException;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.repository.ProjectApplicationRepository;
import com.example.demo.repository.ProjectRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final ProjectApplicationRepository applicationRepository;
    private final CurrentUserService currentUserService;

    public ProjectService(ProjectRepository projectRepository,
                          ProjectApplicationRepository applicationRepository,
                          CurrentUserService currentUserService) {
        this.projectRepository = projectRepository;
        this.applicationRepository = applicationRepository;
        this.currentUserService = currentUserService;
    }

    @Transactional
    public ProjectResponse createProject(CreateProjectRequest request) {
        User currentUser = currentUserService.getCurrentUser();

        Project project = new Project();
        project.setTitle(request.getTitle());
        project.setDescription(request.getDescription());
        project.setBudget(request.getBudget());
        project.setOwner(currentUser);

        Project saved = projectRepository.save(project);
        return toResponse(saved);
    }

    public List<ProjectResponse> getAllProjects() {
        return projectRepository.findAll().stream()
                .map(this::toResponse)
                .toList();
    }

    public List<ProjectResponse> getMyProjects() {
        User currentUser = currentUserService.getCurrentUser();
        return projectRepository.findByOwner(currentUser).stream()
                .map(this::toResponse)
                .toList();
    }

    public ProjectResponse getProjectById(Long id) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + id));
        return toResponse(project);
    }

    @Transactional
    public ProjectResponse updateProject(Long id, UpdateProjectRequest request) {
        User currentUser = currentUserService.getCurrentUser();
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + id));

        if (!project.getOwner().getId().equals(currentUser.getId())) {
            throw new ForbiddenException("You are not authorized to update this project");
        }

        if (request.getTitle() != null) {
            project.setTitle(request.getTitle());
        }
        if (request.getDescription() != null) {
            project.setDescription(request.getDescription());
        }
        if (request.getBudget() != null) {
            project.setBudget(request.getBudget());
        }
        if (request.getStatus() != null) {
            project.setStatus(request.getStatus());
        }

        Project saved = projectRepository.save(project);
        return toResponse(saved);
    }

    @Transactional
    public void deleteProject(Long id) {
        User currentUser = currentUserService.getCurrentUser();
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + id));

        if (!project.getOwner().getId().equals(currentUser.getId())) {
            throw new ForbiddenException("You are not authorized to delete this project");
        }

        applicationRepository.deleteByProjectId(id);
        projectRepository.delete(project);
    }

    public ProjectResponse toResponse(Project project) {
        return new ProjectResponse(
                project.getId(),
                project.getTitle(),
                project.getDescription(),
                project.getBudget(),
                project.getStatus(),
                project.getOwner() != null ? project.getOwner().getId() : null,
                project.getOwner() != null ? project.getOwner().getName() : null,
                project.getCreatedAt()
        );
    }
}
