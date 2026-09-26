package com.firstimpression.backend.Services;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.firstimpression.backend.Exception.ServiceException;
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
	private final UsageService usageService;

	// Fields from JD JSON that actually matter for tailoring.
	// Drops: company, additionalInfo, recruiter policy, EEO statement, location, employmentType.
	private static final String[] JD_KEEP_FIELDS = { "jobTitle", "seniority", "technicalSkills", "toolsAndPlatforms",
			"softSkills", "domainKnowledge", "responsibilities", "requiredQualifications", "preferredQualifications",
			"keywords" };

	// ── Centralized field config ─────────────────────────────────────────────────
	// What fields (+ id) are sent to Gemini from each section of the RESUME JSON.
	// Resume now uses profile-schema keys (workExperiences, title, etc.).
	private static final Map<String, String[]> RESUME_SECTION_FIELDS = Map.of(
		"workExperiences", new String[]{"id", "companyName", "jobTitle", "description", "technologies"},
		"projects",        new String[]{"id", "title", "description", "technologies"},
		"skills",          new String[]{"id", "title", "level"},
		"certifications",  new String[]{"id", "title", "issuedBy"}
	);

	// What fields (+ id) are sent to Gemini from each section of the PROFILE JSON.
	// ProfileResponse uses the same key names as the resume after schema alignment.
	private static final Map<String, String[]> PROFILE_SECTION_FIELDS = Map.of(
		"workExperiences", new String[]{"id", "companyName", "jobTitle", "description", "technologies"},
		"projects",        new String[]{"id", "title", "description", "technologies"},
		"skills",          new String[]{"id", "title", "level"},
		"certifications",  new String[]{"id", "title", "issuedBy"}
	);

	// Sections AI is allowed to alter (used in both tailor and update flows).
	private static final String[] ALTERABLE_SECTIONS = {"workExperiences", "projects", "skills", "certifications"};

	@Transactional(readOnly = true)
	public List<ResumeResponse> getUserResumes(Users user) {
		log.info("Fetching resumes for user: {}", user.getId());
		return resumeRepository.findByUserIdOrderByUpdatedAtDesc(user.getId()).stream().map(this::toResponse).toList();
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

		Resume resume = Resume.builder().user(user).templateSlug(request.getTemplateSlug()).title(title)
				.resumeDataJson(dataJson).status(1).build();

		Resume saved = resumeRepository.save(resume);
		return toResponse(saved);
	}

	@Transactional(readOnly = true)
	public ResumeResponse getResumeById(Users user, String resumeId) {
		log.info("Fetching resume: {} for user: {}", resumeId, user.getId());
		Resume resume = resumeRepository.findByIdAndUserId(resumeId, user.getId())
				.orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND, "Resume not found with ID: " + resumeId));
		return toResponse(resume);
	}

	@Transactional
	public void deleteResume(Users user, String resumeId) {
		log.info("Deleting resume: {} for user: {}", resumeId, user.getId());
		Resume resume = resumeRepository.findByIdAndUserId(resumeId, user.getId())
				.orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND, "Resume not found with ID: " + resumeId));
		resumeRepository.delete(resume);
	}

	@Transactional
	public ResumeResponse updateResume(Users user, String resumeId, ResumeCreateRequest request) {
		log.info("Updating resume: {} for user: {}", resumeId, user.getId());
		Resume resume = resumeRepository.findByIdAndUserId(resumeId, user.getId())
				.orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND, "Resume not found with ID: " + resumeId));

		
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
	
	
	public Map<String, Object> updateResume(Users user, String resumeId, String query) {
		return updateResume(user, resumeId, query, null);
	}

	public Map<String, Object> updateResume(Users user, String resumeId, String query, String clientResumeDataJson) {

		log.info("Inside ResumeService updating resume: {}, query: {}", resumeId, query);
 
		// 1. Validate query
		if (query == null || query.isBlank()) {
			return Map.of("message", "Query is empty");
		}
		

	    if(!usageService.queryAllowed(user))
	    	          throw new ServiceException(HttpStatus.TOO_MANY_REQUESTS, "Query Limit Exceeds.Try after 24 Hours");

		// 2. Fetch resume
		Resume resume = resumeRepository.findByIdAndUserId(resumeId, user.getId())
				.orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND, "Resume not found with ID: " + resumeId));

		// 3. Get original complete resume JSON (prefer live unsaved client JSON from Redux)
		String originalResumeJson = (clientResumeDataJson != null && !clientResumeDataJson.isBlank())
				? clientResumeDataJson
				: resume.getResumeDataJson();

		// 4. Create trimmed JSON for AI
		String currentResumeJson = buildTrimmedResumeJson(originalResumeJson);

		// 5. Build prompt
		String prompt = buildUpdatePrompt(currentResumeJson, query);

		log.info("Inside updateResume prompt: {}", prompt);

		// 6. Call AI
		long startTime = System.currentTimeMillis();

		String geminiResponse = geminiClientService.generateContent(prompt);

		log.info("AI resume update completed in {} ms", System.currentTimeMillis() - startTime);

		log.info("Gemini response: {}", geminiResponse);

		try {

			// 7. Parse Gemini response
			JsonNode updatedSections = sanitizeAndParseJson(geminiResponse);

			// 8. Validate Gemini response
			if (!updatedSections.isObject()) {
				throw new ServiceException(HttpStatus.INTERNAL_SERVER_ERROR, "Invalid AI response: expected JSON object");
			}

			// 9. Get message from Gemini
			String message = updatedSections.get("message").asText();
			
			//if there is no update in resume just return the msg — no save, no preview
			JsonNode resumeJson = updatedSections.get("resumeJson");

			if (resumeJson == null || !resumeJson.isObject()) {
			    return Map.of("message", message);
			}

			updatedSections = resumeJson;

			// Return ONLY the altered sections JSON from Gemini (no personalInformation/educations)
			String updatedResumeJson = objectMapper.writeValueAsString(updatedSections);

			log.info("update resume preview built (not saved): {}", resumeId);

			return Map.of("message", message, "updatedResumeDataJson", updatedResumeJson);

		} catch (ServiceException e) {
			throw e;
		} catch (Exception e) {

			log.error("Error while updating resume JSON", e);

			throw new ServiceException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to update resume JSON", e);
		}
	}


	public ResumeTailorResponse tailorResumeToJd(Users user, String resumeId) {
		return tailorResumeToJd(user, resumeId, null);
	}

	public ResumeTailorResponse tailorResumeToJd(Users user, String resumeId, String clientResumeDataJson) {
		log.info("Tailoring resume: {} to JD for user: {}", resumeId, user.getId());

		// 1. Fetch Resume
		Resume resume = resumeRepository.findByIdAndUserId(resumeId, user.getId())
				.orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND, "Resume not found with ID: " + resumeId));
		

	    if(!usageService.tailorAllowed(user))
	    	          throw new ServiceException(HttpStatus.TOO_MANY_REQUESTS, "Tailor Limit Exceeds.Try after 24 Hours");
 
		// 2. Fetch Job Description associated with this resumeId (or most recent for
		// user)
		JobDescription jd = jobDescriptionRepository
				.findFirstByUserIdAndResumeIdOrderByCreatedAtDesc(user.getId(), resumeId).orElseGet(() -> {
					List<JobDescription> userJds = jobDescriptionRepository
							.findByUserIdOrderByCreatedAtDesc(user.getId());
					if (userJds != null && !userJds.isEmpty()) {
						return userJds.get(0);
					}
					throw new ServiceException(HttpStatus.NOT_FOUND,
							"No Job Description found. Please upload or analyze a Job Description in the Resume Assistant first.");
				});

		// 3. Fetch Candidate's Master Profile
		ProfileResponse profile = profileService.getProfile(user);

		// 4. Build input representations (only 4 sections with master profile fields)
		String profileJson = buildTrimmedProfileJson(profile);
		String targetResumeJson = (clientResumeDataJson != null && !clientResumeDataJson.isBlank())
				? clientResumeDataJson
				: resume.getResumeDataJson();
		String currentResumeJson = buildTrimmedResumeJson(targetResumeJson);

		String rawJdJson = (jd.getJdJson() != null && !jd.getJdJson().isBlank()) ? jd.getJdJson()
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

		// 8. Return ONLY the altered sections payload from Gemini (no merging with old resume)
		String alteredDataJson = alteredNode.toString();

		// 9. Build and return response
		Object alteredDataObject = null;
		try {
			alteredDataObject = objectMapper.readValue(alteredDataJson, Object.class);
		} catch (Exception ignored) {
			alteredDataObject = alteredDataJson;
		}

		return ResumeTailorResponse.builder().resumeId(resume.getId()).title(resume.getTitle())
				.templateSlug(resume.getTemplateSlug()).alteredResumeData(alteredDataObject)
				.alteredResumeDataJson(alteredDataJson).gapInJdAndResume(gapInJdAndResume)
				.skillsNeed(skillsNeed).requiredSkills(new ArrayList<>(skillsNeed))
				.updatedAt(resume.getUpdatedAt()).build();
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

	/** Trims profile DTO to only the fields Gemini needs (uses PROFILE_SECTION_FIELDS). */
	private String buildTrimmedProfileJson(ProfileResponse profile) {
		if (profile == null) return "{}";
		JsonNode tree = objectMapper.valueToTree(profile);
		return buildTrimmedJson(tree, PROFILE_SECTION_FIELDS);
	}

	/** Trims stored resumeJson to only the fields Gemini needs (uses RESUME_SECTION_FIELDS). */
	private String buildTrimmedResumeJson(String resumeJson) {
		if (resumeJson == null || resumeJson.isBlank()) return "{}";
		try {
			return buildTrimmedJson(objectMapper.readTree(resumeJson), RESUME_SECTION_FIELDS);
		} catch (Exception e) {
			return "{}";
		}
	}

	/**
	 * Centralized trim: picks summary + 4 alterable sections from tree,
	 * keeping only the fields listed in sectionFields (always includes id).
	 */
	private String buildTrimmedJson(JsonNode tree, Map<String, String[]> sectionFields) {
		if (tree == null || !tree.isObject()) return "{}";
		try {
			ObjectNode trimmed = objectMapper.createObjectNode();

			// Summary — top-level summary string only
			if (tree.hasNonNull("summary") && !tree.get("summary").asText().isBlank()) {
				trimmed.set("summary", tree.get("summary"));
			}

			// 4 alterable sections — each trimmed to its allowed fields + id
			for (String section : ALTERABLE_SECTIONS) {
				JsonNode arr = tree.get(section);
				if (arr != null && arr.isArray()) {
					ArrayNode out = trimSectionForAI(arr, sectionFields.get(section));
					if (!out.isEmpty()) trimmed.set(section, out);
				}
			}

			return objectMapper.writeValueAsString(trimmed);
		} catch (Exception e) {
			return "{}";
		}
	}

	/**
	 * Picks only the specified fields (always including id) from each item in an array.
	 * Used by both resume and profile trimming.
	 */
	private ArrayNode trimSectionForAI(JsonNode array, String[] fields) {
		ArrayNode out = objectMapper.createArrayNode();
		if (array == null || fields == null) return out;
		for (JsonNode item : array) {
			if (!item.isObject()) continue;
			ObjectNode obj = objectMapper.createObjectNode();
			// id is always included if present
			if (item.hasNonNull("id")) obj.set("id", item.get("id"));
			for (String f : fields) {
				if (!f.equals("id") && item.hasNonNull(f)) obj.set(f, item.get(f));
			}
			if (obj.size() > 0) out.add(obj);
		}
		return out;
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
				3. Under "skillsNeed", list ONLY the key skills/technologies from the Job Description that the candidate is MISSING (unmatched skills) as a simple JSON string array: ["Skill 1", "Skill 2"] (3-4 most important skills).
				4. Under "gapInJdAndResume", list identified gaps between JD and candidate background. (3-4 most important gaps)
                5. Most Important: Rewrite each project description as exactly 4-5 concise ATS-focused bullet points. Prioritize relevant JD skills while using only facts from the Master Profile. Never invent technologies, features, metrics, or responsibilities.
				REQUIRED JSON SCHEMA:
				{
				  "alteredResumeData": {
				      "summary": "Tailored 3-4 sentence high-impact ATS professional summary..."
				    "workExperiences": [
				      {
				        "id": "<preserve exact id from input>",
				        "companyName": "Company",
				        "jobTitle": "Job Title",
				        "description": "Tailored ATS-optimized description",
				        "technologies": ["Tech1", "Tech2"]
				      }
				    ],
				    "projects": [
				      {
				        "id": "<preserve exact id from input>",
				        "title": "Project Title",
				        "description": "Tailored project description(4-5 concise ATS-focused points per project.)",
				        "technologies": ["Tech1", "Tech2"]
				      }
				    ],
				    "skills": [{"id": "<preserve exact id>", "title": "...", "level": "..."}],
				    "certifications": [{"id": "<preserve exact id>", "title": "...", "issuedBy": "..."}]
				  },
				  "gapInJdAndResume": ["Identified gap 1", "Identified gap 2"],
				  "skillsNeed": ["Skill1", "Skill2"]
				}
				IMPORTANT: Always include the exact "id" from the input for every item in workExperiences, projects, skills, and certifications. Never change, invent, or omit ids.
				Return ONLY valid JSON.
				"""
				.formatted(jdContent, profileJson, currentResumeJson);
		log.debug("Built tailor prompt (trimmed), length={} chars", prompt.length());
		return prompt;
	}

	private String buildUpdatePrompt(String currentJdJson, String userQuery) {
		String template = """
				 You are an AI Resume Data Editor.

        You are given the current structured Resume JSON and a user instruction.

        CURRENT RESUME JSON:

        {CURRENT_JSON}

        USER INSTRUCTION:

        {USER_QUERY}

        Determine whether the user's instruction requires a change to the resume.
        IMPORTANT OUTPUT RULE:
        If the user instruction does NOT require any change to the resume, DO NOT return, copy, repeat, or include the current resume data in the response.
        In such cases, return ONLY:
        {
          "message": "Short message explaining why no resume update was made."
        }
        If the user instruction DOES require a resume change, return:
        {
          "message": "Short 1-2 line description of the change.",
          "resumeJson": { updated resume JSON }
        }
        RULES:
        1. Modify only what the user's instruction requires.
        2. Preserve all unrelated existing information, keys, values, and structure exactly.
        3. Do not invent, fabricate, assume, or add information that is not supported by the existing resume.
        4. If the user asks to add information, add it only to the appropriate existing field.
        5. If the user asks to remove information, remove only the specifically requested information.
        6. Keep the existing JSON structure and field names unchanged.
        7. Do not create new sections or fields unless explicitly required by the user's instruction.
        8. When a resume change is required, return the complete updated resumeJson, including unchanged sections.
        9. When no resume change is required, NEVER return resumeJson. Do not copy or repeat CURRENT_RESUME_JSON.
        10. Return ONLY valid JSON.
        11. Do not use Markdown or code fences.
        12. The response may contain ONLY these fields:
            - "message"
            - "resumeJson" only when an actual resume change is required.
				""";

		return template.replace("{CURRENT_JSON}", currentJdJson != null ? currentJdJson : "{}").replace("{USER_QUERY}",
				userQuery);
	}

	private JsonNode sanitizeAndParseJson(String raw) {
		if (raw == null || raw.isBlank()) {
			throw new ServiceException(HttpStatus.INTERNAL_SERVER_ERROR, "Empty response received from AI model.");
		}

		String cleaned = raw.trim();
		if (cleaned.startsWith("```json"))
			cleaned = cleaned.substring(7);
		else if (cleaned.startsWith("```"))
			cleaned = cleaned.substring(3);
		if (cleaned.endsWith("```"))
			cleaned = cleaned.substring(0, cleaned.length() - 3);
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
				throw new ServiceException(HttpStatus.INTERNAL_SERVER_ERROR,
						"AI generated response could not be parsed as valid JSON: " + primaryEx.getMessage(),
						primaryEx);
			}
		}
	}

	private ResumeResponse toResponse(Resume resume) {
		return ResumeResponse.builder().id(resume.getId()).templateSlug(resume.getTemplateSlug())
				.title(resume.getTitle()).resumeDataJson(resume.getResumeDataJson()).createdAt(resume.getCreatedAt())
				.updatedAt(resume.getUpdatedAt()).build();
	}
}
