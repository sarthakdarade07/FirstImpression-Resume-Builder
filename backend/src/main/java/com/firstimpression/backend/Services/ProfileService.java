package com.firstimpression.backend.Services;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.firstimpression.backend.Repository.CertificationRepository;
import com.firstimpression.backend.Repository.EducationRepository;
import com.firstimpression.backend.Repository.EducationTypeRepository;
import com.firstimpression.backend.Repository.LanguageRepository;
import com.firstimpression.backend.Repository.PersonalInformationRepository;
import com.firstimpression.backend.Repository.ProjectRepository;
import com.firstimpression.backend.Repository.ScoreTypeRepository;
import com.firstimpression.backend.Repository.SkillRepository;
import com.firstimpression.backend.Repository.UsersRepository;
import com.firstimpression.backend.Repository.WorkExperienceRepository;
import com.firstimpression.backend.dto.CertificationRequest;
import com.firstimpression.backend.dto.CertificationResponse;
import com.firstimpression.backend.dto.EducationRequest;
import com.firstimpression.backend.dto.EducationResponse;
import com.firstimpression.backend.dto.EducationTypeResponse;
import com.firstimpression.backend.dto.LanguageRequest;
import com.firstimpression.backend.dto.LanguageResponse;
import com.firstimpression.backend.dto.PersonalInformationRequest;
import com.firstimpression.backend.dto.PersonalInformationResponse;
import com.firstimpression.backend.dto.ProfileResponse;
import com.firstimpression.backend.dto.ProjectRequest;
import com.firstimpression.backend.dto.ProjectResponse;
import com.firstimpression.backend.dto.ScoreTypeResponse;
import com.firstimpression.backend.dto.SkillRequest;
import com.firstimpression.backend.dto.SkillResponse;
import com.firstimpression.backend.dto.WorkExperienceRequest;
import com.firstimpression.backend.dto.WorkExperienceResponse;
import com.firstimpression.backend.model.Certification;
import com.firstimpression.backend.model.Education;
import com.firstimpression.backend.model.EducationType;
import com.firstimpression.backend.model.Language;
import com.firstimpression.backend.model.PersonalInformation;
import com.firstimpression.backend.model.Project;
import com.firstimpression.backend.model.ScoreType;
import com.firstimpression.backend.model.Skill;
import com.firstimpression.backend.model.Users;
import com.firstimpression.backend.model.WorkExperience;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class ProfileService {

	private final UsersRepository usersRepository;
	private final CertificationRepository certificationRepository;
	private final EducationRepository educationRepository;
	private final EducationTypeRepository educationTypeRepository;
	private final LanguageRepository languageRepository;
	private final PersonalInformationRepository personalInformationRepository;
	private final ProjectRepository projectRepository;
	private final ScoreTypeRepository scoreTypeRepository;
	private final SkillRepository skillRepository;
	private final WorkExperienceRepository workExperienceRepository;

	public ProfileResponse getProfile(Object principalObj) {
		log.info("Inside ProfileService - getProfile():{}", principalObj);

		Users principal = (Users) principalObj; 
		Users user = usersRepository.findById(principal.getId())
				.orElseThrow(() -> new RuntimeException("User not found"));
		
		return ProfileResponse.builder()
	            .personalInformation(toPersonalInformationResponse(user.getPersonalInformation()))
	            .educations(toEducationResponseList(user.getEducation()))
	            .workExperiences(toWorkExperienceResponseList(user.getWorkExperience()))
	            .projects(toProjectResponseList(user.getProjects()))
	            .skills(toSkillResponseList(user.getSkills()))
	            .certifications(toCertificationResponseList(user.getCertifications()))
	            .languages(toLanguageResponseList(user.getLanguages()))
	            .build();
	}

	public List<EducationTypeResponse> getEducationTypes() {
		return educationTypeRepository.findAll().stream()
				.map(et -> EducationTypeResponse.builder()
						.id(et.getId())
						.title(et.getTitle())
						.build())
				.toList();
	}

	public List<ScoreTypeResponse> getScoreTypes() {
		return scoreTypeRepository.findAll().stream()
				.map(st -> ScoreTypeResponse.builder()
						.id(st.getId())
						.title(st.getTitle())
						.build())
				.toList();
	}

	public Map<String, Object> getEducationMetadata() {
		return Map.of(
			"educationTypes", getEducationTypes(),
			"scoreTypes", getScoreTypes()
		);
	}

	@Transactional
	public Users updateName(Users principal, String newName) {
		log.info("Inside ProfileService - updateName() for user: {}", principal.getId());
		Users user = usersRepository.findById(principal.getId())
				.orElseThrow(() -> new RuntimeException("User not found"));

		user.setName(newName.trim());
		Users savedUser = usersRepository.save(user);

		// Synchronize personal information name if it exists
		personalInformationRepository.findByUser(user).ifPresent(info -> {
			info.setName(newName.trim());
			personalInformationRepository.save(info);
		});

		return savedUser;
	}

	@Transactional
	public void savePersonalInformation(PersonalInformationRequest req, Users user) {
		log.info("Inside ProfileService - savePersonalInformation for user: {}", user.getId());

		PersonalInformation info = personalInformationRepository.findByUser(user)
				.orElse(PersonalInformation.builder().user(user).build());

		info.setName(req.getName());
		info.setLocation(req.getLocation());
		info.setRole(req.getRole());
		info.setEmail(req.getEmail());
		info.setLinkedinUrl(req.getLinkedinUrl());
		info.setGithubUrl(req.getGithubUrl());
		info.setPortfolioUrl(req.getPortfolioUrl());
		info.setPhoneNo(req.getPhoneNo());
		info.setPhotoUrl(req.getPhotoUrl());

		personalInformationRepository.save(info);
	}

	@Transactional
	public void deletePersonalInformation(Users user) {
		log.info("Inside ProfileService - deletePersonalInformation for user: {}", user.getId());
		personalInformationRepository.deleteByUser(user);
	}

	@Transactional
	public void saveEducation(List<EducationRequest> req, Users user) {
		log.info("Inside ProfileService - saveEducation for user: {}", user.getId());
		educationRepository.deleteByUser(user);

		List<Education> educationList = new ArrayList<>();
		for (EducationRequest educationReq : req) {
			EducationType educationType = educationTypeRepository.findById(educationReq.getEducationTypeId())
					.orElseThrow(() -> new RuntimeException("Invalid Education Type"));

			ScoreType scoreType = scoreTypeRepository.findById(educationReq.getScoreTypeId())
					.orElseThrow(() -> new RuntimeException("Invalid Score Type"));

			Education edu = Education.builder()
					.user(user)
					.boardOrUniversity(educationReq.getBoardOrUniversity())
					.educationType(educationType)
					.endYear(educationReq.getEndYear())
					.instituteName(educationReq.getInstituteName())
					.score(educationReq.getScore())
					.scoreType(scoreType)
					.specialization(educationReq.getSpecialization())
					.startYear(educationReq.getStartYear())
					.build();

			educationList.add(edu);
		}
		educationRepository.saveAll(educationList);
	}

	@Transactional
	public void deleteEducation(int id, Users user) {
		log.info("Inside ProfileService - deleteEducation with id: {}", id);
		educationRepository.deleteByIdAndUser(id, user);
	}

	@Transactional
	public void saveCertifications(List<CertificationRequest> req, Users user) {
		log.info("Inside ProfileService - saveCertifications for user: {}", user.getId());
		certificationRepository.deleteByUser(user);

		List<Certification> certifications = new ArrayList<>();
		for (CertificationRequest certificationReq : req) {
			Certification certification = Certification.builder()
					.user(user)
					.title(certificationReq.getTitle())
					.issuedBy(certificationReq.getIssuedBy())
					.issueDate(certificationReq.getIssueDate())
					.expiryDate(certificationReq.getExpiryDate())
					.url(certificationReq.getUrl())
					.build();

			certifications.add(certification);
		}
		certificationRepository.saveAll(certifications);
	}

	@Transactional
	public void deleteCertification(int id, Users user) {
		log.info("Inside ProfileService - deleteCertification with id: {}", id);
		certificationRepository.deleteByIdAndUser(id, user);
	}
	
	@Transactional
	public void saveLanguages(List<LanguageRequest> req, Users user) {
	    log.info("Inside ProfileService - saveLanguages for user: {}", user.getId());
	    languageRepository.deleteByUser(user);

	    List<Language> languages = new ArrayList<>();
	    for (LanguageRequest languageReq : req) {
	        Language language = Language.builder()
	                .user(user)
	                .language(languageReq.getLanguage())
	                .level(languageReq.getLevel())
	                .build();

	        languages.add(language);
	    }
	    languageRepository.saveAll(languages);
	}

	@Transactional
	public void deleteLanguage(int id, Users user) {
		log.info("Inside ProfileService - deleteLanguage with id: {}", id);
		languageRepository.deleteByIdAndUser(id, user);
	}
	
	@Transactional
	public void saveProjects(List<ProjectRequest> req, Users user) {
	    log.info("Inside ProfileService - saveProjects for user: {}", user.getId());
	    projectRepository.deleteByUser(user);

	    List<Project> projects = new ArrayList<>();
	    for (ProjectRequest projectReq : req) {
	        Project project = Project.builder()
	                .user(user)
	                .title(projectReq.getTitle())
	                .description(projectReq.getDescription())
	                .technologies(projectReq.getTechnologies())
	                .projectLink(projectReq.getProjectLink())
	                .startDate(projectReq.getStartDate())
	                .endDate(projectReq.getEndDate())
	                .build();

	        projects.add(project);
	    }
	    projectRepository.saveAll(projects);
	}

	@Transactional
	public void deleteProject(int id, Users user) {
		log.info("Inside ProfileService - deleteProject with id: {}", id);
		projectRepository.deleteByIdAndUser(id, user);
	}
	
	@Transactional
	public void saveSkills(List<SkillRequest> req, Users user) {
	    log.info("Inside ProfileService - saveSkills for user: {}", user.getId());
	    skillRepository.deleteByUser(user);

	    List<Skill> skills = new ArrayList<>();
	    for (SkillRequest skillReq : req) {
	        Skill skill = Skill.builder()
	                .user(user)
	                .title(skillReq.getTitle())
	                .level(skillReq.getLevel())
	                .build();

	        skills.add(skill);
	    }
	    skillRepository.saveAll(skills);
	}

	@Transactional
	public void deleteSkill(int id, Users user) {
		log.info("Inside ProfileService - deleteSkill with id: {}", id);
		skillRepository.deleteByIdAndUser(id, user);
	}
	
	@Transactional
	public void saveWorkExperience(List<WorkExperienceRequest> req, Users user) {
	    log.info("Inside ProfileService - saveWorkExperience for user: {}", user.getId());
	    workExperienceRepository.deleteByUser(user);

	    List<WorkExperience> workExperiences = new ArrayList<>();
	    for (WorkExperienceRequest workReq : req) {
	        WorkExperience workExperience = WorkExperience.builder()
	                .user(user)
	                .companyName(workReq.getCompanyName())
	                .jobTitle(workReq.getJobTitle())
	                .location(workReq.getLocation())
	                .joinDate(workReq.getJoinDate())
	                .endDate(workReq.getEndDate())
	                .description(workReq.getDescription())
	                .technologies(workReq.getTechnologies())
	                .build();

	        workExperiences.add(workExperience);
	    }
	    workExperienceRepository.saveAll(workExperiences);
	}

	@Transactional
	public void deleteWorkExperience(int id, Users user) {
		log.info("Inside ProfileService - deleteWorkExperience with id: {}", id);
		workExperienceRepository.deleteByIdAndUser(id, user);
	}
	
	private PersonalInformationResponse toPersonalInformationResponse(PersonalInformation personalInformation) {
	    if (personalInformation == null) {
	        return null;
	    }

	    return PersonalInformationResponse.builder()
	            .name(personalInformation.getName())
	            .location(personalInformation.getLocation())
	            .role(personalInformation.getRole())
	            .email(personalInformation.getEmail())
	            .linkedinUrl(personalInformation.getLinkedinUrl())
	            .githubUrl(personalInformation.getGithubUrl())
	            .portfolioUrl(personalInformation.getPortfolioUrl())
	            .phoneNo(personalInformation.getPhoneNo())
	            .photoUrl(personalInformation.getPhotoUrl())
	            .build();
	}
	 
	private List<EducationResponse> toEducationResponseList(List<Education> educations) {
		if (educations == null) return List.of();
	    return educations.stream()
	            .map(e -> EducationResponse.builder()
	                    .id(e.getId())
	                    .educationTypeId(e.getEducationType() != null ? e.getEducationType().getId() : null)
	                    .educationType(e.getEducationType() != null ? e.getEducationType().getTitle() : null)
	                    .instituteName(e.getInstituteName())
	                    .scoreTypeId(e.getScoreType() != null ? e.getScoreType().getId() : null)
	                    .scoreType(e.getScoreType() != null ? e.getScoreType().getTitle() : null)
	                    .score(e.getScore())
	                    .startYear(e.getStartYear())
	                    .endYear(e.getEndYear())
	                    .boardOrUniversity(e.getBoardOrUniversity())
	                    .specialization(e.getSpecialization())
	                    .build())
	            .toList();
	}
	
	private List<WorkExperienceResponse> toWorkExperienceResponseList(List<WorkExperience> workExperiences) {
		if (workExperiences == null) return List.of();
	    return workExperiences.stream()
	            .map(w -> WorkExperienceResponse.builder()
	                    .id(w.getId())
	                    .companyName(w.getCompanyName())
	                    .jobTitle(w.getJobTitle())
	                    .location(w.getLocation())
	                    .joinDate(w.getJoinDate())
	                    .endDate(w.getEndDate())
	                    .description(w.getDescription())
	                    .technologies(w.getTechnologies())
	                    .build())
	            .toList();
	}
	
	private List<ProjectResponse> toProjectResponseList(List<Project> projects) {
		if (projects == null) return List.of();
	    return projects.stream()
	            .map(p -> ProjectResponse.builder()
	                    .id(p.getId())
	                    .title(p.getTitle())
	                    .description(p.getDescription())
	                    .technologies(p.getTechnologies())
	                    .projectLink(p.getProjectLink())
	                    .startDate(p.getStartDate())
	                    .endDate(p.getEndDate())
	                    .build())
	            .toList();
	}
	
	private List<SkillResponse> toSkillResponseList(List<Skill> skills) {
		if (skills == null) return List.of();
	    return skills.stream()
	            .map(s -> SkillResponse.builder()
	                    .id(s.getId())
	                    .title(s.getTitle())
	                    .level(s.getLevel())
	                    .build())
	            .toList();
	}
	
	private List<CertificationResponse> toCertificationResponseList(List<Certification> certifications) {
		if (certifications == null) return List.of();
	    return certifications.stream()
	            .map(c -> CertificationResponse.builder()
	                    .id(c.getId())
	                    .title(c.getTitle())
	                    .issuedBy(c.getIssuedBy())
	                    .issueDate(c.getIssueDate())
	                    .expiryDate(c.getExpiryDate())
	                    .url(c.getUrl())
	                    .build())
	            .toList();
	}
	
	private List<LanguageResponse> toLanguageResponseList(List<Language> languages) {
		if (languages == null) return List.of();
	    return languages.stream()
	            .map(l -> LanguageResponse.builder()
	                    .id(l.getId())
	                    .language(l.getLanguage())
	                    .level(l.getLevel())
	                    .build())
	            .toList();
	}
}