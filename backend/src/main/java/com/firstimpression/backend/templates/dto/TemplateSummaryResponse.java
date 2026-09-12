package com.firstimpression.backend.templates.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TemplateSummaryResponse {

	private String id;
	private String name;
	private String slug;
	private String description;
	private String thumbnailUrl;
	private String category;
	private Integer version;
	private Boolean status;
	private LocalDateTime createdAt;
	private LocalDateTime updatedAt;
}
