package com.firstimpression.backend.templates.service;

import org.springframework.stereotype.Service;

import com.firstimpression.backend.templates.dto.TemplateCreateRequest;
import com.firstimpression.backend.templates.dto.TemplateUpdateRequest;
import com.firstimpression.backend.templates.validation.TemplateCssValidator;
import com.firstimpression.backend.templates.validation.TemplateHtmlValidator;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class TemplateValidationService {

	private final TemplateHtmlValidator htmlValidator;
	private final TemplateCssValidator cssValidator;

	public void validateCreateRequest(TemplateCreateRequest request) {
		log.info("Validating template create request for slug: {}", request.getSlug());
		htmlValidator.validate(request.getHtmlCode());
		cssValidator.validate(request.getCssText());
	}

	public void validateUpdateRequest(TemplateUpdateRequest request) {
		log.info("Validating template update request");
		if (request.getHtmlCode() != null) {
			htmlValidator.validate(request.getHtmlCode());
		}
		if (request.getCssText() != null) {
			cssValidator.validate(request.getCssText());
		}
	}
}
