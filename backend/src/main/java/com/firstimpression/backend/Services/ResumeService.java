package com.firstimpression.backend.Services;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.firstimpression.backend.Repository.ResumeRepository;
import com.firstimpression.backend.dto.ResumeCreateRequest;
import com.firstimpression.backend.dto.ResumeResponse;
import com.firstimpression.backend.model.Resume;
import com.firstimpression.backend.model.Users;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class ResumeService {

	private final ResumeRepository resumeRepository;

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
