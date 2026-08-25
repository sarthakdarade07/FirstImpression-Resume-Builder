package com.firstimpression.backend.Services;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;

import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ClassPathResource;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.firstimpression.backend.Exception.ResourceExistsException;
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
			throw new ResourceExistsException("Email already exists");
		}

		Users newUser = toUsers(request);

		// save in database
		Users savedUser = usersRepository.save(newUser);

		// Send mail for verification
		sendVerificationEmail(newUser);

		return toResponse(savedUser);

	}

	private AuthResponse toResponse(Users savedUser) {
		return AuthResponse.builder().id(savedUser.getId()).name(savedUser.getName()).email(savedUser.getEmail())
				.profileImageUrl(savedUser.getProfileImageUrl()).subscriptionPlan(savedUser.getSubscriptionPlan())
				.emailVerified(savedUser.isEmailVerified()).verificationToken(savedUser.getVerificationToken())
				.verificationExpires(savedUser.getVerificationExpires()).createdAt(savedUser.getCreatedAt())
				.updatedAt(savedUser.getUpdatedAt()).build();
	}

	private Users toUsers(RegisterRequest request) {
		Users newUser = Users.builder().name(request.getName()).email(request.getEmail())
				.password(passwordEncoder.encode(request.getPassword())).profileImageUrl(request.getProfileImageUrl())
				.subscriptionPlan(request.getSubscriptionPlan()).verificationToken(UUID.randomUUID().toString())
				.verificationExpires(LocalDateTime.now().plusHours(24)).build();

		return newUser;
	}

	private void sendVerificationEmail(Users newUser) {

		log.info("Inside Auth Service - Sending email verification{}", newUser);
		try {
			String link = appBaseUrl + "/api/auth/verify-email?token=" + newUser.getVerificationToken() + "&email="
					+ newUser.getEmail();
			String subject = "Verification mail for firstimpression";
			String html = """
					<div style="font-family: sans-serif; color: #333333; line-height: 1.5; text-align: center;">

					    <!-- Add your image here -->
					    <img src="https://i.postimg.cc/3NL560RX/loginpage.webp" alt="First Impression Logo" style="max-width: 250px; margin-bottom: 20px;">

					    <h2>Verify your email</h2>
					    <p>Hi %s,</p>
					    <p>Please confirm your email address to activate your account by clicking the button below:</p>
					    <p>
					        <a href="%s" style="display: inline-block; padding: 10px 16px; background-color: #6366f1; color: #ffffff; text-decoration: none; border-radius: 4px; font-weight: bold; margin: 10px 0;">
					            Verify Email
					        </a>
					    </p>
					    <p>Or copy and paste this link into your browser:</p>
					    <p><a href="%s" style="color: #6366f1;">%s</a></p>
					    <p style="color: #6b7280; font-size: 14px; margin-top: 20px;">This link expires in 24 hours.</p>
					</div>
					"""
					.formatted(newUser.getName(), link, link, link);

			emailService.sendHtmlEmail(newUser.getEmail(), subject, html);

		} catch (Exception e) {
			log.error("Error occured at the sending verification email", e.getMessage());
			throw new RuntimeException("Faild to send verification mail" + e.getMessage());
		}
	}

	public void verifyEmail(String tkn) {
		log.info("Inside AuthSerice verify email():{}", tkn);
		Users user = usersRepository.findByVerificationToken(tkn)
				.orElseThrow(() -> new RuntimeException("Invalid token"));

		if (user.getVerificationExpires() != null && user.getVerificationExpires().isBefore(LocalDateTime.now())) {
			throw new RuntimeException("Verification token not valid!");
		}

		user.setEmailVerified(true);
		user.setVerificationToken(null);
		user.setVerificationExpires(null);

		usersRepository.save(user);
	}

	public AuthResponse login(LoginRequest req) {

		Users existingUser = usersRepository.findByEmail(req.getEmail())
				.orElseThrow(() -> new UsernameNotFoundException("Invalid Email"));

		if (!passwordEncoder.matches(req.getPassword(), existingUser.getPassword())) {
			throw new UsernameNotFoundException("Invalid Password");
		}

		if (!existingUser.isEmailVerified()) {
			throw new RuntimeException("Please verify your email befor log in...");
		}

		String jwt = jwtUtil.generateToken(existingUser.getId());

		AuthResponse response = toResponse(existingUser);
		response.setJwtToken(jwt);

		return response;

	}

	public void resendVerification(String email) {

		log.info("Inside AuthSerive - resendVerification():{} ", email);

		// 1.find user by email

		Users user = usersRepository.findByEmail(email)
				.orElseThrow(() -> new RuntimeException("This Email id not registered."));

		// 2. Check if email is verified
		if (user.isEmailVerified()) {
			throw new RuntimeException("Email is already Verififed.");
		}

		// 3. Set new verification token
		user.setVerificationToken(UUID.randomUUID().toString());
		user.setVerificationExpires(LocalDateTime.now().plusHours(24));

		// 4 updater the user

		usersRepository.save(user);

		// 5.resend verification mail

		sendVerificationEmail(user);

	}

	public AuthResponse getAccountDetails(Users user) {

		return toResponse(user);
	}

	public void forgotPassword(String email) throws IOException, MessagingException {

		log.info("Inside AuthService-forgetPassword():{}", email);

		// 1.verify if email id is registered
		Users user = usersRepository.findByEmail(email)
				.orElseThrow(() -> new RuntimeException("Email not registered."));

		// 2.generate otp & save it to user
		String otp = OtpService.generateOtp();
		user.setOtp(otp);
		user.setOtpExpires(LocalDateTime.now().plusMinutes(3));
		usersRepository.save(user);

		// 3. create html for email

		ClassPathResource resource = new ClassPathResource("templates/forget-password-email.html");

		String html = new String(resource.getInputStream().readAllBytes(), StandardCharsets.UTF_8);

		html = html.replace("{{OTP}}", otp);
		// 4. send Html
		String sub = "Reset Password";

		emailService.sendHtmlEmail(email, sub, html);

	}

	public OtpVerificationResponse verifyOtp(String email, String otp) {

		log.info("Inside:AuthSerive-verifyOtp():{}", email, otp);

		Users user = usersRepository.findByEmailAndOtp(email, otp)
				.orElseThrow(() -> new RuntimeException("OTP invalid"));
		if (user.getOtp() == null || LocalDateTime.now().isAfter(user.getOtpExpires())) {
			throw new RuntimeException("Otp Expired.");
		}

		if (!user.getOtp().equals(otp)) {
			throw new RuntimeException("Wrong Otp.");
		}

		user.setOtp(null);
		user.setOtpExpires(null);
		user.setResetToken(UUID.randomUUID().toString());
		user.setResetTokenExpires(LocalDateTime.now().plusMinutes(5));
		usersRepository.save(user);

		return OtpVerificationResponse.builder().resetToken(user.getResetToken()).build();

	}

	public void resetPassword(String resetToken, String newPassword) {

		log.info("Inside:AuthSerive-resetPassword():{}");

		Users user = usersRepository.findByResetToken(resetToken)
				.orElseThrow(() -> new RuntimeException("Token Invalid"));

		if (user.getResetToken() == null || LocalDateTime.now().isAfter(user.getResetTokenExpires())) {
			throw new RuntimeException("Token Expired.");
		}

//		if (!user.getResetToken().equals(resetToken)) {
//			throw new RuntimeException("Wrong Otp.");
//		}

		user.setResetToken(null);
		user.setResetTokenExpires(null);
		user.setPassword(passwordEncoder.encode(newPassword));
		usersRepository.save(user);

	}

}