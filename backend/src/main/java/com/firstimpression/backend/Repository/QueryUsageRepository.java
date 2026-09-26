package com.firstimpression.backend.Repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.firstimpression.backend.model.QueryUsage;
import com.firstimpression.backend.model.Users;

public interface QueryUsageRepository extends JpaRepository<QueryUsage, Integer> {
	Optional<QueryUsage> findByUser(Users user); 	
}
