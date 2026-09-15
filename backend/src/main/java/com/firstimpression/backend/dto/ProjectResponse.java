package com.firstimpression.backend.dto;

import java.util.List;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ProjectResponse {

    private Integer id;
    private String title;
    private String description;
    private List<String> technologies;
    private String projectLink;
    private String startDate;
    private String endDate;
}