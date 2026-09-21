package com.firstimpression.backend.templates.mapper;

import org.springframework.stereotype.Component;

import com.firstimpression.backend.templates.dto.TemplateCreateRequest;
import com.firstimpression.backend.templates.dto.TemplateResponse;
import com.firstimpression.backend.templates.dto.TemplateSummaryResponse;
import com.firstimpression.backend.templates.entity.Template;

@Component
public class TemplateMapper {

	public TemplateSummaryResponse toSummaryResponse(Template template) {
		if (template == null) return null;
		return TemplateSummaryResponse.builder()
				.id(template.getId())
				.name(template.getName())
				.slug(template.getSlug())
				.description(template.getDescription())
				.thumbnailUrl(template.getThumbnailUrl())
				.category(template.getCategory())
				.version(template.getVersion())
				.status(template.getStatus())
				.createdAt(template.getCreatedAt())
				.updatedAt(template.getUpdatedAt())
				.build();
	}

	public TemplateResponse toResponse(Template template) {
		if (template == null) return null;
		return TemplateResponse.builder()
				.id(template.getId())
				.name(template.getName())
				.slug(template.getSlug())
				.description(template.getDescription())
				.thumbnailUrl(template.getThumbnailUrl())
				.htmlCode(template.getHtmlCode())
				.cssText(template.getCssText())
				.configJson(template.getConfigJson())
				.category(template.getCategory())
				.version(template.getVersion())
				.status(template.getStatus())
				.createdAt(template.getCreatedAt())
				.updatedAt(template.getUpdatedAt())
				.build();
	}

	public Template toEntity(TemplateCreateRequest request) {
		if (request == null) return null;
		return Template.builder()
				.name(request.getName())
				.slug(request.getSlug().trim().toLowerCase())
				.description(request.getDescription())
				.thumbnailUrl(request.getThumbnailUrl())
				.htmlCode(request.getHtmlCode())
				.cssText(request.getCssText())
				.configJson(request.getConfigJson())
				.category(request.getCategory())
				.version(request.getVersion() != null ? request.getVersion() : 1)
				.status(request.getStatus() != null ? request.getStatus() : true)
				.build();
	}
}
