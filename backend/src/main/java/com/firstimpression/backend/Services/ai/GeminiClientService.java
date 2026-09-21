package com.firstimpression.backend.Services.ai;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.firstimpression.backend.Exception.ServiceException;
import com.firstimpression.backend.util.SanitizeErrorMessage;
import com.google.api.client.http.HttpStatusCodes;
import com.google.genai.Client;
import com.google.genai.types.GenerateContentResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.List;
import java.util.Map;

@Service
public class GeminiClientService {

    private static final Logger log = LoggerFactory.getLogger(GeminiClientService.class);

    private final Client geminiClient;
    private final HttpClient httpClient = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(15))
            .build();
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Value("${ai.provider:gemini}")
    private String aiProvider;

    @Value("${gemini.model:gemini-3.5-flash-lite}")
    private String geminiModel;

    @Value("${grok.api.key:}")
    private String grokApiKey;

    @Value("${grok.model:grok-2-latest}")
    private String grokModel;

    @Value("${grok.api.url:https://api.x.ai/v1/chat/completions}")
    private String grokApiUrl;
    
      
    
    public GeminiClientService(@Autowired(required = false) Client geminiClient) {
        this.geminiClient = geminiClient;
    }

    public String generateContent(String prompt) {
        boolean useGrok = "grok".equalsIgnoreCase(aiProvider)
                || (geminiClient == null && grokApiKey != null && !grokApiKey.isBlank());

        if (useGrok) {
            return generateWithGrok(prompt);
        }
        return generateWithGemini(prompt);
    }

    private String generateWithGemini(String prompt) {
        if (geminiClient == null) { 
            throw new ServiceException( HttpStatus.SERVICE_UNAVAILABLE,"Gemini client is not initialized.");
        }
        try {
            com.google.genai.types.GenerateContentConfig config = com.google.genai.types.GenerateContentConfig.builder()
                    .responseMimeType("application/json")
                    .build();
            GenerateContentResponse response = geminiClient.models.generateContent(geminiModel, prompt, config);
            if (response == null || response.text() == null) {
                throw new ServiceException( HttpStatus.BAD_GATEWAY,"Empty response received from Gemini API");
 
            }
            return cleanMarkdownJson(response.text());
        } catch (Exception e) {  
            String safeError = SanitizeErrorMessage.safeError(e.getMessage());
            log.error("Gemini API call error: {}", safeError); 
            throw new ServiceException(HttpStatus.BAD_GATEWAY,"Gemini generation failed: " + safeError);
        } 
    } 

    private String generateWithGrok(String prompt) {
        if (grokApiKey == null || grokApiKey.isBlank()) {
            throw new ServiceException(HttpStatus.NOT_FOUND, "Grok API key is missing.");
        }
        try {
            Map<String, Object> body = Map.of(
                    "model", grokModel,
                    "messages", List.of(
                            Map.of("role", "system", "content", "You are an expert AI resume assistant. Output valid JSON when requested."),
                            Map.of("role", "user", "content", prompt)
                    ),
                    "response_format", Map.of("type", "json_object"),
                    "temperature", 0.3
            );

            String jsonPayload = objectMapper.writeValueAsString(body);

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(grokApiUrl))
                    .header("Content-Type", "application/json")
                    .header("Authorization", "Bearer " + grokApiKey.trim())
                    .timeout(Duration.ofSeconds(90))
                    .POST(HttpRequest.BodyPublishers.ofString(jsonPayload))
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() >= 200 && response.statusCode() < 300) {
                JsonNode root = objectMapper.readTree(response.body());
                JsonNode choices = root.path("choices");
                if (choices.isArray() && choices.size() > 0) {
                    String content = choices.get(0).path("message").path("content").asText();
                    return cleanMarkdownJson(content);
                }
                throw new ServiceException(HttpStatus.BAD_GATEWAY,"Grok returned no choices in response");
            } else {
                String safeError = SanitizeErrorMessage.safeError(response.body());
                throw new RuntimeException("Grok API error (" + response.statusCode() + "): " + safeError);
            }
        } catch (Exception e) { 
            String safeError = SanitizeErrorMessage.safeError(e.getMessage());
            log.error("Grok API call error: {}", safeError);
            throw new RuntimeException("Grok generation failed: " + safeError, e);
        }
    }

    private String cleanMarkdownJson(String raw) {
        if (raw == null) return "{}";
        String trimmed = raw.trim();
        if (trimmed.startsWith("```json")) trimmed = trimmed.substring(7);
        else if (trimmed.startsWith("```")) trimmed = trimmed.substring(3);
        if (trimmed.endsWith("```")) trimmed = trimmed.substring(0, trimmed.length() - 3);
        trimmed = trimmed.trim();

        int start = trimmed.indexOf('{');
        int end = trimmed.lastIndexOf('}');
        if (start != -1 && end > start) {
            trimmed = trimmed.substring(start, end + 1);
        }
        return trimmed.trim();
    }

 
}