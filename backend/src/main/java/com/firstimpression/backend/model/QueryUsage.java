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
@Table(name = "query_usage")
@Getter
@Setter
public class QueryUsage {

	
	@Transient 
	 private static final int max_allowed=5 ;
	 
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	int id;
	
	 @OneToOne
	 @JsonIgnore
	 @JoinColumn(name="user_id",nullable=false,unique=true)
    Users user;
	 
	 @Column(name="used_at",nullable = false)
	 LocalDateTime usedAt;
	 
	 @Column(name="used_count",nullable = false)
	 int usedCount;
	 int status;
	 
	 public int getMaxAllowed() {
			return max_allowed;
		}
}
