package com.firstimpression.backend.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.firstimpression.backend.model.Certification;
import com.firstimpression.backend.model.Users;

public interface CertificationRepository extends JpaRepository<Certification, Integer> {
    List<Certification> findByUser(Users user);
    void deleteByUser(Users user);
    void deleteByIdAndUser(int id, Users user);
}
