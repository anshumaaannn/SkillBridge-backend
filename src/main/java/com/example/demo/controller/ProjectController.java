package com.example.demo.controller;

import com.example.demo.dto.*;
import com.example.demo.service.ProjectApplicationService;
import com.example.demo.service.ProjectService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/projects")
public class ProjectController {

    private final ProjectService projectService;
    private final ProjectApplicationService applicationService;

    public ProjectController(ProjectService projectService, ProjectApplicationService applicationService) {
        this.projectService = projectService;
        this.applicationService = applicationService;
    }

    @PostMapping
    public ResponseEntity<ProjectResponse> createProject(@Valid @RequestBody CreateProjectRequest request) {
        ProjectResponse response = projectService.createProject(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping
    public List<ProjectResponse> getAllProjects() {
        return projectService.getAllProjects();
    }

    @GetMapping("/my")
    public List<ProjectResponse> getMyProjects() {
        return projectService.getMyProjects();
    }

    @GetMapping("/{id}")
    public ProjectResponse getProjectById(@PathVariable("id") Long id) {
        return projectService.getProjectById(id);
    }

    @PutMapping("/{id}")
    public ProjectResponse updateProject(@PathVariable("id") Long id, @RequestBody UpdateProjectRequest request) {
        return projectService.updateProject(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteProject(@PathVariable("id") Long id) {
        projectService.deleteProject(id);
    }

    @PostMapping("/{projectId}/apply")
    public ResponseEntity<ApplicationResponse> applyToProject(@PathVariable("projectId") Long projectId,
                                                              @RequestBody(required = false) ApplyProjectRequest request) {
        ApplicationResponse response = applicationService.applyToProject(projectId, request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PostMapping("/{projectId}/applications")
    public ResponseEntity<ApplicationResponse> applyToProjectAlias(@PathVariable("projectId") Long projectId,
                                                                   @RequestBody(required = false) ApplyProjectRequest request) {
        ApplicationResponse response = applicationService.applyToProject(projectId, request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/{projectId}/applications")
    public List<ApplicationResponse> getApplicationsForProject(@PathVariable("projectId") Long projectId) {
        return applicationService.getApplicationsForProject(projectId);
    }
}
