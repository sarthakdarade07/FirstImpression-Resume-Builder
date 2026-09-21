package com.firstimpression.backend.templates.validation;

import java.util.regex.Pattern;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;

import com.firstimpression.backend.Exception.ServiceException;

@Component
public class TemplateHtmlValidator {

	private static final int MAX_HTML_LENGTH = 500_000; // 500 KB limit

	// Prohibit executable scripts and inline javascript execution
	private static final Pattern DANGEROUS_HTML_PATTERNS = Pattern.compile(
			"(?i)(<\\s*script|javascript\\s*:|vbscript\\s*:|on[a-z]+\\s*=)"
	);

	public void validate(String htmlCode) {
		if (htmlCode == null || htmlCode.trim().isEmpty()) {
			throw new ServiceException(HttpStatus.BAD_REQUEST, "Template HTML code cannot be empty");
		}

		if (htmlCode.length() > MAX_HTML_LENGTH) {
			throw new ServiceException(HttpStatus.BAD_REQUEST, "Template HTML exceeds maximum allowed length of " + MAX_HTML_LENGTH + " characters");
		}

		if (DANGEROUS_HTML_PATTERNS.matcher(htmlCode).find()) {
			throw new ServiceException(HttpStatus.BAD_REQUEST, "Template HTML contains disallowed or dangerous script syntax or event handlers");
		}
	}
}
