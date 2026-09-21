package com.firstimpression.backend.model;

import java.time.LocalDateTime;

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
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "job_descriptions")
@SQLDelete(sql = "UPDATE job_descriptions SET status = 0 WHERE id = ?")
@SQLRestriction("status = 1")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class JobDescription {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JsonIgnore
    @JoinColumn(name = "user_id", referencedColumnName = "id", nullable = false)
    private Users user;

    @ManyToOne
    @JsonIgnore
    @JoinColumn(name = "resume_id", referencedColumnName = "id")
    private Resume resume;

    @Column(name = "file_name", length = 255)
    private String fileName;

    @Column(name = "input_type", length = 50)
    private String inputType;

    @Column(name = "raw_txt", columnDefinition = "LONGTEXT")
    private String rawTxt;

    @Column(name = "jd_json", columnDefinition = "LONGTEXT")
    private String jdJson;

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
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public String getUserId() {
        return user != null ? user.getId() : null;
    }

    public String getResumeId() {
        return resume != null ? resume.getId() : null;
    }

    public String getRawText() {
        return rawTxt;
    }

    public void setRawText(String rawText) {
        this.rawTxt = rawText;
    }
}