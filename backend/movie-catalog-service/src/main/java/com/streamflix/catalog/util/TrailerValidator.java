package com.streamflix.catalog.util;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class TrailerValidator {

    // Regex for YouTube video IDs: 11 alphanumeric characters plus _ and -
    private static final Pattern YOUTUBE_ID_PATTERN = Pattern.compile("^[a-zA-Z0-9_-]{11}$");

    // Regex matching YouTube watch, embed, short URLs
    private static final Pattern YOUTUBE_URL_PATTERN = Pattern.compile(
            "(?:https?:\\/\\/)?(?:www\\.|m\\.)?(?:youtube\\.com\\/(?:watch\\?v=|embed\\/|v\\/)|youtu\\.be\\/|youtube-nocookie\\.com\\/embed\\/)([a-zA-Z0-9_-]{11})"
    );

    /**
     * Extracts and validates the YouTube video ID from a URL or raw ID string.
     * Throws IllegalArgumentException if not an approved official YouTube trailer format.
     */
    public static String extractAndValidateVideoId(String input) {
        if (input == null || input.trim().isEmpty()) {
            throw new IllegalArgumentException("Trailer URL or YouTube Video ID cannot be empty.");
        }

        String trimmed = input.trim();

        // 1. Check if direct 11-char ID
        if (YOUTUBE_ID_PATTERN.matcher(trimmed).matches()) {
            return trimmed;
        }

        // 2. Check if valid YouTube URL
        Matcher matcher = YOUTUBE_URL_PATTERN.matcher(trimmed);
        if (matcher.find()) {
            return matcher.group(1);
        }

        throw new IllegalArgumentException(
                "Invalid trailer source. StreamFlix only permits authorized YouTube trailer embeds " +
                "(e.g., https://www.youtube.com/watch?v=VIDEO_ID or https://youtu.be/VIDEO_ID). Full movie streaming or external hosts are prohibited."
        );
    }

    /**
     * Builds privacy-enhanced YouTube embed URL from video ID.
     */
    public static String buildEmbedUrl(String videoId) {
        String validId = extractAndValidateVideoId(videoId);
        return "https://www.youtube-nocookie.com/embed/" + validId;
    }
}
