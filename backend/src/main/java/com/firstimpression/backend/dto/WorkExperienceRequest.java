package com.firstimpression.backend.dto;

import java.util.List;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Builder
@Data
public class WorkExperienceRequest {

	    private int id;
		@NotBlank(message = "company Name is required")
		@Size(min=2, max =50 , message= "Company name should between 2 to 50.")
		private String companyName;
		@NotBlank(message = "Job title is required")
		@Size(max =50 , message= "Company name should not be greater than 50.")
		private String jobTitle;
		@Size(max = 20, message = "Location should not be greater than 20.")
		private String location;
		@Size(max = 50, message = "Join date should not be greater than 50 characters.")
		private String joinDate;
		@Size(max = 50, message = "End date should not be greater than 50 characters.")
		private String endDate;
		@Size(max =1000 , message= "Description should not be greater than 1000 characters.")
		private String description;
		private List<String>  technologies;	
}
