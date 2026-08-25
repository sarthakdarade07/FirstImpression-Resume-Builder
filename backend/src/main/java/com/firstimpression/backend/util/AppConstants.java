package com.firstimpression.backend.util;



public class AppConstants {
	
  //Auth
	public static final String AUTH_CONTROLLER = "/api/auth";
	public static final String REGISTER = "/register";
	public static final String VERIFY_EMAIL = "/verify-email"; 
	public static final String UPLOAD_IMAGE = "/upload-image";
	public static final String LOGIN = "/login";
	public static final String VALIDATE_TKN = "/validate";	
	public static final String RESEND_VERIFICATION = "/resend-verification";		
	public static final String FORGOT_PASSWORD = "/forgot-password";	
	public static final String VERIFY_OTP = "/verify-otp";	
	public static final String RESET_PASSWORD = "/reset-password";	
	public static final String GET_ACCOUNT_DETAILS = "/me";
	public static final String REMOVE_IMAGE = "/remove-image";
	//Profile
	public static final String PROFILE_CONTROLLER = "/api/profile";	
	public static final String SAVE_PERSONAL_INFORMATION = "/save-personal-information";
	public static final String SAVE_EDUCATION = "/save-education";
	public static final String SAVE_CERTIFICATIONS = "/save-certifications";
	public static final String SAVE_LANGUAGES = "/save-languages";
	public static final String SAVE_PROJECTS = "/save-projects";
	public static final String SAVE_SKILLS = "/save-skills";
	public static final String SAVE_WORK_EXPERIENCE = "/save-work-experience";
	public static final String GET_PROFILE = "/get-profile";
	public static final String UPDATE_NAME = "/update-name";
	public static final String GET_EDUCATION_TYPES = "/education-types";
	public static final String GET_SCORE_TYPES = "/score-types";
	public static final String GET_EDUCATION_METADATA = "/education-metadata";
	
	// Delete endpoints
	public static final String DELETE_PERSONAL_INFORMATION = "/delete-personal-information";
	public static final String DELETE_EDUCATION = "/delete-education/{id}";
	public static final String DELETE_WORK_EXPERIENCE = "/delete-work-experience/{id}";
	public static final String DELETE_PROJECT = "/delete-project/{id}";
	public static final String DELETE_SKILL = "/delete-skill/{id}";
	public static final String DELETE_CERTIFICATION = "/delete-certification/{id}";
	public static final String DELETE_LANGUAGE = "/delete-language/{id}";
}

