package com.firstimpression.backend.config;

import java.util.Arrays;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import com.firstimpression.backend.security.JwtAuthenticationEntryPoint;
import com.firstimpression.backend.security.JwtAuthenticationFilter;

import lombok.RequiredArgsConstructor;

@Configuration
@RequiredArgsConstructor
@EnableWebSecurity

public class SecurityConfig {
 
	@Value("${FRONTEND_BASE_URL:http://localhost:5173}")
	private String frontendBaseurl;
	private final JwtAuthenticationFilter jwtAuthenticationFilter;
	
	@Bean
	public PasswordEncoder passwordEncoder () {
		return new BCryptPasswordEncoder(); 
	}
	
	@Bean
	public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
		http.cors(cors-> cors.configurationSource(corsConfigurationSource()))
		   .csrf( csrf -> csrf.disable())
		   .authorizeHttpRequests(auth -> auth.requestMatchers(
				   "/api/auth/register",
				   "/api/auth/login",
				   "/api/auth/verify-email",
				   "/api/auth/resend-verification",
				   "/api/auth/forgot-password",
				   "/api/auth/verify-otp",
				   "/api/auth/reset-password",
				   "/actuator/**",
				   "/error",
				   "/api/templates/**",
				   "/api/jobs/**").permitAll()
				   .anyRequest().authenticated())
		   .sessionManagement(session -> session.sessionCreationPolicy((SessionCreationPolicy.STATELESS)))
		   .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
		   .exceptionHandling(ex -> ex.authenticationEntryPoint(new JwtAuthenticationEntryPoint()));
		return http.build();
	}
	
	@Bean 
	public CorsConfigurationSource corsConfigurationSource() {
		CorsConfiguration corsConfiguration = new CorsConfiguration();
		corsConfiguration.setAllowedOriginPatterns(Arrays.asList(
			"http://localhost:3000",
			"http://localhost:5173",
			"https://*.vercel.app",
			frontendBaseurl != null && !frontendBaseurl.isBlank() ? frontendBaseurl.trim().replaceAll("/+$", "") : ""
		));
		corsConfiguration.setAllowedMethods(Arrays.asList("GET", "PUT", "POST", "PATCH", "DELETE", "OPTIONS")); 
		corsConfiguration.setAllowedHeaders(Arrays.asList("*"));
		corsConfiguration.setAllowCredentials(true);
		UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
		
		source.registerCorsConfiguration("/**", corsConfiguration);
		return source;
	}
}
