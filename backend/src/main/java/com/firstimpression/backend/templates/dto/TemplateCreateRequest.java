package com.firstimpression.backend.templates.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TemplateCreateRequest {

	@NotBlank(message = "Template name is required")
	@Size(max = 150, message = "Name must not exceed 150 characters")
	private String name;

	@NotBlank(message = "Template slug is required")
	@Pattern(regexp = "^[a-z0-9]+(?:-[a-z0-9]+)*$", message = "Slug must be lowercase alphanumeric with hyphens (e.g. modern-sidebar)")
	@Size(max = 150, message = "Slug must not exceed 150 characters")
	private String slug;

	@Size(max = 1000, message = "Description must not exceed 1000 characters")
	private String description;

	private String thumbnailUrl;

	@NotBlank(message = "HTML code is required")
	private String htmlCode;

	@NotBlank(message = "CSS text is required")
	private String cssText;

	private String configJson;

	private String category;

	@Builder.Default
	private Integer version = 1;

	@Builder.Default
	private Boolean status = true;
}
