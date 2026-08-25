package com.firstimpression.backend.Repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.firstimpression.backend.model.Users;

@Repository
public interface UsersRepository extends JpaRepository<Users, String> {
	Optional<Users> findByEmail(String email);
	
 public Boolean existsByEmail(String email); 
 
 Optional<Users> findByEmailAndOtp(String email, String otp);
 Optional<Users> findByResetToken(String tkn); 
}
