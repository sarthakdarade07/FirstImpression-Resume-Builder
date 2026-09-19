package com.firstimpression.backend.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.firstimpression.backend.Services.DailyJobOpeningService;
import com.firstimpression.backend.dto.DailyJobOpeningRequest;
import com.firstimpression.backend.dto.DailyJobOpeningResponse;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/jobs")
@RequiredArgsConstructor
@Slf4j
public class DailyJobOpeningController {

	private final DailyJobOpeningService dailyJobOpeningService;

	@GetMapping("/daily")
	public ResponseEntity<DailyJobOpeningResponse> getDailyJob() {
		log.info("REST: GET /api/jobs/daily");
		return ResponseEntity.ok(dailyJobOpeningService.getDailyJobOpening());
	}

	@PostMapping("/daily")
	public ResponseEntity<DailyJobOpeningResponse> createDailyJob(@Valid @RequestBody DailyJobOpeningRequest request) {
		log.info("REST: POST /api/jobs/daily for company: {}", request.getCompanyName());
		DailyJobOpeningResponse created = dailyJobOpeningService.createDailyJobOpening(request);
		return ResponseEntity.status(HttpStatus.CREATED).body(created);
	}
}
