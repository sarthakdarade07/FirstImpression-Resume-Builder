package com.firstimpression.backend.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.firstimpression.backend.Services.ResumeService;
import com.firstimpression.backend.dto.ResumeCreateRequest;
import com.firstimpression.backend.dto.ResumeResponse;
import com.firstimpression.backend.dto.ResumeTailorResponse;
import com.firstimpression.backend.dto.ResumeUpdateRequest;
import com.firstimpression.backend.model.Users;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.web.bind.annotation.PutMapping;

@RestController
@RequestMapping("/api/resumes")
@RequiredArgsConstructor
@Slf4j
public class ResumeController {

	private final ResumeService resumeService;

	private Users getAuthenticatedUser(Authentication authentication) {
		if (authentication == null || !(authentication.getPrincipal() instanceof Users)) {
			return null;
		}
		return (Users) authentication.getPrincipal();
	} 

	@GetMapping
	public ResponseEntity<List<ResumeResponse>> getUserResumes(Authentication authentication) {
		Users user = getAuthenticatedUser(authentication);
		if (user == null) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
		}
		log.info("REST: GET /api/resumes for user: {}", user.getId());
		return ResponseEntity.ok(resumeService.getUserResumes(user));
	}

	@PostMapping
	public ResponseEntity<ResumeResponse> createResume(
			Authentication authentication,
			@Valid @RequestBody ResumeCreateRequest request
	) {
		Users user = getAuthenticatedUser(authentication);
		if (user == null) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
		}
		log.info("REST: POST /api/resumes for user: {}", user.getId());
		return ResponseEntity.status(HttpStatus.CREATED).body(resumeService.createResume(user, request));
	}

	@GetMapping("/{id}")
	public ResponseEntity<ResumeResponse> getResumeById(
			Authentication authentication,
			@PathVariable String id
	) {
		Users user = getAuthenticatedUser(authentication);
		if (user == null) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
		}
		log.info("REST: GET /api/resumes/{} for user: {}", id, user.getId());
		return ResponseEntity.ok(resumeService.getResumeById(user, id));
	}

	@PutMapping("/{id}")
	public ResponseEntity<ResumeResponse> updateResume(
			Authentication authentication,
			@PathVariable String id,
			@Valid @RequestBody ResumeCreateRequest request
	) {
		Users user = getAuthenticatedUser(authentication);
		if (user == null) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
		}
		log.info("REST: PUT /api/resumes/{} for user: {}", id, user.getId());
		return ResponseEntity.ok(resumeService.updateResume(user, id, request));
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<Void> deleteResume(
			Authentication authentication,
			@PathVariable String id
	) {
		Users user = getAuthenticatedUser(authentication);
		if (user == null) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
		}
		log.info("REST: DELETE /api/resumes/{} for user: {}", id, user.getId());
		resumeService.deleteResume(user, id);
		return ResponseEntity.noContent().build();
	}

	@PostMapping("/{id}/tailor-to-jd")
	public ResponseEntity<ResumeTailorResponse> tailorResumeToJd(
			Authentication authentication,
			@PathVariable String id
	) {
		Users user = getAuthenticatedUser(authentication);
		if (user == null) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
		}
		log.info("REST: POST /api/resumes/{}/tailor-to-jd for user: {}", id, user.getId());
		return ResponseEntity.ok(resumeService.tailorResumeToJd(user, id));
	}
	
	@PostMapping("/{id}/update-resume")
	public ResponseEntity<?> updateResume(
			@PathVariable("id") String resumeId,
			 @RequestBody ResumeUpdateRequest req,
			 Authentication authentication){
		
		Users user = getAuthenticatedUser(authentication);
		 if (user == null) {
	            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Authentication required");
	        }
		
		 String query = req.getQuery();
		 
		 String response = resumeService.updateResume(user, resumeId, query);
		  
		 return ResponseEntity.ok(Map.of("response",response));
	}
}
