package com.firstimpression.backend.Services.ai;

import com.google.genai.Client;
import com.google.genai.types.GenerateContentResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class GeminiTestService {

    private static final Logger log = LoggerFactory.getLogger(GeminiTestService.class);

    private final Client geminiClient;

    @Value("${gemini.model:gemini-3.5-flash-lite}")
    private String model;

    public GeminiTestService(@org.springframework.beans.factory.annotation.Autowired(required = false) Client geminiClient) {
        this.geminiClient = geminiClient;
    }

    public String testGemini() {
        if (geminiClient == null) {
            return "Gemini client is not initialized (no API key configured).";
        }
        try {
            GenerateContentResponse response = geminiClient.models.generateContent(
                    model,
                    "Reply with exactly: Gemini connection successful",
                    null
            );

            if (response != null && response.text() != null) {
                return response.text().trim();
            }
            return "No response text received from Gemini";
        } catch (Exception e) {
            String safeError = sanitizeErrorMessage(e.getMessage());
            log.error("Gemini API connection test failed: {}", safeError);
            return "Gemini API test failed: " + safeError;
        }
    }

    private String sanitizeErrorMessage(String message) {
        if (message == null) {
            return "Unknown error";
        }
        return message.replaceAll("(?i)key=[^&\\s]+", "key=REDACTED")
                      .replaceAll("AIza[0-9A-Za-z-_]{35}", "REDACTED");
    }
}