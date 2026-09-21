package com.firstimpression.backend.Exception;

import org.springframework.http.HttpStatus;

public class ResourceExistsException extends ServiceException {
	
	public ResourceExistsException(String msg) {
		super(HttpStatus.CONFLICT, msg);
	}

}

