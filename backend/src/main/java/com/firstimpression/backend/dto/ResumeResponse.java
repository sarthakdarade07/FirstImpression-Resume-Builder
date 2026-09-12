package com.firstimpression.backend.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ResumeResponse {

	private String id;
	private String templateSlug;
	private String title;
	private String resumeDataJson;
	private LocalDateTime createdAt;
	private LocalDateTime updatedAt;
}
