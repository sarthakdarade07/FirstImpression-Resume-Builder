package com.firstimpression.backend.Controller;

import com.firstimpression.backend.Services.ai.GeminiTestService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/test")
public class GeminiTestController {

    private final GeminiTestService geminiTestService;

    public GeminiTestController(GeminiTestService geminiTestService) {
        this.geminiTestService = geminiTestService;
    }

    @GetMapping("/gemini")
    public ResponseEntity<String> testGemini() {
        String result = geminiTestService.testGemini();
        return ResponseEntity.ok(result);
    }
}
