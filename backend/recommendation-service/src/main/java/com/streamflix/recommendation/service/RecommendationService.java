package com.streamflix.recommendation.service;

import com.streamflix.recommendation.client.MovieCatalogClient;
import com.streamflix.recommendation.client.WatchlistClient;
import com.streamflix.recommendation.dto.MovieDto;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class RecommendationService {

    private final MovieCatalogClient movieCatalogClient;
    private final WatchlistClient watchlistClient;

    public RecommendationService(MovieCatalogClient movieCatalogClient, WatchlistClient watchlistClient) {
        this.movieCatalogClient = movieCatalogClient;
        this.watchlistClient = watchlistClient;
    }

    public List<MovieDto> getRecommendations(Long userId) {
        if (userId != null) {
            try {
                List<Long> savedMovieIds = watchlistClient.getUserMovieIds(userId);
                if (savedMovieIds != null && !savedMovieIds.isEmpty()) {
                    List<MovieDto> userMovies = movieCatalogClient.getMoviesByIds(savedMovieIds);
                    if (userMovies != null && !userMovies.isEmpty()) {
                        // Extract distinct primary genres
                        Set<String> preferredGenres = new HashSet<>();
                        for (MovieDto movie : userMovies) {
                            if (movie.getGenre() != null) {
                                String[] genres = movie.getGenre().split(",");
                                for (String g : genres) {
                                    preferredGenres.add(g.trim());
                                }
                            }
                        }

                        // Collect candidate movies matching preferred genres
                        Set<Long> savedSet = new HashSet<>(savedMovieIds);
                        Map<Long, MovieDto> recommendedMap = new LinkedHashMap<>();

                        for (String genre : preferredGenres) {
                            try {
                                List<MovieDto> genreMovies = movieCatalogClient.getMoviesByGenre(genre);
                                if (genreMovies != null) {
                                    for (MovieDto gm : genreMovies) {
                                        if (!savedSet.contains(gm.getId())) {
                                            recommendedMap.putIfAbsent(gm.getId(), gm);
                                        }
                                    }
                                }
                            } catch (Exception ignored) {
                            }
                        }

                        if (!recommendedMap.isEmpty()) {
                            return recommendedMap.values().stream()
                                    .sorted((a, b) -> Double.compare(
                                            b.getRating() != null ? b.getRating() : 0.0,
                                            a.getRating() != null ? a.getRating() : 0.0))
                                    .limit(10)
                                    .collect(Collectors.toList());
                        }
                    }
                }
            } catch (Exception e) {
                System.err.println("Warning: Could not compute personalized recommendations: " + e.getMessage());
            }
        }

        // Fallback: Trending / Top-rated movies
        try {
            return movieCatalogClient.getTrendingMovies();
        } catch (Exception e) {
            System.err.println("Warning: Could not fetch trending movies: " + e.getMessage());
            return Collections.emptyList();
        }
    }
}
