package com.firstimpression.backend.Repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.firstimpression.backend.model.Resume;

@Repository
public interface ResumeRepository extends JpaRepository<Resume, String> {

	List<Resume> findByUserIdOrderByUpdatedAtDesc(String userId);

	Optional<Resume> findByIdAndUserId(String id, String userId);
}
