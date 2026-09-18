package com.firstimpression.backend.Services.ai;

import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.apache.poi.xwpf.extractor.XWPFWordExtractor;
import org.apache.poi.xwpf.usermodel.XWPFDocument;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.firstimpression.backend.Repository.JobDescriptionRepository;
import com.firstimpression.backend.Repository.ResumeRepository;
import com.firstimpression.backend.Services.FileUploadService;
import com.firstimpression.backend.dto.JdUpdateResponse;
import com.firstimpression.backend.model.JobDescription;
import com.firstimpression.backend.model.Resume;
import com.firstimpression.backend.model.Users;

@Service
public class JdService {

    private static final Logger log = LoggerFactory.getLogger(JdService.class);

    private final GeminiClientService geminiClientService;
    private final JobDescriptionRepository jobDescriptionRepository;
    private final ResumeRepository resumeRepository;
    private final FileUploadService fileUploadService;
    private final ObjectMapper objectMapper;

    public JdService(GeminiClientService geminiClientService,
                     JobDescriptionRepository jobDescriptionRepository,
                     ResumeRepository resumeRepository,
                     FileUploadService fileUploadService,
                     ObjectMapper objectMapper) {
        this.geminiClientService = geminiClientService;
        this.jobDescriptionRepository = jobDescriptionRepository;
        this.resumeRepository = resumeRepository;
        this.fileUploadService = fileUploadService;
        this.objectMapper = objectMapper;
    }

    public JobDescription uploadJd(MultipartFile file, String text, String resumeId, Users user) throws IOException {
        String rawText;
        String inputType;
        String fileName = null;

        if (file != null && !file.isEmpty()) {
            MultipartFile docFile = fileUploadService.processDocument(file);
            fileName = docFile.getOriginalFilename();
            String lowerName = (fileName != null ? fileName : "").toLowerCase();

            if (lowerName.endsWith(".pdf")) {
                rawText = extractTextFromPdf(docFile.getInputStream());
                inputType = "PDF";
            } else if (lowerName.endsWith(".docx")) {
                rawText = extractTextFromDocx(docFile.getInputStream());
                inputType = "DOCX";
            } else if (lowerName.endsWith(".txt")) {
                rawText = new String(docFile.getBytes(), StandardCharsets.UTF_8);
                inputType = "TEXT";
            } else {
                throw new IllegalArgumentException("Unsupported file type: " + fileName + ". Supported types: PDF, DOCX, TXT");
            }
        } else if (text != null && !text.trim().isEmpty()) {
            rawText = text.trim();
            inputType = "TEXT";
        } else {
            throw new IllegalArgumentException("Either a file (PDF/DOCX/TXT) or plain text must be provided.");
        }

        String cleanedText = cleanJdText(rawText);
        if (cleanedText.isBlank()) {
            throw new IllegalArgumentException("Extracted job description text is empty.");
        }

        String prompt = buildExtractionPrompt(cleanedText);
        String jsonResponse = geminiClientService.generateContent(prompt);

        try {
            objectMapper.readTree(jsonResponse);
        } catch (Exception e) {
            log.error("Failed to parse Gemini response as JSON: {}", jsonResponse, e);
            throw new IllegalArgumentException("Gemini returned invalid JSON structure for Job Description");
        }

        Resume resume = null;
        JobDescription jd = null;

        if (resumeId != null && !resumeId.isBlank()) {
            resume = resumeRepository.findByIdAndUserId(resumeId, user.getId()).orElse(null);
            List<JobDescription> existing = jobDescriptionRepository.findByUserIdAndResumeIdOrderByCreatedAtDesc(user.getId(), resumeId);
            if (existing != null && !existing.isEmpty()) {
                jd = existing.get(0);
            }
        }

        if (jd != null) {
            jd.setFileName(fileName);
            jd.setInputType(inputType);
            jd.setRawTxt(cleanedText);
            jd.setJdJson(jsonResponse);
        } else {
            jd = JobDescription.builder()
                    .user(user)
                    .resume(resume)
                    .fileName(fileName)
                    .inputType(inputType)
                    .rawTxt(cleanedText)
                    .jdJson(jsonResponse)
                    .status(1)
                    .build();
        }

        return jobDescriptionRepository.save(jd);
    }

    public Optional<JobDescription> getJdByResumeId(String resumeId, Users user) {
        if (resumeId == null || resumeId.isBlank() || user == null) {
            return Optional.empty();
        }
        return jobDescriptionRepository.findFirstByUserIdAndResumeIdOrderByCreatedAtDesc(user.getId(), resumeId);
    }

