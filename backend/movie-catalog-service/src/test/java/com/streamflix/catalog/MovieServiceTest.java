package com.streamflix.catalog;

import com.streamflix.catalog.dto.MovieCreateRequest;
import com.streamflix.catalog.dto.MovieDto;
import com.streamflix.catalog.model.Movie;
import com.streamflix.catalog.repository.MovieRepository;
import com.streamflix.catalog.service.MovieService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class MovieServiceTest {

    @Mock
    private MovieRepository movieRepository;

    private MovieService movieService;

    @BeforeEach
    void setUp() {
        movieService = new MovieService(movieRepository);
    }

    @Test
    void createMovie_Success() {
        MovieCreateRequest request = new MovieCreateRequest();
        request.setTitle("Test Trailer");
        request.setOfficialTrailerUrl("https://www.youtube.com/watch?v=Way9Dexny3w");
        request.setGenre("Sci-Fi");

        Movie saved = new Movie();
        saved.setId(1L);
        saved.setTitle("Test Trailer");
        saved.setOfficialTrailerUrl("https://www.youtube-nocookie.com/embed/Way9Dexny3w");
        saved.setYoutubeVideoId("Way9Dexny3w");
        saved.setGenre("Sci-Fi");

        when(movieRepository.save(any(Movie.class))).thenReturn(saved);

        MovieDto result = movieService.createMovie(request);

        assertNotNull(result);
        assertEquals("Test Trailer", result.getTitle());
        assertEquals("Way9Dexny3w", result.getYoutubeVideoId());
        assertEquals("https://www.youtube-nocookie.com/embed/Way9Dexny3w", result.getOfficialTrailerUrl());
    }

    @Test
    void getMovieById_Success() {
        Movie movie = new Movie();
        movie.setId(5L);
        movie.setTitle("Inception");
        movie.setYoutubeVideoId("YoHD9XEInc0");
        movie.setOfficialTrailerUrl("https://www.youtube-nocookie.com/embed/YoHD9XEInc0");

        when(movieRepository.findById(5L)).thenReturn(Optional.of(movie));

        MovieDto result = movieService.getMovieById(5L);
        assertNotNull(result);
        assertEquals(5L, result.getId());
        assertEquals("Inception", result.getTitle());
    }

    @Test
    void getMovieById_NotFound_ThrowsException() {
        when(movieRepository.findById(999L)).thenReturn(Optional.empty());
        assertThrows(IllegalArgumentException.class, () -> movieService.getMovieById(999L));
    }
}
