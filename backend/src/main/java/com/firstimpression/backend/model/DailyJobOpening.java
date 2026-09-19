package com.firstimpression.backend.model;

import java.time.LocalDate;
import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "daily_job_openings")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DailyJobOpening {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(name = "company_name", nullable = false, length = 150)
	private String companyName;

	@Column(name = "role_title", nullable = false, length = 200)
	private String roleTitle;

	@Column(length = 150)
	private String location;

	@Column(name = "apply_url", nullable = false, length = 1000)
	private String applyUrl;

	@Column(name = "job_type", length = 100)
	private String jobType;

	@Column(length = 100)
	private String salary;

	@Column(name = "featured_date", nullable = false)
	private LocalDate featuredDate;

	@Builder.Default
	@Column(nullable = false)
	private boolean active = true;

	@Column(name = "created_at", nullable = false, updatable = false)
	private LocalDateTime createdAt;

	@PrePersist
	protected void onCreate() {
		if (this.createdAt == null) {
			this.createdAt = LocalDateTime.now();
		}
		if (this.featuredDate == null) {
			this.featuredDate = LocalDate.now();
		}
	}
}
