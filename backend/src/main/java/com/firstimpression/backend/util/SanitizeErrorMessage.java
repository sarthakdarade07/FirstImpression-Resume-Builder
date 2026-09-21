package com.firstimpression.backend.util;

public class SanitizeErrorMessage {
    
    public static String safeError(String message) {
        if (message == null) return "Unknown error";

        return message
                .replaceAll("(?i)key=[^&\\s]+", "key=REDACTED")
                .replaceAll("(?i)Bearer\\s+[^&\\s]+", "Bearer REDACTED")
                .replaceAll("xai-[0-9A-Za-z-_]{25,}", "REDACTED")
                .replaceAll("AIza[0-9A-Za-z-_]{35}", "REDACTED");
    }
}