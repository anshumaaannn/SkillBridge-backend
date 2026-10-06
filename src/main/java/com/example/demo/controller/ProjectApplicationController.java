package com.example.demo.controller;

import com.example.demo.dto.ApplicationResponse;
import com.example.demo.dto.UpdateApplicationStatusRequest;
import com.example.demo.service.ProjectApplicationService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class ProjectApplicationController {

    private final ProjectApplicationService applicationService;

    public ProjectApplicationController(ProjectApplicationService applicationService) {
        this.applicationService = applicationService;
    }

    @GetMapping({"/applications/me", "/users/me/applications"})
    public List<ApplicationResponse> getMyApplications() {
        return applicationService.getMyApplications();
    }

    @PatchMapping("/applications/{id}/status")
    public ApplicationResponse updateApplicationStatusPatch(@PathVariable("id") Long id,
                                                            @Valid @RequestBody UpdateApplicationStatusRequest request) {
        return applicationService.updateApplicationStatus(id, request);
    }

    @PutMapping("/applications/{id}/status")
    public ApplicationResponse updateApplicationStatusPut(@PathVariable("id") Long id,
                                                          @Valid @RequestBody UpdateApplicationStatusRequest request) {
        return applicationService.updateApplicationStatus(id, request);
    }
}
