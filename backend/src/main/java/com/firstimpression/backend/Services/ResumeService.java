package com.firstimpression.backend.Services;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.firstimpression.backend.Repository.JobDescriptionRepository;
import com.firstimpression.backend.Repository.ResumeRepository;
import com.firstimpression.backend.Services.ai.GeminiClientService;
import com.firstimpression.backend.dto.ProfileResponse;
import com.firstimpression.backend.dto.ResumeCreateRequest;
import com.firstimpression.backend.dto.ResumeResponse;
import com.firstimpression.backend.dto.ResumeTailorResponse;
import com.firstimpression.backend.model.JobDescription;
import com.firstimpression.backend.model.Resume;
import com.firstimpression.backend.model.Users;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class ResumeService {

	private final ResumeRepository resumeRepository;
	private final JobDescriptionRepository jobDescriptionRepository;
	private final ProfileService profileService;
	private final GeminiClientService geminiClientService;
	private final ObjectMapper objectMapper;

	// Fields from JD JSON that actually matter for tailoring.
	// Drops: company, additionalInfo, recruiter policy, EEO statement, location, employmentType.
	private static final String[] JD_KEEP_FIELDS = {
			"jobTitle", "seniority", "technicalSkills", "toolsAndPlatforms",
			"softSkills", "domainKnowledge", "responsibilities",
			"requiredQualifications", "preferredQualifications", "keywords"
	};

	// Fields from master profile that matter. Drops photoUrl/avatar/auth/etc.
	private static final String[] PROFILE_KEEP_FIELDS = {
			 "workExperiences",
			"projects", "skills", "certifications"
	};

	@Transactional(readOnly = true)
	public List<ResumeResponse> getUserResumes(Users user) {
		log.info("Fetching resumes for user: {}", user.getId());
		return resumeRepository.findByUserIdOrderByUpdatedAtDesc(user.getId())
				.stream()
				.map(this::toResponse)
				.toList();
	}

	@Transactional
	public ResumeResponse createResume(Users user, ResumeCreateRequest request) {
		log.info("Creating new resume for user: {} with template: {}", user.getId(), request.getTemplateSlug());

		String title = request.getTitle();
		if (title == null || title.isBlank()) {
			title = "My Resume (" + request.getTemplateSlug() + ")";
		}

		String dataJson = request.getResumeDataJson();
		if (dataJson == null || dataJson.isBlank()) {
			dataJson = "{}";
		}

		Resume resume = Resume.builder()
				.user(user)
				.templateSlug(request.getTemplateSlug())
				.title(title)
				.resumeDataJson(dataJson)
				.status(1)
				.build();

		Resume saved = resumeRepository.save(resume);
		return toResponse(saved);
	}

	@Transactional(readOnly = true)
	public ResumeResponse getResumeById(Users user, String resumeId) {
		log.info("Fetching resume: {} for user: {}", resumeId, user.getId());
		Resume resume = resumeRepository.findByIdAndUserId(resumeId, user.getId())
				.orElseThrow(() -> new RuntimeException("Resume not found with ID: " + resumeId));
		return toResponse(resume);
	}

	@Transactional
	public void deleteResume(Users user, String resumeId) {
		log.info("Deleting resume: {} for user: {}", resumeId, user.getId());
		Resume resume = resumeRepository.findByIdAndUserId(resumeId, user.getId())
				.orElseThrow(() -> new RuntimeException("Resume not found with ID: " + resumeId));
		resumeRepository.delete(resume);
	}

	@Transactional
	public ResumeResponse updateResume(Users user, String resumeId, ResumeCreateRequest request) {
		log.info("Updating resume: {} for user: {}", resumeId, user.getId());
		Resume resume = resumeRepository.findByIdAndUserId(resumeId, user.getId())
				.orElseThrow(() -> new RuntimeException("Resume not found with ID: " + resumeId));

		if (request.getTitle() != null && !request.getTitle().isBlank()) {
			resume.setTitle(request.getTitle());
		}
		if (request.getResumeDataJson() != null && !request.getResumeDataJson().isBlank()) {
			resume.setResumeDataJson(request.getResumeDataJson());
		}
		if (request.getTemplateSlug() != null && !request.getTemplateSlug().isBlank()) {
			resume.setTemplateSlug(request.getTemplateSlug());
		}

		Resume updated = resumeRepository.save(resume);
		return toResponse(updated);
	}

	public ResumeTailorResponse tailorResumeToJd(Users user, String resumeId) {
		log.info("Tailoring resume: {} to JD for user: {}", resumeId, user.getId());

		// 1. Fetch Resume
		Resume resume = resumeRepository.findByIdAndUserId(resumeId, user.getId())
				.orElseThrow(() -> new RuntimeException("Resume not found with ID: " + resumeId));

		// 2. Fetch Job Description associated with this resumeId (or most recent for user)
		JobDescription jd = jobDescriptionRepository.findFirstByUserIdAndResumeIdOrderByCreatedAtDesc(user.getId(), resumeId)
				.orElseGet(() -> {
					List<JobDescription> userJds = jobDescriptionRepository.findByUserIdOrderByCreatedAtDesc(user.getId());
					if (userJds != null && !userJds.isEmpty()) {
						return userJds.get(0);
					}
					throw new RuntimeException("No Job Description found. Please upload or analyze a Job Description in the Resume Assistant first.");
				});

		// 3. Fetch Candidate's Master Profile
		ProfileResponse profile = profileService.getProfile(user);

		// 4. Build input representations (only 4 sections with master profile fields)
		String profileJson = buildTrimmedProfileJson(profile);
		String currentResumeJson = buildTrimmedResumeJson(resume.getResumeDataJson());

		String rawJdJson = (jd.getJdJson() != null && !jd.getJdJson().isBlank())
				? jd.getJdJson()
				: (jd.getRawTxt() != null ? jd.getRawTxt() : "{}");
		String jdContent = buildTrimmedJdJson(rawJdJson);

		// 5. Build prompt
		String prompt = buildTailorPrompt(jdContent, profileJson, currentResumeJson);
		
		log.info("inside tailorResumeToJd prompt -():{}", prompt);

		// 6. Call AI
		long startTime = System.currentTimeMillis();
		String geminiResponse = geminiClientService.generateContent(prompt);
		log.info("AI resume tailoring completed in {} ms", System.currentTimeMillis() - startTime);
		log.info("inside tailorResumeToJd gemini Response-():{}", geminiResponse);

		// 7. Parse response directly
		JsonNode rootNode = sanitizeAndParseJson(geminiResponse);
		JsonNode alteredNode = rootNode.has("alteredResumeData") ? rootNode.get("alteredResumeData") : rootNode;

		String reasoning = rootNode.has("reasoning") ? rootNode.get("reasoning").asText() : "Resume tailored to match key job description requirements.";

		List<String> gapInJdAndResume = new ArrayList<>();
		if (rootNode.has("gapInJdAndResume")) {
			if (rootNode.get("gapInJdAndResume").isArray()) {
				for (JsonNode item : rootNode.get("gapInJdAndResume")) {
					gapInJdAndResume.add(item.asText());
				}
			} else if (rootNode.get("gapInJdAndResume").isTextual()) {
				gapInJdAndResume.add(rootNode.get("gapInJdAndResume").asText());
			}
		}

		// Extract skillsNeed (unmatched skills only)
		List<String> skillsNeed = new ArrayList<>();
		JsonNode skillsNode = rootNode.has("skillsNeed") ? rootNode.get("skillsNeed") : rootNode.get("requiredSkills");
		if (skillsNode != null && skillsNode.isArray()) {
			for (JsonNode s : skillsNode) {
				skillsNeed.add(s.isTextual() ? s.asText() : s.path("skill").asText());
			}
		}

		// 8. Fetch original resume and alter ONLY the 4 sections
		String originalResumeJson = resume.getResumeDataJson() != null && !resume.getResumeDataJson().isBlank()
				? resume.getResumeDataJson()
				: "{}";
		ObjectNode finalResumeNode;
		try {
			JsonNode parsedOriginal = objectMapper.readTree(originalResumeJson);
			finalResumeNode = parsedOriginal.isObject() ? ((ObjectNode) parsedOriginal).deepCopy() : objectMapper.createObjectNode();
		} catch (Exception e) {
			finalResumeNode = objectMapper.createObjectNode();
		}

		// Alter Section 1: Work Experience
		JsonNode newExperiences = alteredNode.has("workExperiences")
				? alteredNode.get("workExperiences")
				: alteredNode.get("experience");
		if (newExperiences != null && newExperiences.isArray()) {
			ArrayNode formattedExperiences = objectMapper.createArrayNode();
			for (JsonNode expItem : newExperiences) {
				if (expItem.isObject()) {
					ObjectNode expObj = ((ObjectNode) expItem).deepCopy();
					if (expObj.hasNonNull("companyName") && !expObj.hasNonNull("company")) {
						expObj.set("company", expObj.get("companyName"));
					} else if (expObj.hasNonNull("company") && !expObj.hasNonNull("companyName")) {
						expObj.set("companyName", expObj.get("company"));
					}
					if (expObj.hasNonNull("jobTitle") && !expObj.hasNonNull("role")) {
						expObj.set("role", expObj.get("jobTitle"));
					} else if (expObj.hasNonNull("role") && !expObj.hasNonNull("jobTitle")) {
						expObj.set("jobTitle", expObj.get("role"));
					}
					formattedExperiences.add(expObj);
				} else {
					formattedExperiences.add(expItem);
				}
			}
			if (finalResumeNode.has("experience")) {
				finalResumeNode.set("experience", formattedExperiences);
			} else {
				finalResumeNode.set("workExperiences", formattedExperiences);
			}
		}

		// Alter Section 2: Projects
		if (alteredNode.has("projects") && alteredNode.get("projects").isArray()) {
			ArrayNode formattedProjects = objectMapper.createArrayNode();
			for (JsonNode projItem : alteredNode.get("projects")) {
				if (projItem.isObject()) {
					ObjectNode projObj = ((ObjectNode) projItem).deepCopy();
					if (projObj.hasNonNull("title") && !projObj.hasNonNull("name")) {
						projObj.set("name", projObj.get("title"));
					} else if (projObj.hasNonNull("name") && !projObj.hasNonNull("title")) {
						projObj.set("title", projObj.get("name"));
					}
					formattedProjects.add(projObj);
				} else {
					formattedProjects.add(projItem);
				}
			}
			finalResumeNode.set("projects", formattedProjects);
		}

		// Alter Section 3: Skills
		if (alteredNode.has("skills") && alteredNode.get("skills").isArray()) {
			ArrayNode formattedSkills = objectMapper.createArrayNode();
			for (JsonNode skItem : alteredNode.get("skills")) {
				if (skItem.isObject()) {
					ObjectNode skObj = ((ObjectNode) skItem).deepCopy();
					String title = skObj.hasNonNull("title") ? skObj.get("title").asText()
							: (skObj.hasNonNull("name") ? skObj.get("name").asText() : "");
					if (!title.isBlank()) {
						skObj.put("title", title);
						skObj.put("name", title);
					}
					formattedSkills.add(skObj);
				} else {
					formattedSkills.add(skItem);
				}
			}
			finalResumeNode.set("skills", formattedSkills);
		}

		// Alter Section 4: Certifications
		if (alteredNode.has("certifications") && alteredNode.get("certifications").isArray()) {
			ArrayNode formattedCerts = objectMapper.createArrayNode();
			for (JsonNode certItem : alteredNode.get("certifications")) {
				if (certItem.isObject()) {
					ObjectNode certObj = ((ObjectNode) certItem).deepCopy();
					if (certObj.hasNonNull("title") && !certObj.hasNonNull("name")) {
						certObj.set("name", certObj.get("title"));
					} else if (certObj.hasNonNull("name") && !certObj.hasNonNull("title")) {
						certObj.set("title", certObj.get("name"));
					}
					if (certObj.hasNonNull("issuedBy") && !certObj.hasNonNull("issuer")) {
						certObj.set("issuer", certObj.get("issuedBy"));
					} else if (certObj.hasNonNull("issuer") && !certObj.hasNonNull("issuedBy")) {
						certObj.set("issuedBy", certObj.get("issuer"));
					}
					formattedCerts.add(certObj);
				} else {
					formattedCerts.add(certItem);
				}
			}
			finalResumeNode.set("certifications", formattedCerts);
		}

		String alteredDataJson = finalResumeNode.toString();
		resume.setResumeDataJson(alteredDataJson);
		Resume savedResume = resumeRepository.save(resume);

		// 9. Build and return response
		Object alteredDataObject = null;
		try {
			alteredDataObject = objectMapper.readValue(alteredDataJson, Object.class);
		} catch (Exception ignored) {
			alteredDataObject = alteredDataJson;
		}

		return ResumeTailorResponse.builder()
				.resumeId(savedResume.getId())
				.title(savedResume.getTitle())
				.templateSlug(savedResume.getTemplateSlug())
				.alteredResumeData(alteredDataObject)
				.alteredResumeDataJson(alteredDataJson)
				.reasoning(reasoning)
				.gapInJdAndResume(gapInJdAndResume)
				.skillsNeed(skillsNeed)
				.requiredSkills(new ArrayList<>(skillsNeed))
				.updatedAt(savedResume.getUpdatedAt())
				.build();
	}

	/**
	 * Strips JD JSON down to only the fields relevant for tailoring.
	 */
	private String buildTrimmedJdJson(String rawJdJson) {
		try {
			JsonNode fullJd = objectMapper.readTree(rawJdJson);
			if (!fullJd.isObject()) {
				return rawJdJson;
			}
			ObjectNode trimmed = objectMapper.createObjectNode();
			for (String field : JD_KEEP_FIELDS) {
				if (fullJd.has(field)) {
					trimmed.set(field, fullJd.get(field));
				}
			}
			return objectMapper.writeValueAsString(trimmed);
		} catch (Exception e) {
			return rawJdJson;
		}
	}

	/**
	 * Extracts only the 4 core sections (workExperiences, projects, skills, certifications)
	 * retaining only the allowed fields from the candidate master profile.
	 */
	private String buildTrimmedProfileJson(ProfileResponse profile) {
		if (profile == null) return "{}";
		return trimFourSections(objectMapper.valueToTree(profile));
	}

	/**
	 * Extracts only the 4 core sections from the current resume JSON, matching the exact fields taken in master profile.
	 */
	private String buildTrimmedResumeJson(String resumeJson) {
		if (resumeJson == null || resumeJson.isBlank()) return "{}";
		try {
			JsonNode tree = objectMapper.readTree(resumeJson);
			return trimFourSections(tree);
		} catch (Exception e) {
			return "{}";
		}
	}

	private String trimFourSections(JsonNode tree) {
		if (tree == null || !tree.isObject()) return "{}";
		try {
			ObjectNode trimmed = objectMapper.createObjectNode();

			// 1. Work Experiences
			String expKey = tree.has("workExperiences") ? "workExperiences" : (tree.has("experience") ? "experience" : null);
			if (expKey != null && tree.get(expKey).isArray()) {
				ArrayNode arr = objectMapper.createArrayNode();
				for (JsonNode item : tree.get(expKey)) {
					ObjectNode obj = objectMapper.createObjectNode();
					if (item.hasNonNull("companyName")) obj.set("companyName", item.get("companyName"));
					else if (item.hasNonNull("company")) obj.set("companyName", item.get("company"));

					if (item.hasNonNull("jobTitle")) obj.set("jobTitle", item.get("jobTitle"));
					else if (item.hasNonNull("role")) obj.set("jobTitle", item.get("role"));
					else if (item.hasNonNull("title")) obj.set("jobTitle", item.get("title"));

					if (item.hasNonNull("description")) obj.set("description", item.get("description"));

					if (item.hasNonNull("technologies")) obj.set("technologies", item.get("technologies"));
					else if (item.hasNonNull("highlights")) obj.set("technologies", item.get("highlights"));

					if (!obj.isEmpty()) arr.add(obj);
				}
				if (!arr.isEmpty()) trimmed.set("workExperiences", arr);
			}

			// 2. Projects
			if (tree.has("projects") && tree.get("projects").isArray()) {
				ArrayNode arr = objectMapper.createArrayNode();
				for (JsonNode item : tree.get("projects")) {
					ObjectNode obj = objectMapper.createObjectNode();
					if (item.hasNonNull("title")) obj.set("title", item.get("title"));
					else if (item.hasNonNull("name")) obj.set("title", item.get("name"));

					if (item.hasNonNull("description")) obj.set("description", item.get("description"));
					if (item.hasNonNull("technologies")) obj.set("technologies", item.get("technologies"));

					if (!obj.isEmpty()) arr.add(obj);
				}
				if (!arr.isEmpty()) trimmed.set("projects", arr);
			}

			// 3. Skills
			if (tree.has("skills") && tree.get("skills").isArray()) {
				ArrayNode arr = objectMapper.createArrayNode();
				for (JsonNode item : tree.get("skills")) {
					if (item.isObject()) {
						ObjectNode obj = objectMapper.createObjectNode();
						if (item.hasNonNull("title")) obj.set("title", item.get("title"));
						else if (item.hasNonNull("name")) obj.set("title", item.get("name"));
						if (item.hasNonNull("category")) obj.set("category", item.get("category"));
						if (item.hasNonNull("items")) obj.set("items", item.get("items"));
						if (!obj.isEmpty()) arr.add(obj);
					} else if (item.isTextual()) {
						arr.add(item);
					}
				}
				if (!arr.isEmpty()) trimmed.set("skills", arr);
			}

			// 4. Certifications
			if (tree.has("certifications") && tree.get("certifications").isArray()) {
				ArrayNode arr = objectMapper.createArrayNode();
				for (JsonNode item : tree.get("certifications")) {
					ObjectNode obj = objectMapper.createObjectNode();
					if (item.hasNonNull("title")) obj.set("title", item.get("title"));
					else if (item.hasNonNull("name")) obj.set("title", item.get("name"));

					if (item.hasNonNull("issuedBy")) obj.set("issuedBy", item.get("issuedBy"));
					else if (item.hasNonNull("issuer")) obj.set("issuedBy", item.get("issuer"));

					if (!obj.isEmpty()) arr.add(obj);
				}
				if (!arr.isEmpty()) trimmed.set("certifications", arr);
			}

			return objectMapper.writeValueAsString(trimmed);
		} catch (Exception e) {
			return "{}";
		}
	}

	private String buildTailorPrompt(String jdContent, String profileJson, String currentResumeJson) {
		String prompt = """
				You are an expert ATS Resume Strategist and Technical Recruiter.

				TASK:
				Tailor the candidate's 4 core sections (work experiences, projects, skills, certifications) for the TARGET JOB DESCRIPTION.
				Use the Candidate's Master Profile as ground truth. Never invent experience.

				TARGET JOB REQUIREMENTS:
				%s

				CANDIDATE MASTER PROFILE (GROUND TRUTH - 4 SECTIONS):
				%s

				CURRENT RESUME (4 SECTIONS):
				%s
               
                IMPORTANT: Use ONLY the Master Profile as the source of truth; never invent or add fake data, technologies, features, metrics, achievements, or responsibilities—especially in project descriptions; only improve using existing facts.
				
				INSTRUCTIONS:
				1. Tailor and enhance ONLY these 4 sections (workExperiences, projects, skills, certifications) to align strongly with the Target Job Requirements while strictly respecting the candidate's real background.
				2. Under "alteredResumeData", output an object containing the 4 updated sections: "workExperiences", "projects", "skills", and "certifications".
				3. Under "skillsNeed", list ONLY the key skills/technologies from the Job Description that the candidate is MISSING (unmatched skills) as a simple JSON string array: ["Skill 1", "Skill 2"].
				4. Under "reasoning", explain the strategic adjustments made.
				5. Under "gapInJdAndResume", list identified gaps between JD and candidate background.
				6.Most Important is project description make it perfect.

				REQUIRED JSON SCHEMA:
				{
				  "alteredResumeData": {
				    "workExperiences": [
				      {
				        "companyName": "Company",
				        "jobTitle": "Job Title",
				        "description": "Tailored ATS-optimized description",
				        "technologies": ["Tech1", "Tech2"]
				      }
				    ],
				    "projects": [
				      {
				        "title": "Project Title",
				        "description": "Tailored project description(in 4-5 lines)",
				        "technologies": ["Tech1", "Tech2"]
				      }
				    ],
				    "skills": [ ... ],
				    "certifications": [ ... ]
				  },
				  "reasoning": "Strategic explanation of adjustments made",
				  "gapInJdAndResume": ["Identified gap 1", "Identified gap 2"],
				  "skillsNeed": ["Skill1", "Skill2"]
				}
				Return ONLY valid JSON.
				""".formatted(jdContent, profileJson, currentResumeJson);
		log.debug("Built tailor prompt (trimmed), length={} chars", prompt.length());
		return prompt;
	}

	private JsonNode sanitizeAndParseJson(String raw) {
		if (raw == null || raw.isBlank()) {
			throw new RuntimeException("Empty response received from AI model.");
		}

		String cleaned = raw.trim();
		if (cleaned.startsWith("```json")) cleaned = cleaned.substring(7);
		else if (cleaned.startsWith("```")) cleaned = cleaned.substring(3);
		if (cleaned.endsWith("```")) cleaned = cleaned.substring(0, cleaned.length() - 3);
		cleaned = cleaned.trim();

		int start = cleaned.indexOf('{');
		int end = cleaned.lastIndexOf('}');
		if (start != -1 && end > start) {
			cleaned = cleaned.substring(start, end + 1);
		}

		try {
			return objectMapper.readTree(cleaned);
		} catch (Exception primaryEx) {
			log.warn("Primary JSON parse failed ({}), attempting automatic repair...", primaryEx.getMessage());
			// Repair unclosed arrays before object close: [ \n } -> [] \n }
			String repaired = cleaned.replaceAll("(?s)\\[\\s*\\}", "[]}");
			// Repair trailing commas before object or array close
			repaired = repaired.replaceAll(",\\s*([\\}\\]])", "$1");
			try {
				return objectMapper.readTree(repaired);
			} catch (Exception secondaryEx) {
				log.error("Secondary JSON repair failed on: {}", cleaned, secondaryEx);
				throw new RuntimeException("AI generated response could not be parsed as valid JSON: " + primaryEx.getMessage(), primaryEx);
			}
		}
	}

	private ResumeResponse toResponse(Resume resume) {
		return ResumeResponse.builder()
				.id(resume.getId())
				.templateSlug(resume.getTemplateSlug())
				.title(resume.getTitle())
				.resumeDataJson(resume.getResumeDataJson())
				.createdAt(resume.getCreatedAt())
				.updatedAt(resume.getUpdatedAt())
				.build();
	}
}
