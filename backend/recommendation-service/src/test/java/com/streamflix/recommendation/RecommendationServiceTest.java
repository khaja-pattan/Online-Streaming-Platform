package com.streamflix.recommendation;

import com.streamflix.recommendation.client.MovieCatalogClient;
import com.streamflix.recommendation.client.WatchlistClient;
import com.streamflix.recommendation.dto.MovieDto;
import com.streamflix.recommendation.service.RecommendationService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class RecommendationServiceTest {

    @Mock
    private MovieCatalogClient movieCatalogClient;

    @Mock
    private WatchlistClient watchlistClient;

    private RecommendationService recommendationService;

    @BeforeEach
    void setUp() {
        recommendationService = new RecommendationService(movieCatalogClient, watchlistClient);
    }

    @Test
    void getRecommendations_Unauthenticated_ReturnsTrending() {
        MovieDto movie = new MovieDto();
        movie.setId(1L);
        movie.setTitle("Trending Movie");
        when(movieCatalogClient.getTrendingMovies()).thenReturn(List.of(movie));

        List<MovieDto> result = recommendationService.getRecommendations(null);

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("Trending Movie", result.get(0).getTitle());
    }

    @Test
    void getRecommendations_WithWatchlist_RecommendsMatchingGenres() {
        Long userId = 5L;
        when(watchlistClient.getUserMovieIds(userId)).thenReturn(List.of(10L));

        MovieDto savedMovie = new MovieDto();
        savedMovie.setId(10L);
        savedMovie.setGenre("Sci-Fi");
        when(movieCatalogClient.getMoviesByIds(List.of(10L))).thenReturn(List.of(savedMovie));

        MovieDto candidate = new MovieDto();
        candidate.setId(20L);
        candidate.setTitle("Recommended Sci-Fi");
        candidate.setRating(9.0);
        when(movieCatalogClient.getMoviesByGenre("Sci-Fi")).thenReturn(List.of(savedMovie, candidate));

        List<MovieDto> result = recommendationService.getRecommendations(userId);

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("Recommended Sci-Fi", result.get(0).getTitle());
        assertEquals(20L, result.get(0).getId());
    }
}
