package com.firstimpression.backend.templates.dto;

import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TemplateUpdateRequest {

	@Size(max = 150, message = "Name must not exceed 150 characters")
	private String name;

	@Size(max = 1000, message = "Description must not exceed 1000 characters")
	private String description;

	private String thumbnailUrl;

	private String structureJson;

	private String cssText;

	private String configJson;

	private String category;

	private Integer version;

	private Boolean status;
}
