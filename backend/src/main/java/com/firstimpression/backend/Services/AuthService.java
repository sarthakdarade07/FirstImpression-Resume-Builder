package com.firstimpression.backend.Services;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;

import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ClassPathResource;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.firstimpression.backend.Exception.ResourceExistsException;
import com.firstimpression.backend.Exception.ServiceException;
import com.firstimpression.backend.Repository.UsersRepository;
import com.firstimpression.backend.dto.AuthResponse;

import com.firstimpression.backend.dto.LoginRequest;
import com.firstimpression.backend.dto.OtpVerificationResponse;

import com.firstimpression.backend.dto.RegisterRequest;

import com.firstimpression.backend.model.Users;

import com.firstimpression.backend.util.JwtUtil;

import jakarta.mail.MessagingException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

	@Value("${app.base.url}")
	private String appBaseUrl;
	private final UsersRepository usersRepository;
	private final EmailService emailService;
	private final PasswordEncoder passwordEncoder;
	private final JwtUtil jwtUtil;

	public AuthResponse register(RegisterRequest request) {

		log.info("Inside AuthService : register() {}", request);

		if (usersRepository.existsByEmail(request.getEmail())) {
			throw new ServiceException(HttpStatus.CONFLICT, "Email already exists");
		}

		Users newUser = toUsers(request);
		String otp = OtpService.generateOtp();
		newUser.setOtp(otp);
		newUser.setOtpExpires(LocalDateTime.now().plusMinutes(5));

		// save in database
		Users savedUser = usersRepository.save(newUser);

		// Send mail for verification
		sendVerificationEmail(savedUser, otp);

		return toResponse(savedUser);

	}

	private AuthResponse toResponse(Users savedUser) {
		return AuthResponse.builder().id(savedUser.getId()).name(savedUser.getName()).email(savedUser.getEmail())
				.profileImageUrl(savedUser.getProfileImageUrl()).subscriptionPlan(savedUser.getSubscriptionPlan())
				.emailVerified(savedUser.isEmailVerified()).createdAt(savedUser.getCreatedAt())
				.updatedAt(savedUser.getUpdatedAt()).build();
	}

	private Users toUsers(RegisterRequest request) {
		Users newUser = Users.builder().name(request.getName()).email(request.getEmail())
				.password(passwordEncoder.encode(request.getPassword())).profileImageUrl(request.getProfileImageUrl())
				.subscriptionPlan(request.getSubscriptionPlan()).emailVerified(false).build();

		return newUser;
	}

	private void sendVerificationEmail(Users user, String otp) {

		log.info("Inside Auth Service - Sending email verification OTP to {}", user.getEmail());
		try {
			ClassPathResource resource = new ClassPathResource("templates/email-verification-otp.html");
			String html = new String(resource.getInputStream().readAllBytes(), StandardCharsets.UTF_8);
			html = html.replace("{{NAME}}", user.getName() != null ? user.getName() : "there");
			html = html.replace("{{OTP}}", otp);

			String subject = "Verify Your Email - First Impression";
			emailService.sendHtmlEmail(user.getEmail(), subject, html);

		} catch (Exception e) {
			log.error("Error occurred while sending verification email: {}", e.getMessage());
			throw new ServiceException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to send verification mail: ", e);
		}
	}

	public AuthResponse verifyEmail(String email, String otp) {
		log.info("Inside AuthService verifyEmail(): email={}, otp={}", email, otp);
		Users user = usersRepository.findByEmailAndOtp(email, otp)
				.orElseThrow(() -> new ServiceException(HttpStatus.BAD_REQUEST, "Invalid OTP"));

		if (user.getOtp() == null || LocalDateTime.now().isAfter(user.getOtpExpires())) {
			throw new ServiceException(HttpStatus.BAD_REQUEST, "OTP has expired.");
		}

		if (!user.getOtp().equals(otp)) {
			throw new ServiceException(HttpStatus.BAD_REQUEST, "Wrong OTP.");
		}

		user.setEmailVerified(true);
		user.setOtp(null);
		user.setOtpExpires(null);

		Users savedUser = usersRepository.save(user);

		String jwt = jwtUtil.generateToken(savedUser.getId());
		AuthResponse response = toResponse(savedUser);
		response.setJwtToken(jwt);

		return response;
	}

	public AuthResponse login(LoginRequest req) {

		Users existingUser = usersRepository.findByEmail(req.getEmail())
				.orElseThrow(() -> new ServiceException(HttpStatus.UNAUTHORIZED, "Invalid Email"));

		if (!passwordEncoder.matches(req.getPassword(), existingUser.getPassword())) {
			throw new ServiceException(HttpStatus.UNAUTHORIZED, "Invalid Password");
		}

		if (!existingUser.isEmailVerified()) {
			throw new ServiceException(HttpStatus.FORBIDDEN, "Please verify your email befor log in...");
		}

		String jwt = jwtUtil.generateToken(existingUser.getId());

		AuthResponse response = toResponse(existingUser);
		response.setJwtToken(jwt);

		return response;

	}

	public void resendVerification(String email) {

		log.info("Inside AuthService - resendVerification():{} ", email);

		// 1.find user by email
		Users user = usersRepository.findByEmail(email)
				.orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND, "This Email id not registered."));

		// 2. Check if email is verified
		if (user.isEmailVerified()) {
			throw new ServiceException(HttpStatus.BAD_REQUEST, "Email is already Verififed.");
		}

		// 3. Set new OTP
		String otp = OtpService.generateOtp();
		user.setOtp(otp);
		user.setOtpExpires(LocalDateTime.now().plusMinutes(5));

		// 4 update the user
		usersRepository.save(user);

		// 5. resend verification email with OTP
		sendVerificationEmail(user, otp);

	}

	public AuthResponse getAccountDetails(Users user) {

		return toResponse(user);
	}

	public void forgotPassword(String email) throws IOException, MessagingException {

		log.info("Inside AuthService-forgetPassword():{}", email);

		// 1.verify if email id is registered
		Users user = usersRepository.findByEmail(email)
				.orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND, "Email not registered."));

		// 2.generate otp & save it to user
		String otp = OtpService.generateOtp();
		user.setOtp(otp);
		user.setOtpExpires(LocalDateTime.now().plusMinutes(5));
		usersRepository.save(user);

		// 3. create html for email
		ClassPathResource resource = new ClassPathResource("templates/forget-password-email.html");

		String html = new String(resource.getInputStream().readAllBytes(), StandardCharsets.UTF_8);

		html = html.replace("{{OTP}}", otp);
		// 4. send Html
		String sub = "Reset Password - First Impression";

		emailService.sendHtmlEmail(email, sub, html);

	}

	public AuthResponse resetPassword(String email, String otp, String newPassword) {

		log.info("Inside AuthService-resetPassword() for email: {}", email);

		Users user = usersRepository.findByEmailAndOtp(email, otp)
				.orElseThrow(() -> new ServiceException(HttpStatus.BAD_REQUEST, "Invalid Email or OTP."));

		if (user.getOtp() == null || LocalDateTime.now().isAfter(user.getOtpExpires())) {
			throw new ServiceException(HttpStatus.BAD_REQUEST, "OTP has expired.");
		}

		if (!user.getOtp().equals(otp)) {
			throw new ServiceException(HttpStatus.BAD_REQUEST, "Wrong OTP.");
		}

		user.setOtp(null);
		user.setOtpExpires(null);
		user.setPassword(passwordEncoder.encode(newPassword));
		user.setEmailVerified(true);
		Users savedUser = usersRepository.save(user);

		String jwt = jwtUtil.generateToken(savedUser.getId());
		AuthResponse response = toResponse(savedUser);
		response.setJwtToken(jwt);

		return response;

	}

}