package com.firstimpression.backend.dto;

import java.time.LocalDate;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DailyJobOpeningRequest {

	@NotBlank(message = "Company name is required")
	private String companyName;

	@NotBlank(message = "Role title is required")
	private String roleTitle;

	private String location;

	@NotBlank(message = "Apply URL is required")
	private String applyUrl;

	private String jobType;

	private String salary;

	private LocalDate featuredDate;
}
