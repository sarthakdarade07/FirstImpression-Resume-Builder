package com.firstimpression.backend.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.firstimpression.backend.model.Users;
import com.firstimpression.backend.model.WorkExperience;

public interface WorkExperienceRepository extends JpaRepository<WorkExperience, Integer> {
    List<WorkExperience> findByUser(Users user);
    void deleteByUser(Users user);
    void deleteByIdAndUser(int id, Users user);
}
