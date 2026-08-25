package com.firstimpression.backend.model;

import java.util.List;

import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
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
@Table(name = "score_types")
@SQLDelete(sql = "UPDATE score_types SET status = 0 WHERE id = ?")
@SQLRestriction("status = 1")
public class ScoreType { 

	@Builder.Default
	@Column(nullable = false)
	private Integer status = 1; 

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int id;
	
	private String title;
	
	@OneToMany(mappedBy = "scoreType" , cascade= CascadeType.ALL)
	private List<Education> education;
	
}
