package com.firstimpression.backend.Exception;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import lombok.extern.slf4j.Slf4j;

@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String,Object>> handleValidationExceptions(MethodArgumentNotValidException e){
    	
    	log.info("Inside GlobalExceptionHandler - handleValidationExceptions():{}",e.getMessage());

    	
    	Map<String,String> errors = new HashMap<>();
    	
    	e.getBindingResult().getAllErrors().forEach(error->{
    		String fieldName = ((FieldError)error).getField();
    		String errorMessage = error.getDefaultMessage();
    		
    		errors.put(fieldName,errorMessage);

			
    	});
    	
    	
    	Map<String,Object> response = new HashMap<>();
    	
    	response.put("message", "Verification failed.");
    	response.put("error", errors); 
    	
    	return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    	 
    } 
    
    @ExceptionHandler(ResourceExistsException.class)
    public ResponseEntity<Map<String,Object>> handleResourceExistsException(ResourceExistsException e){
    	
    	log.info("Inside GlobalExceptionHandler - handleResourceExistsException():{}",e.getMessage());

    	
    	Map<String,Object> response = new HashMap<>();
    	
    	response.put("message", "Resource Exists");
    	response.put("error", e.getMessage()); 
    	
    	return ResponseEntity.status(HttpStatus.CONFLICT).body(response); 
    	
    }
    
    @ExceptionHandler(RuntimeException.class) 
    public ResponseEntity<Map<String,Object>> handleRunTimeException(RuntimeException e){
    	
    	log.info("Inside GlobalExceptionHandler - handleRunTimeException():{}",e.getMessage());

    	Map<String,Object> response = new HashMap<>();
    	
    	response.put("message","Runtime error."); 
    	response.put("error",e.getMessage());
    	  
    	return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }
    
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String,Object>> handleGenericException(Exception e){
    	
    	log.info("Inside GlobalExceptionHandler - handleGenericException():{}",e.getMessage());

    	Map<String,Object> response = new HashMap<>();
    	
    	response.put("message", "Internal server error.");
    	response.put("error", "An unexpected error occurred. Please try again later."+e.getMessage());
    	 
    	return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
    }
    
   
}
