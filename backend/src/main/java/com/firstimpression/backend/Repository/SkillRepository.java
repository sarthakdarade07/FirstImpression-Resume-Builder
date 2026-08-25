package com.firstimpression.backend.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.firstimpression.backend.model.Skill;
import com.firstimpression.backend.model.Users;

public interface SkillRepository extends JpaRepository<Skill, Integer> {
    List<Skill> findByUser(Users user);
    void deleteByUser(Users user);
    void deleteByIdAndUser(int id, Users user);
}

