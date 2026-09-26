package com.firstimpression.backend.model;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import jakarta.persistence.Transient;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name="resume_tailor_usage")
@Getter
@Setter

public class ResumeTailorUsage {
 
	@Transient
	 private static final int max_allowed=2;
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int id;
	
	 @OneToOne
	 @JsonIgnore
	 @JoinColumn(name="user_id",nullable=false,unique=true)
    private Users user;
	 
	 @Column(name="used_at",nullable = false)
	 private LocalDateTime usedAt;
	 
	 @Column(name="used_count",nullable = false)
	private int usedCount; 
	private int status;
	
	public int getMaxAllowed() {
		return max_allowed;
	}
	 
	 
}
