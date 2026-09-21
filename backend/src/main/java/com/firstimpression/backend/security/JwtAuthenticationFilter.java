package com.firstimpression.backend.security;

import java.io.IOException;
import java.util.ArrayList;

import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.firstimpression.backend.Exception.ServiceException;
import com.firstimpression.backend.Repository.UsersRepository;
import com.firstimpression.backend.model.Users;
import com.firstimpression.backend.util.JwtUtil;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Component 
@RequiredArgsConstructor
@Slf4j
public class JwtAuthenticationFilter extends OncePerRequestFilter {
  private final JwtUtil jwtUtil;
  private final UsersRepository usersRepository;
    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {
    	   
    	String authHeader = request.getHeader("Authorization");
    	String token = null;
    	String userId = null;
    	
    	if(authHeader !=null && authHeader.startsWith("Bearer ")) {
    		token = authHeader.substring(7);
    		try {
    			userId = jwtUtil.getUserIdFromToken(token);
    			
    		}catch(Exception e){
    			log.info("error: token is not valid");
    		}
    		
    	} 
    	
    	if(userId !=null && SecurityContextHolder.getContext().getAuthentication()==null) {  
    		try {
    			
    			if(jwtUtil.validateToken(token) && !jwtUtil.isTokenExpired(token)) {
    				Users user = usersRepository.findById(userId).orElseThrow(() -> new ServiceException(HttpStatus.UNAUTHORIZED, "User Not Found"));
    				UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(user, null, new ArrayList<>());
    				authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
    				
    				 SecurityContextHolder.getContext().setAuthentication(authToken);
    			}
    			
    			}catch(Exception e) {
    				log.error("Exception Occured while validating the token");
    				
    			}
    			
    		
    	}

        

        filterChain.doFilter(request, response);
    }   
}