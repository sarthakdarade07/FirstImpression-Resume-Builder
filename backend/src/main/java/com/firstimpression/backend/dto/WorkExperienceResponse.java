package com.firstimpression.backend.dto;

import java.util.List;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class WorkExperienceResponse {

    private Integer id;
    private String companyName;
    private String jobTitle;
    private String location;
    private String joinDate;
    private String endDate;
    private String description;
    private List<String> technologies;
}