package com.firstimpression.backend.model;

import java.time.LocalDateTime;

import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "resumes")
@SQLDelete(sql = "UPDATE resumes SET status = 0 WHERE id = ?")
@SQLRestriction("status = 1")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Resume {

	@Id
	@Column(nullable = false, unique = true, length = 50)
	private String id;

	@ManyToOne
	@JsonIgnore
	@JoinColumn(name = "user_id", referencedColumnName = "id", nullable = false)
	private Users user;

	@Column(name = "template_slug", nullable = false, length = 150)
	private String templateSlug;

	@Column(nullable = false, length = 200)
	private String title;

	@Column(name = "resume_data_json", columnDefinition = "LONGTEXT", nullable = false)
	private String resumeDataJson;

	@Builder.Default
	@Column(nullable = false)
	private Integer status = 1;

	@Column(name = "created_at", nullable = false, updatable = false)
	private LocalDateTime createdAt;

	@Column(name = "updated_at")
	private LocalDateTime updatedAt;

	@PrePersist
	protected void onCreate() {
		this.createdAt = LocalDateTime.now();
		this.updatedAt = LocalDateTime.now();
		if (this.id == null || this.id.isBlank()) {
			this.id = java.util.UUID.randomUUID().toString();
		}
	}

	@PreUpdate
	protected void onUpdate() {
		this.updatedAt = LocalDateTime.now();
	}
}
