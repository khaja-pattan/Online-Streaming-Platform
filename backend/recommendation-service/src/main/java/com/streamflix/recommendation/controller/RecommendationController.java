package com.streamflix.recommendation.controller;

import com.streamflix.recommendation.dto.MovieDto;
import com.streamflix.recommendation.service.RecommendationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/recommendations")
public class RecommendationController {

    private final RecommendationService recommendationService;

    public RecommendationController(RecommendationService recommendationService) {
        this.recommendationService = recommendationService;
    }

    @GetMapping
    public ResponseEntity<List<MovieDto>> getRecommendations(
            @RequestHeader(value = "X-User-Id", required = false) String xUserId) {
        Long userId = null;
        if (xUserId != null && !xUserId.isBlank()) {
            try {
                userId = Long.parseLong(xUserId);
            } catch (NumberFormatException ignored) {
            }
        }

        List<MovieDto> recommendations = recommendationService.getRecommendations(userId);
        return ResponseEntity.ok(recommendations);
    }
}
