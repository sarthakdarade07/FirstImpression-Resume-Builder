package com.firstimpression.backend.templates.service;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.firstimpression.backend.templates.dto.TemplateCreateRequest;
import com.firstimpression.backend.templates.dto.TemplateResponse;
import com.firstimpression.backend.templates.dto.TemplateStructureDto;
import com.firstimpression.backend.templates.dto.TemplateSummaryResponse;
import com.firstimpression.backend.templates.dto.TemplateUpdateRequest;
import com.firstimpression.backend.templates.entity.Template;
import com.firstimpression.backend.templates.exception.TemplateNotFoundException;
import com.firstimpression.backend.templates.mapper.TemplateMapper;
import com.firstimpression.backend.templates.repository.TemplateRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class TemplateService {

	private final TemplateRepository templateRepository;
	private final TemplateMapper templateMapper;
	private final TemplateValidationService validationService;

	@Transactional(readOnly = true)
	public Page<TemplateSummaryResponse> getTemplates(Boolean status, String category, String search, Pageable pageable) {
		log.info("Fetching templates with status: {}, category: {}, search: {}", status, category, search);
		Page<Template> page = templateRepository.findTemplates(status, category, search, pageable);
		return page.map(templateMapper::toSummaryResponse);
	}

	@Transactional(readOnly = true)
	public List<TemplateSummaryResponse> getAllActiveTemplates() {
		log.info("Fetching all active templates");
		return templateRepository.findByStatus(true)
				.stream()
				.map(templateMapper::toSummaryResponse)
				.toList();
	}

	@Transactional(readOnly = true)
	public TemplateResponse getTemplateById(String id) {
		log.info("Fetching template by id: {}", id);
		Template template = templateRepository.findById(id)
				.orElseThrow(() -> new TemplateNotFoundException("Template not found with ID: " + id));
		return templateMapper.toResponse(template);
	}

	@Transactional(readOnly = true)
	public TemplateResponse getTemplateBySlug(String slug) {
		log.info("Fetching template by slug: {}", slug);
		Template template = templateRepository.findBySlug(slug.trim().toLowerCase())
				.orElseThrow(() -> new TemplateNotFoundException("Template not found with slug: " + slug));
		return templateMapper.toResponse(template);
	}

	@Transactional(readOnly = true)
	public TemplateResponse getTemplateByIdOrSlug(String idOrSlug) {
		log.info("Fetching template by id or slug: {}", idOrSlug);
		Template template = templateRepository.findById(idOrSlug)
				.or(() -> templateRepository.findBySlug(idOrSlug.trim().toLowerCase()))
				.orElseThrow(() -> new TemplateNotFoundException("Template not found with ID or Slug: " + idOrSlug));
		return templateMapper.toResponse(template);
	}

	@Transactional(readOnly = true)
	public TemplateStructureDto getTemplateStructure(String id) {
		log.info("Fetching template structure for id: {}", id);
		Template template = templateRepository.findById(id)
				.orElseThrow(() -> new TemplateNotFoundException("Template not found with ID: " + id));
		return templateMapper.toStructureDto(template);
	}

	@Transactional(readOnly = true)
	public String getTemplateCss(String id) {
		log.info("Fetching template CSS for id: {}", id);
		Template template = templateRepository.findById(id)
				.orElseThrow(() -> new TemplateNotFoundException("Template not found with ID: " + id));
		return template.getCssText();
	}

	@Transactional
	public TemplateResponse createTemplate(TemplateCreateRequest request) {
		log.info("Creating new template with slug: {}", request.getSlug());

		if (templateRepository.existsBySlug(request.getSlug().trim().toLowerCase())) {
			throw new IllegalArgumentException("Template with slug '" + request.getSlug() + "' already exists");
		}

		validationService.validateCreateRequest(request);

		Template template = templateMapper.toEntity(request);
		Template savedTemplate = templateRepository.save(template);
		log.info("Successfully created template with ID: {}", savedTemplate.getId());
		return templateMapper.toResponse(savedTemplate);
	}

	@Transactional
	public TemplateResponse updateTemplate(String id, TemplateUpdateRequest request) {
		log.info("Updating template with id: {}", id);
		Template template = templateRepository.findById(id)
				.orElseThrow(() -> new TemplateNotFoundException("Template not found with ID: " + id));

		validationService.validateUpdateRequest(request);

		if (request.getName() != null) template.setName(request.getName());
		if (request.getDescription() != null) template.setDescription(request.getDescription());
		if (request.getThumbnailUrl() != null) template.setThumbnailUrl(request.getThumbnailUrl());
		if (request.getStructureJson() != null) template.setStructureJson(request.getStructureJson());
		if (request.getCssText() != null) template.setCssText(request.getCssText());
		if (request.getConfigJson() != null) template.setConfigJson(request.getConfigJson());
		if (request.getCategory() != null) template.setCategory(request.getCategory());
		if (request.getVersion() != null) template.setVersion(request.getVersion());
		if (request.getStatus() != null) template.setStatus(request.getStatus());

		Template updatedTemplate = templateRepository.save(template);
		log.info("Successfully updated template with ID: {}", updatedTemplate.getId());
		return templateMapper.toResponse(updatedTemplate);
	}

	@Transactional
	public void deleteTemplate(String id) {
		log.info("Deleting template with id: {}", id);
		Template template = templateRepository.findById(id)
				.orElseThrow(() -> new TemplateNotFoundException("Template not found with ID: " + id));
		// Soft delete by marking inactive
		template.setStatus(false);
		templateRepository.save(template);
		log.info("Successfully deactivated template with ID: {}", id);
	}
}
