package com.firstimpression.backend.controller;

import java.io.IOException;
import java.util.Map;
import java.util.Objects;
import java.net.URI;

import org.apache.tomcat.util.http.parser.Authorization;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.firstimpression.backend.Exception.ServiceException;
import com.firstimpression.backend.Services.AuthService;
import com.firstimpression.backend.Services.FileUploadService;
import com.firstimpression.backend.dto.AuthResponse;
import com.firstimpression.backend.dto.LoginRequest;
import com.firstimpression.backend.dto.OtpVerificationResponse;
import com.firstimpression.backend.dto.ProfileResponse;
import com.firstimpression.backend.dto.RegisterRequest;
import com.firstimpression.backend.model.Users;
import com.firstimpression.backend.util.AppConstants;

import jakarta.mail.MessagingException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor; 
import lombok.extern.slf4j.Slf4j;

@RestController
@Slf4j 
@RequiredArgsConstructor
@RequestMapping(AppConstants.AUTH_CONTROLLER)


public class AuthController {
	
	private final AuthService authService;
	private final FileUploadService fileUploadService;

	
	@PostMapping(AppConstants.REGISTER)
	public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest req){
		
		log.info("Inside AuthController- register():{}",req);

	 
			AuthResponse response = authService.register(req);
			log.info("Response from servie{}",response);
			return ResponseEntity.status(HttpStatus.CREATED).body(response);
		
	}
	
	@PostMapping(AppConstants.VERIFY_EMAIL)
	public ResponseEntity<?> verifyEmail(@RequestBody Map<String, String> req){
		log.info("Inside AuthController- verifyEmail():{}", req);
		String email = req.get("email");
		String otp = req.get("otp");
		if (email == null || otp == null) {
			throw new ServiceException(HttpStatus.BAD_REQUEST, "Email and OTP are required.");
		}
		AuthResponse response = authService.verifyEmail(email, otp);
		return ResponseEntity.ok(Map.of("message", "Email verified successfully!", "response", response));
	}
	
	@PostMapping(AppConstants.UPLOAD_IMAGE)
	public ResponseEntity<?> uploadImage(@Valid @RequestPart("image")MultipartFile file ,Authentication authentication) throws IOException{
		log.info("Inside AuthController- uplaodImage():{}",file);
         Users user = (Users)authentication.getPrincipal();
		Map<String,String> response =fileUploadService.uploadImage(file,user);
		
		return ResponseEntity.ok(response);
		
	} 
	
	@PostMapping(AppConstants.REMOVE_IMAGE)
	public ResponseEntity<?> removeImage(Authentication authentication) throws IOException{
		Users user = (Users) authentication.getPrincipal();
		fileUploadService.removeImage(user);
		
		return ResponseEntity.status(HttpStatus.OK).body(Map.of("message","Profile image removed."));
	}
	
	@PostMapping(AppConstants.LOGIN)
	public ResponseEntity<?> login(@Valid @RequestBody LoginRequest req){
		
		AuthResponse response =authService.login(req);
		
		return ResponseEntity.ok(Map.of("message","Login Successfull!","response",response));
		
		
	}  
 
	
	@GetMapping(AppConstants.VALIDATE_TKN)
	public String testValidationToken() {
		return "Token is Working";
	}
	
	
	@PostMapping(AppConstants.RESEND_VERIFICATION)
	public ResponseEntity<?> resendVerification(@Valid @RequestBody Map<String,String> body){
		
		log.info("Inside AuthController - resendVerification():{} ",body);

		//1.get email
		String email = body.get("email");
		
         
		//2.Verify if email is there
		if(Objects.isNull(email)) {
			return ResponseEntity.badRequest().body(Map.of("message","Email is required"));
		}
		
		authService.resendVerification(email);
		
		return ResponseEntity.ok().body(Map.of("message","Verification OTP sent on registered email."));
		
	}
	
	@GetMapping(AppConstants.GET_ACCOUNT_DETAILS)
	public ResponseEntity<?> getAccountDetails(Authentication authentication) {

	    Users user = (Users) authentication.getPrincipal();

	    return ResponseEntity.ok(authService.getAccountDetails(user));
	}
	

	 

	@PostMapping(AppConstants.FORGOT_PASSWORD)
	public ResponseEntity<?> forgotPassword(@RequestBody Map<String,String> req) throws IOException, MessagingException{
		log.info("Inside AuthController - forgotPassword():{}",req);
		
		String email = req.get("email");
		if(Objects.nonNull(email)) {
			authService.forgotPassword(email);
		}else {
			throw new ServiceException(HttpStatus.BAD_REQUEST, "Email Required.");
		}
		return ResponseEntity.ok().body(Map.of("message","OTP sent to registered email."));

	}
	
	@PostMapping(AppConstants.RESET_PASSWORD)
	public ResponseEntity<?> resetPassword(@RequestBody Map<String,String> req){
		log.info("Inside AuthController - resetPassword():{}",req);
		String email = req.get("email");
		String otp = req.get("otp");
		String newPassword = req.get("newPassword");

		if (email == null || otp == null || newPassword == null) {
			throw new ServiceException(HttpStatus.BAD_REQUEST, "Email, OTP, and newPassword are required.");
		}
           
		AuthResponse response = authService.resetPassword(email, otp, newPassword);
		return ResponseEntity.ok().body(Map.of("message", "Password changed successfully.", "response", response));
		
	}

}
