package com.firstimpression.backend.Repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.firstimpression.backend.model.JobDescription;
import com.firstimpression.backend.model.Users;

@Repository
public interface JobDescriptionRepository extends JpaRepository<JobDescription, Long> {

    List<JobDescription> findByUser(Users user);

    @Query("SELECT j FROM JobDescription j WHERE j.user.id = :userId ORDER BY j.createdAt DESC")
    List<JobDescription> findByUserIdOrderByCreatedAtDesc(@Param("userId") String userId);

    @Query("SELECT j FROM JobDescription j WHERE j.id = :id AND j.user.id = :userId")
    Optional<JobDescription> findByIdAndUserId(@Param("id") Long id, @Param("userId") String userId);

    @Query("SELECT j FROM JobDescription j WHERE j.user.id = :userId AND j.resume.id = :resumeId ORDER BY j.createdAt DESC")
    List<JobDescription> findByUserIdAndResumeIdOrderByCreatedAtDesc(@Param("userId") String userId, @Param("resumeId") String resumeId);

    default Optional<JobDescription> findFirstByUserIdAndResumeIdOrderByCreatedAtDesc(String userId, String resumeId) {
        List<JobDescription> list = findByUserIdAndResumeIdOrderByCreatedAtDesc(userId, resumeId);
        return (list != null && !list.isEmpty()) ? Optional.of(list.get(0)) : Optional.empty();
    }

    @Query("SELECT j FROM JobDescription j WHERE j.resume.id = :resumeId")
    List<JobDescription> findByResumeId(@Param("resumeId") String resumeId);
}