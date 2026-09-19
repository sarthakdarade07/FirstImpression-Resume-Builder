package com.firstimpression.backend.Services;

import java.time.LocalDate;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.firstimpression.backend.Repository.DailyJobOpeningRepository;
import com.firstimpression.backend.dto.DailyJobOpeningRequest;
import com.firstimpression.backend.dto.DailyJobOpeningResponse;
import com.firstimpression.backend.model.DailyJobOpening;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class DailyJobOpeningService {

	private final DailyJobOpeningRepository dailyJobOpeningRepository;

	@Transactional
	public DailyJobOpeningResponse getDailyJobOpening() {
		return dailyJobOpeningRepository.findFirstByActiveTrueOrderByFeaturedDateDescCreatedAtDesc()
				.map(this::mapToResponse)
				.orElseGet(() -> {
					log.info("No daily job found. Seeding default featured opening.");
					DailyJobOpening seeded = DailyJobOpening.builder()
							.companyName("Stripe")
							.roleTitle("Frontend Software Engineer")
							.location("Remote / US & Global")
							.applyUrl("https://stripe.com/jobs")
							.jobType("Full-time")
							.salary("$140,000 - $180,000")
							.featuredDate(LocalDate.now())
							.active(true)
							.build();
					DailyJobOpening saved = dailyJobOpeningRepository.save(seeded);
					return mapToResponse(saved);
				});
	}

	@Transactional
	public DailyJobOpeningResponse createDailyJobOpening(DailyJobOpeningRequest request) {
		DailyJobOpening opening = DailyJobOpening.builder()
				.companyName(request.getCompanyName())
				.roleTitle(request.getRoleTitle())
				.location(request.getLocation() != null ? request.getLocation() : "Remote")
				.applyUrl(request.getApplyUrl())
				.jobType(request.getJobType() != null ? request.getJobType() : "Full-time")
				.salary(request.getSalary())
				.featuredDate(request.getFeaturedDate() != null ? request.getFeaturedDate() : LocalDate.now())
				.active(true)
				.build();

		DailyJobOpening saved = dailyJobOpeningRepository.save(opening);
		log.info("Created daily job opening: id={}, company={}", saved.getId(), saved.getCompanyName());
		return mapToResponse(saved);
	}

	private DailyJobOpeningResponse mapToResponse(DailyJobOpening opening) {
		return DailyJobOpeningResponse.builder()
				.id(opening.getId())
				.companyName(opening.getCompanyName())
				.roleTitle(opening.getRoleTitle())
				.location(opening.getLocation())
				.applyUrl(opening.getApplyUrl())
				.jobType(opening.getJobType())
				.salary(opening.getSalary())
				.featuredDate(opening.getFeaturedDate())
				.build();
	}
}
