package com.firstimpression.backend.templates.validation;

import java.util.regex.Pattern;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;

import com.firstimpression.backend.Exception.ServiceException;

@Component
public class TemplateCssValidator {

	private static final int MAX_CSS_LENGTH = 500_000; // 500 KB limit

	// Patterns that could introduce XSS or malicious behavior in CSS
	private static final Pattern DANGEROUS_PATTERNS = Pattern.compile(
			"(?i)(<\\s*script|javascript\\s*:|vbscript\\s*:|expression\\s*\\(|behavior\\s*:|-moz-binding\\s*:|@import\\s*)"
	);

	public void validate(String cssText) {
		if (cssText == null || cssText.trim().isEmpty()) {
			throw new ServiceException(HttpStatus.BAD_REQUEST, "Template CSS cannot be empty");
		}

		if (cssText.length() > MAX_CSS_LENGTH) {
			throw new ServiceException(HttpStatus.BAD_REQUEST, "Template CSS exceeds maximum allowed length of " + MAX_CSS_LENGTH + " characters");
		}

		if (DANGEROUS_PATTERNS.matcher(cssText).find()) {
			throw new ServiceException(HttpStatus.BAD_REQUEST, "Template CSS contains disallowed or dangerous syntax (e.g. scripts, javascript URLs, expressions, or @import)");
		}
	}
}