    public JdUpdateResponse updateJd(Long jdId, String userQuery, Users user) {
        if (userQuery == null || userQuery.trim().isEmpty()) {
            throw new IllegalArgumentException("User query cannot be empty.");
        }

        JobDescription jd = jobDescriptionRepository.findByIdAndUserId(jdId, user.getId())
                .orElseThrow(() -> new IllegalArgumentException("Job description not found or unauthorized: ID " + jdId));

        String prompt = buildUpdatePrompt(jd.getJdJson(), userQuery.trim());
        String jsonResponse = geminiClientService.generateContent(prompt);

        Object updatedNode;
        try {
            updatedNode = objectMapper.readTree(jsonResponse);
        } catch (Exception e) {
            throw new IllegalArgumentException("Gemini returned invalid JSON for updated Job Description");
        }

        boolean changed = !jsonResponse.trim().equals(jd.getJdJson() != null ? jd.getJdJson().trim() : "");

        if (changed) {
            jd.setJdJson(jsonResponse);
            jobDescriptionRepository.save(jd);
            return JdUpdateResponse.builder()
                    .changed(true)
                    .message("Job description updated successfully.")
                    .jd(updatedNode)
                    .build();
        } else {
            Object currentNode = null;
            try {
                currentNode = objectMapper.readTree(jd.getJdJson());
            } catch (Exception ignored) {}
            return JdUpdateResponse.builder()
                    .changed(false)
                    .message("No changes were made to the job description.")
                    .jd(currentNode != null ? currentNode : updatedNode)
                    .build();
        }
    }

    private String extractTextFromPdf(InputStream inputStream) throws IOException {
        try (PDDocument document = PDDocument.load(inputStream)) {
            return new PDFTextStripper().getText(document);
        }
    }

    private String extractTextFromDocx(InputStream inputStream) throws IOException {
        try (XWPFDocument document = new XWPFDocument(inputStream);
             XWPFWordExtractor extractor = new XWPFWordExtractor(document)) {
            return extractor.getText();
        }
    }

    private String cleanJdText(String text) {
        if (text == null) return "";
        return text.replace("\r\n", "\n").replace("\r", "\n")
                   .replaceAll("\n{3,}", "\n\n")
                   .replaceAll("[ \\t]+", " ")
                   .trim();
    }

    private String buildExtractionPrompt(String jdText) {
        String template = """
You are an expert AI Job Description Parser and Resume-Matching Analyst.

TASK: Read the JOB DESCRIPTION below and extract every piece of information useful for tailoring a resume to it. Think of yourself as an ATS + senior recruiter combined — pull out facts, don't summarize or paraphrase loosely.

JOB DESCRIPTION:
%s

CORE RULES:
1. Extract only what's stated or clearly implied in the JD. Never invent facts.
2. Use null / empty array when a field has no data — don't guess.
3. Split technical skills, tools, soft skills, and domain knowledge into separate buckets.
4. Separate "must-have" (required) from "nice-to-have" (preferred) qualifications.
5. Capture responsibilities as distinct, atomic bullet points — one duty per item.
6. Pull resume-matching keywords: exact terms, acronyms, tool names, certifications, methodologies (e.g. "Agile", "CI/CD", "Six Sigma") that an ATS would scan for.
7. Normalize duplicates/synonyms (e.g. "JS" and "JavaScript" → one entry), but preserve exact casing of proper nouns/tools (e.g. "AWS", "Kubernetes").
8. Preserve original meaning — don't editorialize.
9. If the JD contains info that doesn't fit a known field (e.g. team size, tech stack version, travel %, salary band, visa sponsorship, unique culture note) — DON'T drop it. Add it as new key(s) under an "additionalInfo" object, using clear self-describing key names.
10. Output ONLY valid JSON. No markdown, no ```json fences, no commentary, no trailing text.
11. Schema below is a MINIMUM baseline, NOT a fixed shape — add extra top-level keys freely whenever the JD has relevant info that doesn't cleanly map to existing fields. Never force-fit data into wrong field just to avoid adding a key.

BASELINE SCHEMA (extend as needed):
{
  "jobTitle": "string or null",
  "company": "string or null",
  "seniority": "string or null",
  "location": "string or null",
  "employmentType": "string or null",
  "technicalSkills": ["string"],
  "toolsAndPlatforms": ["string"],
  "softSkills": ["string"],
  "domainKnowledge": ["string"],
  "responsibilities": ["string"],
  "requiredQualifications": ["string"],
  "preferredQualifications": ["string"],
  "certifications": ["string"],
  "keywords": ["string"],
  "additionalInfo": {}
}

Return the complete, extended JSON. Nothing else.
""";
        return template.replace("%s", jdText);
    }

    private String buildUpdatePrompt(String currentJdJson, String userQuery) {
        String template = """
You are an AI Job Description Editor.

You are given the current structured Job Description and a user instruction.

CURRENT JOB DESCRIPTION JSON:
{CURRENT_JSON}

USER INSTRUCTION:
{USER_QUERY}

Your task is to determine what changes, if any, should be made to the Job Description.

Rules:
1. Modify only what the user's instruction requires.
2. Preserve all unrelated existing information, keys, and values.
3. Do not invent information.
4. Do not remove information unless the user explicitly asks for it.
5. If the user asks to add a skill, add it to the appropriate skill field.
6. If the user asks to remove a skill, remove it from the appropriate field.
7. If the user asks to modify a value, modify only that value.
8. Avoid duplicate skills or keywords.
9. If the user's request does not require a modification (such as questions, summaries, or general inquiries), return the existing JSON unchanged.
10. Return the complete updated JSON.
11. Return ONLY valid JSON.
12. Do not return Markdown.
13. Do not wrap JSON inside ```json.
""";
        return template.replace("{CURRENT_JSON}", currentJdJson != null ? currentJdJson : "{}")
                       .replace("{USER_QUERY}", userQuery);
    }
}