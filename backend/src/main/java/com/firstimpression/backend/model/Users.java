package com.firstimpression.backend.model;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Email;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "users")
@SQLDelete(sql = "UPDATE users SET status = 0 WHERE id = ?")
@SQLRestriction("status = 1")
@Getter
@Setter
@Builder 
@NoArgsConstructor
@AllArgsConstructor
public class Users { 

    @Builder.Default
    @Column(nullable = false)
    private Integer status = 1; 

	//======================= Key mapping   ======================================
    @Id
    @Column(nullable = false, unique = true, length = 20)
    private String id;

    @OneToOne(mappedBy = "user" , cascade = CascadeType.ALL, orphanRemoval = true) 
    private PersonalInformation personalInformation;
    
    @OneToMany(mappedBy = "user" , cascade = CascadeType.ALL , orphanRemoval = true) 
    private List<WorkExperience> workExperience;
    
    @OneToMany(mappedBy="user" ,cascade = CascadeType.ALL , orphanRemoval = true)
    private List<Education> education;
    
    @OneToMany(mappedBy="user" ,cascade = CascadeType.ALL ,orphanRemoval = true)
    private List<Skill> skills;
    
    @OneToMany(mappedBy="user" ,cascade = CascadeType.ALL ,orphanRemoval = true)
    private List<Project> projects;
    
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Certification> certifications;
    
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Language> languages;
    
  //  =============================================================
    
    

    
    @Column(nullable = false)
    private String name;

    @Email
    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    private String profileImageUrl;

    @Builder.Default
    private String subscriptionPlan = "Basic";

    @Builder.Default
    private boolean emailVerified = false;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
    
    @Builder.Default
    private String otp = null;
    private LocalDateTime otpExpires;
    
    @PrePersist
    public void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();

        DateTimeFormatter formatter =
                DateTimeFormatter.ofPattern("yyyyMMddHHmmss");

        id = "u" + createdAt.format(formatter);
    }

    @PreUpdate
    public void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}