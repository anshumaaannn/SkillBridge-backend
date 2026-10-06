package com.example.demo.service;

import com.example.demo.Entity.ApplicationStatus;
import com.example.demo.Entity.Project;
import com.example.demo.Entity.ProjectApplication;
import com.example.demo.Entity.User;
import com.example.demo.dto.ApplicationResponse;
import com.example.demo.dto.ApplyProjectRequest;
import com.example.demo.dto.UpdateApplicationStatusRequest;
import com.example.demo.exception.BadRequestException;
import com.example.demo.exception.DuplicateResourceException;
import com.example.demo.exception.ForbiddenException;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.repository.ProjectApplicationRepository;
import com.example.demo.repository.ProjectRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ProjectApplicationService {

    private final ProjectApplicationRepository applicationRepository;
    private final ProjectRepository projectRepository;
    private final CurrentUserService currentUserService;

    public ProjectApplicationService(ProjectApplicationRepository applicationRepository,
                                     ProjectRepository projectRepository,
                                     CurrentUserService currentUserService) {
        this.applicationRepository = applicationRepository;
        this.projectRepository = projectRepository;
        this.currentUserService = currentUserService;
    }

    @Transactional
    public ApplicationResponse applyToProject(Long projectId, ApplyProjectRequest request) {
        User currentUser = currentUserService.getCurrentUser();
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + projectId));

        if (project.getOwner().getId().equals(currentUser.getId())) {
            throw new BadRequestException("Project owner cannot apply to their own project");
        }

        if (applicationRepository.existsByProjectIdAndApplicantId(projectId, currentUser.getId())) {
            throw new DuplicateResourceException("You have already applied to this project");
        }

        ProjectApplication application = new ProjectApplication();
        application.setProject(project);
        application.setApplicant(currentUser);
        application.setStatus(ApplicationStatus.PENDING);
        if (request != null) {
            application.setMessage(request.getMessage());
        }

        ProjectApplication saved = applicationRepository.save(application);
        return toResponse(saved);
    }

    public List<ApplicationResponse> getMyApplications() {
        User currentUser = currentUserService.getCurrentUser();
        return applicationRepository.findByApplicant(currentUser).stream()
                .map(this::toResponse)
                .toList();
    }

    public List<ApplicationResponse> getApplicationsForProject(Long projectId) {
        User currentUser = currentUserService.getCurrentUser();
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + projectId));

        if (!project.getOwner().getId().equals(currentUser.getId())) {
            throw new ForbiddenException("You are not authorized to view applications for this project");
        }

        return applicationRepository.findByProjectId(projectId).stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public ApplicationResponse updateApplicationStatus(Long applicationId, UpdateApplicationStatusRequest request) {
        User currentUser = currentUserService.getCurrentUser();
        ProjectApplication application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found with id: " + applicationId));

        if (!application.getProject().getOwner().getId().equals(currentUser.getId())) {
            throw new ForbiddenException("You are not authorized to update applications for this project");
        }

        application.setStatus(request.getStatus());
        ProjectApplication saved = applicationRepository.save(application);
        return toResponse(saved);
    }

    private ApplicationResponse toResponse(ProjectApplication app) {
        return new ApplicationResponse(
                app.getId(),
                app.getProject() != null ? app.getProject().getId() : null,
                app.getProject() != null ? app.getProject().getTitle() : null,
                app.getApplicant() != null ? app.getApplicant().getId() : null,
                app.getApplicant() != null ? app.getApplicant().getName() : null,
                app.getApplicant() != null ? app.getApplicant().getEmail() : null,
                app.getStatus(),
                app.getMessage(),
                app.getAppliedAt()
        );
    }
}
