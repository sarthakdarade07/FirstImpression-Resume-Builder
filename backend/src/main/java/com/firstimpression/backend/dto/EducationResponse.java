package com.firstimpression.backend.dto;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EducationResponse {

    private Integer id;
    private Integer educationTypeId;
    private String educationType;
    private String instituteName;
    private Integer scoreTypeId;
    private String scoreType;
    private BigDecimal score;
    private Integer startYear;
    private Integer endYear;
    private String boardOrUniversity;
    private String specialization;
}