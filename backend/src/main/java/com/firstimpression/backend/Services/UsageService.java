package com.firstimpression.backend.Services;

import java.time.LocalDateTime;

import org.springframework.stereotype.Service;

import com.firstimpression.backend.Repository.QueryUsageRepository;
import com.firstimpression.backend.Repository.ResumeTailorUsageRepository;
import com.firstimpression.backend.model.QueryUsage;
import com.firstimpression.backend.model.ResumeTailorUsage;
import com.firstimpression.backend.model.Users;

import lombok.RequiredArgsConstructor;



@Service
@RequiredArgsConstructor
public class UsageService {

	private final ResumeTailorUsageRepository resumeUsageRespo;
	private final QueryUsageRepository queryUsageRepository;
	 
	
	public boolean tailorAllowed(Users user) {
		
		ResumeTailorUsage usage = resumeUsageRespo.findByUser(user).orElse(null);
		
		   LocalDateTime now = LocalDateTime.now();
		
		   if(usage == null) {
			   usage = new ResumeTailorUsage();
			   usage.setUsedCount(1);
			   usage.setUsedAt(now);
			   usage.setUser(user);
			   resumeUsageRespo.save(usage);
			   return true;
		  } 
		   
		   //If user tailoring after 24 hrs
		   if(now.isAfter(usage.getUsedAt().plusHours(24))) {
			   usage.setUsedCount(1);
			   usage.setUsedAt(now);
			   resumeUsageRespo.save(usage);
			   return true;
		  } 
		   
		   //If user tailoring before 24 hrs
		    if(usage.getUsedCount() >= usage.getMaxAllowed()) return false; 
		    
		    usage.setUsedCount(usage.getUsedCount()+1);
		     
		    resumeUsageRespo.save(usage);
		    return true;
	}
	
	 
	public boolean queryAllowed(Users user) {
		
		QueryUsage usage = queryUsageRepository.findByUser(user).orElse(null);
		 
		   LocalDateTime now = LocalDateTime.now();
		   
		   if(usage == null) {
			   usage = new QueryUsage();
			   usage.setUsedCount(1); 
			   usage.setUsedAt(now);
			   usage.setUser(user);
			   queryUsageRepository.save(usage);
			   return true; 
		  } 
		    
		   //If user tailoring after 24 hrs
		   if(now.isAfter(usage.getUsedAt().plusHours(24))) {
			   usage.setUsedCount(1);
			   usage.setUsedAt(now);
			   queryUsageRepository.save(usage);
			   return true; 
		  } 
		    
		   //If user tailoring before 24 hrs
		    if(usage.getUsedCount() >= usage.getMaxAllowed()) return false; 
		    
		    usage.setUsedCount(usage.getUsedCount()+1);
		     
		    queryUsageRepository.save(usage);
		    return true; 
	}
}
