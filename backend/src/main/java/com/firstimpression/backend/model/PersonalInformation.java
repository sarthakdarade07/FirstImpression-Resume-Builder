package com.firstimpression.backend.model;

import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Email;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name="personal_informations")
@SQLDelete(sql = "UPDATE personal_informations SET status = 0 WHERE id = ?")
@SQLRestriction("status = 1")
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PersonalInformation {

	@Builder.Default
	@Column(nullable = false)
	private Integer status = 1;

	@Id
	@GeneratedValue(strategy= GenerationType.IDENTITY)
	@Column(nullable = false, unique = true)
	private int id;
	
	@OneToOne
	 @JsonIgnore
	@JoinColumn(name="user_id", referencedColumnName = "id", nullable = false)
	private Users user;
	
	@Column(nullable = false, length = 20)
	private String name;
	
	private String location;
	private String role;
	
	@Email
	private String email;
	
	@Column (name ="linkedin_url")
	private String linkedinUrl;
	
	@Column (name ="github_url")
	private String githubUrl;
	
	@Column (name ="portfolio_url")
	private String portfolioUrl;
	
	
	@Column(name="phone_no", length= 20)
	private String phoneNo;
	
	@Column (name ="photo_url")
	private String photoUrl;
	
}
