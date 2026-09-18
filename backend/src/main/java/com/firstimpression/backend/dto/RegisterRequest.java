package com.firstimpression.backend.dto;


import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;

import lombok.NoArgsConstructor;


@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RegisterRequest {
	
    @NotBlank(message= "Name is required") 
    @Size(min =2 , max=15 , message = "name should be between 2 and 15 characters")
    private String name;
    
    @Email(message="Enter valid email")
    @NotBlank(message= "Email is required") 
    private String email;
    
    @NotBlank(message= "Password is required") 
     @Size(min=6,max=20)
    private String password;
    private String profileImageUrl;
    private String subscriptionPlan;
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getEmail() {
		return email;
	}
	public void setEmail(String email) {
		this.email = email;
	}
	public String getPassword() {
		return password;
	}
	public void setPassword(String password) {
		this.password = password;
	}
	public String getProfileImageUrl() {
		return profileImageUrl;
	}
	public void setProfileImageUrl(String profileImageUrl) {
		this.profileImageUrl = profileImageUrl;
	}
	public String getSubscriptionPlan() {
		return subscriptionPlan;
	}
	public void setSubscriptionPlan(String subscriptionPlan) {
		this.subscriptionPlan = subscriptionPlan;
	}
    
   
	

}
