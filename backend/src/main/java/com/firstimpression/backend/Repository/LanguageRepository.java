package com.firstimpression.backend.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.firstimpression.backend.model.Language;
import com.firstimpression.backend.model.Users;

public interface LanguageRepository extends JpaRepository<Language, Integer> {
    List<Language> findByUser(Users user);
    void deleteByUser(Users user);
    void deleteByIdAndUser(int id, Users user);
}

