package com.firstimpression.backend.dto;

import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DailyJobOpeningResponse {

	private Long id;
	private String companyName;
	private String roleTitle;
	private String location;
	private String applyUrl;
	private String jobType;
	private String salary;
	private LocalDate featuredDate;
}
