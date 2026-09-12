package com.firstimpression.backend.templates.service;

import org.springframework.stereotype.Service;

import com.firstimpression.backend.templates.dto.TemplateCreateRequest;
import com.firstimpression.backend.templates.dto.TemplateUpdateRequest;
import com.firstimpression.backend.templates.validation.TemplateCssValidator;
import com.firstimpression.backend.templates.validation.TemplateStructureValidator;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class TemplateValidationService {

	private final TemplateStructureValidator structureValidator;
	private final TemplateCssValidator cssValidator;

	public void validateCreateRequest(TemplateCreateRequest request) {
		log.info("Validating template create request for slug: {}", request.getSlug());
		structureValidator.validate(request.getStructureJson());
		cssValidator.validate(request.getCssText());
	}

	public void validateUpdateRequest(TemplateUpdateRequest request) {
		log.info("Validating template update request");
		if (request.getStructureJson() != null) {
			structureValidator.validate(request.getStructureJson());
		}
		if (request.getCssText() != null) {
			cssValidator.validate(request.getCssText());
		}
	}
}
