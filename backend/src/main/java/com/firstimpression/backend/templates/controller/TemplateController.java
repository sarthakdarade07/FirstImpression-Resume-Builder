package com.firstimpression.backend.templates.controller;

import java.util.List;
import java.util.Map;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.firstimpression.backend.templates.dto.TemplateCreateRequest;
import com.firstimpression.backend.templates.dto.TemplateResponse;
import com.firstimpression.backend.templates.dto.TemplateSummaryResponse;
import com.firstimpression.backend.templates.dto.TemplateUpdateRequest;
import com.firstimpression.backend.templates.service.TemplateService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/templates")
@RequiredArgsConstructor
@Slf4j
public class TemplateController {

	private final TemplateService templateService;

	@GetMapping
	public ResponseEntity<Page<TemplateSummaryResponse>> getTemplates(
			@RequestParam(required = false) Boolean status,
			@RequestParam(required = false) String category,
			@RequestParam(required = false) String search,
			@RequestParam(defaultValue = "0") int page,
			@RequestParam(defaultValue = "20") int size,
			@RequestParam(defaultValue = "name") String sortBy,
			@RequestParam(defaultValue = "ASC") String sortDir
	) {
		log.info("REST: GET /api/templates?category={}&status={}&search={}", category, status, search);
		Sort sort = sortDir.equalsIgnoreCase("DESC") ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
		Pageable pageable = PageRequest.of(page, size, sort);
		return ResponseEntity.ok(templateService.getTemplates(status, category, search, pageable));
	}

	@GetMapping("/active")
	public ResponseEntity<List<TemplateSummaryResponse>> getAllActiveTemplates() {
		log.info("REST: GET /api/templates/active");
		return ResponseEntity.ok(templateService.getAllActiveTemplates());
	}

	@GetMapping("/{idOrSlug}")
	public ResponseEntity<TemplateResponse> getTemplateByIdOrSlug(@PathVariable String idOrSlug) {
		log.info("REST: GET /api/templates/{}", idOrSlug);
		return ResponseEntity.ok(templateService.getTemplateByIdOrSlug(idOrSlug));
	}

	@GetMapping("/slug/{slug}")
	public ResponseEntity<TemplateResponse> getTemplateBySlug(@PathVariable String slug) {
		log.info("REST: GET /api/templates/slug/{}", slug);
		return ResponseEntity.ok(templateService.getTemplateBySlug(slug));
	}

	@GetMapping(value = "/{id}/html", produces = "text/html")
	public ResponseEntity<String> getTemplateHtml(@PathVariable String id) {
		log.info("REST: GET /api/templates/{}/html", id);
		HttpHeaders headers = new HttpHeaders();
		headers.setContentType(MediaType.valueOf("text/html;charset=UTF-8"));
		return new ResponseEntity<>(templateService.getTemplateHtml(id), headers, HttpStatus.OK);
	}

	@GetMapping(value = "/{id}/css", produces = "text/css")
	public ResponseEntity<String> getTemplateCss(@PathVariable String id) {
		log.info("REST: GET /api/templates/{}/css", id);
		HttpHeaders headers = new HttpHeaders();
		headers.setContentType(MediaType.valueOf("text/css;charset=UTF-8"));
		return new ResponseEntity<>(templateService.getTemplateCss(id), headers, HttpStatus.OK);
	}

	@PostMapping
	public ResponseEntity<TemplateResponse> createTemplate(@Valid @RequestBody TemplateCreateRequest request) {
		log.info("REST: POST /api/templates with slug: {}", request.getSlug());
		TemplateResponse response = templateService.createTemplate(request);
		return ResponseEntity.status(HttpStatus.CREATED).body(response);
	}

	@PutMapping("/{id}")
	public ResponseEntity<TemplateResponse> updateTemplate(
			@PathVariable String id,
			@Valid @RequestBody TemplateUpdateRequest request
	) {
		log.info("REST: PUT /api/templates/{}", id);
		return ResponseEntity.ok(templateService.updateTemplate(id, request));
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<Map<String, String>> deleteTemplate(@PathVariable String id) {
		log.info("REST: DELETE /api/templates/{}", id);
		templateService.deleteTemplate(id);
		return ResponseEntity.ok(Map.of("message", "Template deleted successfully", "id", id));
	}
}
