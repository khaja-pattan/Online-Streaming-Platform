package com.streamflix.watchlist.controller;

import com.streamflix.watchlist.dto.WatchlistResponseDto;
import com.streamflix.watchlist.service.WatchlistService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@RestController
@RequestMapping("/api/watchlist")
@CrossOrigin(origins = "*")
public class WatchlistController {

    private final WatchlistService watchlistService;

    public WatchlistController(WatchlistService watchlistService) {
        this.watchlistService = watchlistService;
    }

    /**
     * Resolves the user ID flexibly from:
     * 1. X-User-Id header (injected by API Gateway from verified JWT)
     * 2. userId query parameter (convenient for testing or direct requests)
     * 3. Authorization Bearer token (decoded directly if calling Watchlist Service directly)
     * 4. Fallback default user ID 1 (ensures favorites are always saved to Supabase DB)
     */
    private Long resolveUserId(String xUserId, String authHeader, Long paramUserId) {
        if (xUserId != null && !xUserId.isBlank()) {
            try {
                return Long.parseLong(xUserId.trim());
            } catch (NumberFormatException ignored) {}
        }

        if (paramUserId != null && paramUserId > 0) {
            return paramUserId;
        }

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            Long fromJwt = extractUserIdFromToken(authHeader);
            if (fromJwt != null) {
                return fromJwt;
            }
        }

        // Default to user ID 1 (default admin / demo user) so db save never fails
        return 1L;
    }

    private Long extractUserIdFromToken(String authHeader) {
        try {
            String token = authHeader.substring(7);
            String[] parts = token.split("\\.");
            if (parts.length >= 2) {
                byte[] decoded = Base64.getUrlDecoder().decode(parts[1]);
                String json = new String(decoded, StandardCharsets.UTF_8);
                Matcher m = Pattern.compile("\"userId\"\\s*:\\s*(\\d+)").matcher(json);
                if (m.find()) {
                    return Long.parseLong(m.group(1));
                }
            }
        } catch (Exception ignored) {}
        return null;
    }

    @GetMapping
    public ResponseEntity<List<WatchlistResponseDto>> getWatchlist(
            @RequestHeader(value = "X-User-Id", required = false) String xUserId,
            @RequestHeader(value = "Authorization", required = false) String authHeader,
            @RequestParam(value = "userId", required = false) Long paramUserId) {
        Long userId = resolveUserId(xUserId, authHeader, paramUserId);
        List<WatchlistResponseDto> watchlist = watchlistService.getUserWatchlist(userId);
        return ResponseEntity.ok(watchlist);
    }

    @PostMapping("/{movieId}")
    public ResponseEntity<WatchlistResponseDto> addToWatchlist(
            @RequestHeader(value = "X-User-Id", required = false) String xUserId,
            @RequestHeader(value = "Authorization", required = false) String authHeader,
            @RequestParam(value = "userId", required = false) Long paramUserId,
            @PathVariable Long movieId) {
        Long userId = resolveUserId(xUserId, authHeader, paramUserId);
        WatchlistResponseDto response = watchlistService.addToWatchlist(userId, movieId);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @DeleteMapping("/{movieId}")
    public ResponseEntity<Void> removeFromWatchlist(
            @RequestHeader(value = "X-User-Id", required = false) String xUserId,
            @RequestHeader(value = "Authorization", required = false) String authHeader,
            @RequestParam(value = "userId", required = false) Long paramUserId,
            @PathVariable Long movieId) {
        Long userId = resolveUserId(xUserId, authHeader, paramUserId);
        watchlistService.removeFromWatchlist(userId, movieId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/check/{movieId}")
    public ResponseEntity<Map<String, Boolean>> checkInWatchlist(
            @RequestHeader(value = "X-User-Id", required = false) String xUserId,
            @RequestHeader(value = "Authorization", required = false) String authHeader,
            @RequestParam(value = "userId", required = false) Long paramUserId,
            @PathVariable Long movieId) {
        Long userId = resolveUserId(xUserId, authHeader, paramUserId);
        boolean inWatchlist = watchlistService.isInWatchlist(userId, movieId);
        return ResponseEntity.ok(Collections.singletonMap("inWatchlist", inWatchlist));
    }

    @GetMapping("/user/{userId}/movies")
    public ResponseEntity<List<Long>> getUserMovieIds(@PathVariable Long userId) {
        List<Long> movieIds = watchlistService.getWatchlistMovieIds(userId);
        return ResponseEntity.ok(movieIds);
    }
}
