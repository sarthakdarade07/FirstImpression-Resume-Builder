package com.firstimpression.backend.model;

import java.time.LocalDate;
import java.util.List;

import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

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
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Table(name= "work_experiences")
@SQLDelete(sql = "UPDATE work_experiences SET status = 0 WHERE id = ?")
@SQLRestriction("status = 1")
public class WorkExperience {

	@Builder.Default
	@Column(nullable = false)
	private Integer status = 1;

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int id;
	
	@ManyToOne
	 @JsonIgnore
	@JoinColumn(name="user_id" , referencedColumnName = "id" , nullable = false)
	private Users user;
	
	@Column(name="company_name", nullable = false , length = 50)
	private String companyName;
	
	@Column(name = "job_title" , nullable = false , length=50)
	private String jobTitle;
	
	@Column(name = "location" , length=20)
	private String location;
	
	@Column(name = "join_date")
	private LocalDate joinDate;
	
	@Column(name = "end_date")
	private LocalDate endDate;
	 
	@Column(length=1000)
	private String description;
	
	@JsonIgnore
	@JdbcTypeCode(SqlTypes.JSON)
	@Column(name = "technologies",columnDefinition = "json")
	private List<String>  technologies;	
	
	
}
