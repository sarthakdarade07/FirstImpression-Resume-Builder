package com.firstimpression.backend.templates.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "templates")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Template {

	@Id
	@GeneratedValue(strategy = GenerationType.UUID)
	@Column(nullable = false, updatable = false, length = 36)
	private String id;

	@Column(nullable = false, length = 150)
	private String name;

	@Column(nullable = false, unique = true, length = 150)
	private String slug;

	@Column(columnDefinition = "TEXT")
	private String description;

	@Column(name = "thumbnail_url", length = 500)
	private String thumbnailUrl;

	@Column(name = "structure_json", columnDefinition = "LONGTEXT", nullable = false)
	private String structureJson;

	@Column(name = "css_text", columnDefinition = "LONGTEXT", nullable = false)
	private String cssText;

	@Column(name = "config_json", columnDefinition = "LONGTEXT")
	private String configJson;

	@Column(length = 50)
	private String category;

	@Builder.Default
	@Column(nullable = false)
	private Integer version = 1;

	@Builder.Default
	@Column(columnDefinition = "TINYINT(1) DEFAULT 1", nullable = false)
	private Boolean status = true;

	@Column(name = "created_at", nullable = false, updatable = false)
	private LocalDateTime createdAt;

	@Column(name = "updated_at")
	private LocalDateTime updatedAt;

	@PrePersist
	public void onCreate() {
		this.createdAt = LocalDateTime.now();
		this.updatedAt = LocalDateTime.now();
		if (this.version == null) {
			this.version = 1;
		}
		if (this.status == null) {
			this.status = true;
		}
	}

	@PreUpdate
	public void onUpdate() {
		this.updatedAt = LocalDateTime.now();
	}
}
