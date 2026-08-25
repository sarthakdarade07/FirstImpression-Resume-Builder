package com.firstimpression.backend.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.firstimpression.backend.model.Project;
import com.firstimpression.backend.model.Users;

public interface ProjectRepository extends JpaRepository<Project, Integer> {
    List<Project> findByUser(Users user);
    void deleteByUser(Users user);
    void deleteByIdAndUser(int id, Users user);
}
