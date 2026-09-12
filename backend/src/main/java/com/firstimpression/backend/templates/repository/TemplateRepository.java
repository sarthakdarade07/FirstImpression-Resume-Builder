package com.firstimpression.backend.templates.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.firstimpression.backend.templates.entity.Template;

@Repository
public interface TemplateRepository extends JpaRepository<Template, String> {

	Optional<Template> findBySlug(String slug);

	boolean existsBySlug(String slug);

	List<Template> findByStatus(Boolean status);

	List<Template> findByCategoryAndStatus(String category, Boolean status);

	@Query("SELECT t FROM Template t WHERE " +
	       "(:status IS NULL OR t.status = :status) AND " +
	       "(:category IS NULL OR LOWER(t.category) = LOWER(:category)) AND " +
	       "(:search IS NULL OR LOWER(t.name) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(t.description) LIKE LOWER(CONCAT('%', :search, '%')))")
	Page<Template> findTemplates(
			@Param("status") Boolean status,
			@Param("category") String category,
			@Param("search") String search,
			Pageable pageable
	);
}
