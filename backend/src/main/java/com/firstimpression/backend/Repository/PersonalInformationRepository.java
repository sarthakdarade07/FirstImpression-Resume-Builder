package com.firstimpression.backend.Repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.firstimpression.backend.model.PersonalInformation;
import com.firstimpression.backend.model.Users;

public interface PersonalInformationRepository extends JpaRepository<PersonalInformation, Integer> {
    Optional<PersonalInformation> findByUser(Users user);
    void deleteByUser(Users user);
}

