package com.firstimpression.backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ResumeCreateRequest {

	@NotBlank(message = "Template slug is required")
	private String templateSlug;

	private String title;

	private String resumeDataJson;
}
