package com.firstimpression.backend.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;


import com.firstimpression.backend.Exception.ServiceException;
import com.firstimpression.backend.model.JobDescription;
import com.firstimpression.backend.model.Users;
import com.firstimpression.backend.Services.ai.JdService;

import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping({"/api/ai", "/api/gemini"})
@Slf4j
public class GeminiController {

    private final JdService jdService;

    public GeminiController(JdService jdService) {
        this.jdService = jdService;
    }

    private Users getAuthenticatedUser(Authentication authentication) {
        if (authentication == null || !(authentication.getPrincipal() instanceof Users)) {
            return null;
        }
        return (Users) authentication.getPrincipal();
    }

    @PostMapping(value = "/jd", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> uploadJd(
            @RequestPart(value = "file", required = false) MultipartFile file,
            @RequestParam(value = "text", required = false) String text,
            @RequestParam(value = "resumeId", required = false) String resumeId,
            Authentication authentication) throws Exception {
        Users user = getAuthenticatedUser(authentication);
        if (user == null) {
            throw new ServiceException(HttpStatus.UNAUTHORIZED, "Authentication required");
        }

        try {
            JobDescription jd = jdService.uploadJd(file, text, resumeId, user);
            return ResponseEntity.status(HttpStatus.CREATED).body(jd);
        } catch (ServiceException e) {
            throw e;
        } catch (Exception e) {
            log.error("Error processing JD upload", e);
            throw new ServiceException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to process job description: " + e.getMessage(), e);
        }
    }

    @GetMapping("/jd/resume/{resumeId}")
    public ResponseEntity<?> getJdByResumeId(
            @PathVariable("resumeId") String resumeId,
            Authentication authentication) {
        Users user = getAuthenticatedUser(authentication);
        if (user == null) {
            throw new ServiceException(HttpStatus.UNAUTHORIZED, "Authentication required");
        }

        return ResponseEntity.ok(jdService.getJdByResumeId(resumeId, user).orElse(null));
    }
}