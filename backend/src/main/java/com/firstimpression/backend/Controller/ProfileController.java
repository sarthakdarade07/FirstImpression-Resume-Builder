package com.firstimpression.backend.Controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.firstimpression.backend.Services.ProfileService;
import com.firstimpression.backend.dto.CertificationRequest;
import com.firstimpression.backend.dto.EducationRequest;
import com.firstimpression.backend.dto.EducationTypeResponse;
import com.firstimpression.backend.dto.LanguageRequest;
import com.firstimpression.backend.dto.PersonalInformationRequest;
import com.firstimpression.backend.dto.ProfileResponse;
import com.firstimpression.backend.dto.ProjectRequest;
import com.firstimpression.backend.dto.ScoreTypeResponse;
import com.firstimpression.backend.dto.SkillRequest;
import com.firstimpression.backend.dto.UpdateNameRequest;
import com.firstimpression.backend.dto.WorkExperienceRequest;
import com.firstimpression.backend.model.Users;
import com.firstimpression.backend.util.AppConstants;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@Slf4j
@RequiredArgsConstructor
@RequestMapping(AppConstants.PROFILE_CONTROLLER)
public class ProfileController {
 
	private final ProfileService profileService;
	
	@GetMapping(AppConstants.GET_PROFILE)
	public ResponseEntity<?> getProfile(Authentication authentication) {
		log.info("Inside ProfileController - getProfile(): {}", authentication);
		Object principalObject = authentication.getPrincipal();
		ProfileResponse currentProfile = profileService.getProfile(principalObject);
		return ResponseEntity.ok().body(Map.of("message", currentProfile));
	}

	@GetMapping(AppConstants.GET_EDUCATION_TYPES)
	public ResponseEntity<List<EducationTypeResponse>> getEducationTypes() {
		log.info("Inside ProfileController - getEducationTypes()");
		return ResponseEntity.ok(profileService.getEducationTypes());
	}

	@GetMapping(AppConstants.GET_SCORE_TYPES)
	public ResponseEntity<List<ScoreTypeResponse>> getScoreTypes() {
		log.info("Inside ProfileController - getScoreTypes()");
		return ResponseEntity.ok(profileService.getScoreTypes());
	}

	@GetMapping(AppConstants.GET_EDUCATION_METADATA)
	public ResponseEntity<Map<String, Object>> getEducationMetadata() {
		log.info("Inside ProfileController - getEducationMetadata()");
		return ResponseEntity.ok(profileService.getEducationMetadata());
	}

	@PutMapping(AppConstants.UPDATE_NAME)
	public ResponseEntity<?> updateName(@Valid @RequestBody UpdateNameRequest req, Authentication authentication) {
		log.info("Inside ProfileController - updateName(): {}", req.getName());
		Users user = (Users) authentication.getPrincipal();
		Users updatedUser = profileService.updateName(user, req.getName());
		return ResponseEntity.ok(Map.of(
			"message", "Name updated successfully",
			"name", updatedUser.getName()
		));
	}

	// 1. Personal Information
	@PostMapping(AppConstants.SAVE_PERSONAL_INFORMATION)
	public ResponseEntity<?> savePersonalInformation(@RequestBody PersonalInformationRequest req,
			Authentication authentication) {
		log.info("Inside ProfileController - savePersonalInformation()");
		Users user = (Users) authentication.getPrincipal();
		profileService.savePersonalInformation(req, user);
		return ResponseEntity.status(HttpStatus.ACCEPTED)
				.body(Map.of("message", "Personal Information saved successfully."));
	}

	@DeleteMapping(AppConstants.DELETE_PERSONAL_INFORMATION)
	public ResponseEntity<?> deletePersonalInformation(Authentication authentication) {
		log.info("Inside ProfileController - deletePersonalInformation()");
		Users user = (Users) authentication.getPrincipal();
		profileService.deletePersonalInformation(user);
		return ResponseEntity.ok(Map.of("message", "Personal Information deleted successfully."));
	}
	
	// 2. Education
	@PostMapping(AppConstants.SAVE_EDUCATION)
	public ResponseEntity<?> saveEducation(@RequestBody List<EducationRequest> req, Authentication authentication) {
		log.info("Inside ProfileController - saveEducation()");
		Users user = (Users) authentication.getPrincipal();
		profileService.saveEducation(req, user);
		return ResponseEntity.status(HttpStatus.ACCEPTED)
				.body(Map.of("message", "Education Information saved successfully."));
	}

	@DeleteMapping(AppConstants.DELETE_EDUCATION)
	public ResponseEntity<?> deleteEducation(@PathVariable int id, Authentication authentication) {
		log.info("Inside ProfileController - deleteEducation(): {}", id);
		Users user = (Users) authentication.getPrincipal();
		profileService.deleteEducation(id, user);
		return ResponseEntity.ok(Map.of("message", "Education entry deleted successfully."));
	}
	
