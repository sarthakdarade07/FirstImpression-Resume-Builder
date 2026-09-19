package com.firstimpression.backend.Repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.firstimpression.backend.model.DailyJobOpening;

@Repository
public interface DailyJobOpeningRepository extends JpaRepository<DailyJobOpening, Long> {

	Optional<DailyJobOpening> findFirstByActiveTrueOrderByFeaturedDateDescCreatedAtDesc();
}
