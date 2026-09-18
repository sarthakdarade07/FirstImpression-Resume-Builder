package com.firstimpression.backend.dto;

import java.time.LocalDateTime;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ResumeTailorResponse {

	private String resumeId;
	private String title;
	private String templateSlug;
	private Object alteredResumeData;
	private String alteredResumeDataJson;
	private String reasoning;
	private List<String> gapInJdAndResume;
	private List<String> skillsNeed;
	private List<Object> requiredSkills;
	private LocalDateTime updatedAt;
}
