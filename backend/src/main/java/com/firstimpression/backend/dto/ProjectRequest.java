package com.firstimpression.backend.dto;

import java.util.List;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;



@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
@Setter
public class ProjectRequest {
	private int id;

    @NotBlank(message = "Project title is required")
    private String title;

    private String description;

    private List<String> technologies;

    private String projectLink;

    private String startDate;

    private String endDate;
}
