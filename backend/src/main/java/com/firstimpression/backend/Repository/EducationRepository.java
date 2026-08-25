package com.firstimpression.backend.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.firstimpression.backend.model.Education;
import com.firstimpression.backend.model.Users;

public interface EducationRepository extends JpaRepository<Education, Integer> {
    List<Education> findByUser(Users user);
    void deleteByUser(Users user);
    void deleteByIdAndUser(int id, Users user);
}