	// 3. Certifications
	@PostMapping(AppConstants.SAVE_CERTIFICATIONS)
	public ResponseEntity<?> saveCertifications(
	        @RequestBody List<CertificationRequest> req,
	        Authentication authentication) {
	    log.info("Inside ProfileController - saveCertifications()");
	    Users user = (Users) authentication.getPrincipal();
	    profileService.saveCertifications(req, user);
	    return ResponseEntity.status(HttpStatus.ACCEPTED)
	            .body(Map.of("message", "Certifications saved successfully."));
	}

	@DeleteMapping(AppConstants.DELETE_CERTIFICATION)
	public ResponseEntity<?> deleteCertification(@PathVariable int id, Authentication authentication) {
		log.info("Inside ProfileController - deleteCertification(): {}", id);
		Users user = (Users) authentication.getPrincipal();
		profileService.deleteCertification(id, user);
		return ResponseEntity.ok(Map.of("message", "Certification entry deleted successfully."));
	}
	
	// 4. Languages
	@PostMapping(AppConstants.SAVE_LANGUAGES)
	public ResponseEntity<?> saveLanguages(
	        @RequestBody List<LanguageRequest> req,
	        Authentication authentication) {
	    log.info("Inside ProfileController - saveLanguages()");
	    Users user = (Users) authentication.getPrincipal();
	    profileService.saveLanguages(req, user);
	    return ResponseEntity.status(HttpStatus.ACCEPTED)
	            .body(Map.of("message", "Languages saved successfully."));
	}

	@DeleteMapping(AppConstants.DELETE_LANGUAGE)
	public ResponseEntity<?> deleteLanguage(@PathVariable int id, Authentication authentication) {
		log.info("Inside ProfileController - deleteLanguage(): {}", id);
		Users user = (Users) authentication.getPrincipal();
		profileService.deleteLanguage(id, user);
		return ResponseEntity.ok(Map.of("message", "Language entry deleted successfully."));
	}
	
	// 5. Projects
	@PostMapping(AppConstants.SAVE_PROJECTS)
	public ResponseEntity<?> saveProjects(
	        @RequestBody List<ProjectRequest> req,
	        Authentication authentication) {
	    log.info("Inside ProfileController - saveProjects()");
	    Users user = (Users) authentication.getPrincipal();
	    profileService.saveProjects(req, user);
	    return ResponseEntity.status(HttpStatus.ACCEPTED)
	            .body(Map.of("message", "Projects saved successfully."));
	}

	@DeleteMapping(AppConstants.DELETE_PROJECT)
	public ResponseEntity<?> deleteProject(@PathVariable int id, Authentication authentication) {
		log.info("Inside ProfileController - deleteProject(): {}", id);
		Users user = (Users) authentication.getPrincipal();
		profileService.deleteProject(id, user);
		return ResponseEntity.ok(Map.of("message", "Project entry deleted successfully."));
	}
	
	// 6. Skills
	@PostMapping(AppConstants.SAVE_SKILLS)
	public ResponseEntity<?> saveSkills(
	        @RequestBody List<SkillRequest> req,
	        Authentication authentication) {
	    log.info("Inside ProfileController - saveSkills()");
	    Users user = (Users) authentication.getPrincipal();
	    profileService.saveSkills(req, user);
	    return ResponseEntity.status(HttpStatus.ACCEPTED)
	            .body(Map.of("message", "Skills saved successfully."));
	}

	@DeleteMapping(AppConstants.DELETE_SKILL)
	public ResponseEntity<?> deleteSkill(@PathVariable int id, Authentication authentication) {
		log.info("Inside ProfileController - deleteSkill(): {}", id);
		Users user = (Users) authentication.getPrincipal();
		profileService.deleteSkill(id, user);
		return ResponseEntity.ok(Map.of("message", "Skill entry deleted successfully."));
	}
	
	// 7. Work Experience
	@PostMapping(AppConstants.SAVE_WORK_EXPERIENCE)
	public ResponseEntity<?> saveWorkExperience(
	        @RequestBody List<WorkExperienceRequest> req,
	        Authentication authentication) {
	    log.info("Inside ProfileController - saveWorkExperience()");
	    Users user = (Users) authentication.getPrincipal();
	    profileService.saveWorkExperience(req, user);
	    return ResponseEntity.status(HttpStatus.ACCEPTED)
	            .body(Map.of("message", "Work experience saved successfully."));
	}

	@DeleteMapping(AppConstants.DELETE_WORK_EXPERIENCE)
	public ResponseEntity<?> deleteWorkExperience(@PathVariable int id, Authentication authentication) {
		log.info("Inside ProfileController - deleteWorkExperience(): {}", id);
		Users user = (Users) authentication.getPrincipal();
		profileService.deleteWorkExperience(id, user);
		return ResponseEntity.ok(Map.of("message", "Work experience entry deleted successfully."));
	}
}