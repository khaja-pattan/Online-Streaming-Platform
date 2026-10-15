package com.streamflix.catalog.controller;

import com.streamflix.catalog.dto.MovieCreateRequest;
import com.streamflix.catalog.dto.MovieDto;
import com.streamflix.catalog.dto.PageResponse;
import com.streamflix.catalog.service.MovieService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/movies")
public class MovieController {

    private final MovieService movieService;

    public MovieController(MovieService movieService) {
        this.movieService = movieService;
    }

    @GetMapping
    public ResponseEntity<PageResponse<MovieDto>> getAllMovies(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir,
            @RequestParam(required = false) String genre) {
        PageResponse<MovieDto> response = movieService.getAllMovies(page, size, sortBy, sortDir, genre);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<MovieDto> getMovieById(@PathVariable Long id) {
        MovieDto movie = movieService.getMovieById(id);
        return ResponseEntity.ok(movie);
    }

    @GetMapping("/search")
    public ResponseEntity<List<MovieDto>> searchMovies(@RequestParam(required = false) String keyword) {
        List<MovieDto> results = movieService.searchMovies(keyword);
        return ResponseEntity.ok(results);
    }

    @GetMapping("/genre/{genre}")
    public ResponseEntity<List<MovieDto>> getMoviesByGenre(@PathVariable String genre) {
        List<MovieDto> results = movieService.getMoviesByGenre(genre);
        return ResponseEntity.ok(results);
    }

    @GetMapping("/trending")
    public ResponseEntity<List<MovieDto>> getTrendingMovies() {
        List<MovieDto> trending = movieService.getTrendingMovies();
        return ResponseEntity.ok(trending);
    }

    @GetMapping("/featured")
    public ResponseEntity<List<MovieDto>> getFeaturedMovies() {
        List<MovieDto> featured = movieService.getFeaturedMovies();
        return ResponseEntity.ok(featured);
    }

    @PostMapping("/batch")
    public ResponseEntity<List<MovieDto>> getMoviesByIds(@RequestBody List<Long> ids) {
        List<MovieDto> movies = movieService.getMoviesByIds(ids);
        return ResponseEntity.ok(movies);
    }

    @PostMapping
    public ResponseEntity<?> createMovie(
            @RequestHeader(value = "X-User-Role", required = false) String userRole,
            @Valid @RequestBody MovieCreateRequest request) {
        if (userRole != null && !userRole.equalsIgnoreCase("ROLE_ADMIN") && !userRole.equalsIgnoreCase("ADMIN")) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Admin privileges required.");
        }
        MovieDto created = movieService.createMovie(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateMovie(
            @RequestHeader(value = "X-User-Role", required = false) String userRole,
            @PathVariable Long id,
            @Valid @RequestBody MovieCreateRequest request) {
        if (userRole != null && !userRole.equalsIgnoreCase("ROLE_ADMIN") && !userRole.equalsIgnoreCase("ADMIN")) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Admin privileges required.");
        }
        MovieDto updated = movieService.updateMovie(id, request);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteMovie(
            @RequestHeader(value = "X-User-Role", required = false) String userRole,
            @PathVariable Long id) {
        if (userRole != null && !userRole.equalsIgnoreCase("ROLE_ADMIN") && !userRole.equalsIgnoreCase("ADMIN")) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Admin privileges required.");
        }
        movieService.deleteMovie(id);
        return ResponseEntity.noContent().build();
    }
}
