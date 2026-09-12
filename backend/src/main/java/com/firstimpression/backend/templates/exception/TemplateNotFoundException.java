package com.firstimpression.backend.templates.exception;

public class TemplateNotFoundException extends RuntimeException {

	public TemplateNotFoundException(String message) {
		super(message);
	}
}
