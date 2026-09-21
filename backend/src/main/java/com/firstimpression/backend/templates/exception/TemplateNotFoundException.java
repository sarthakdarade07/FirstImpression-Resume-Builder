package com.firstimpression.backend.templates.exception;

import org.springframework.http.HttpStatus;
import com.firstimpression.backend.Exception.ServiceException;

public class TemplateNotFoundException extends ServiceException {

	public TemplateNotFoundException(String message) {
		super(HttpStatus.NOT_FOUND, message);
	}
}

