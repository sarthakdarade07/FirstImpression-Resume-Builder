package com.firstimpression.backend.Repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.firstimpression.backend.model.ResumeTailorUsage;
import com.firstimpression.backend.model.Users;

public interface ResumeTailorUsageRepository extends JpaRepository<ResumeTailorUsage, Integer>{
	 
	Optional<ResumeTailorUsage> findByUser(Users user);

}
