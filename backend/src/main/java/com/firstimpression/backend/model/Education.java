package com.firstimpression.backend.model;

import java.math.BigDecimal;

import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "educations")
@SQLDelete(sql = "UPDATE educations SET status = 0 WHERE id = ?")
@SQLRestriction("status = 1")
public class Education {

    @Builder.Default
    @Column(nullable = false)
    private Integer status = 1;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @ManyToOne
    @JsonIgnore 
    @JoinColumn(name = "user_id", nullable = false)
    private Users user;

    @ManyToOne
    @JoinColumn(name = "education_type_id",  nullable = false)
    private EducationType educationType;

    @Column(nullable = false, length = 100)
    private String instituteName;

    @ManyToOne
    @JoinColumn(name = "score_type_id", nullable = false)
    private ScoreType scoreType;

    @Column(precision = 5, scale = 2)
    private BigDecimal score;

    @Column(name= "start_year")
    private Integer startYear;

    @Column(name= "end_year")
    private Integer endYear;

    @Column(name= "board_or_university",length = 100)
    private String boardOrUniversity;

    @Column(length = 100)
    private String specialization;

   
}
