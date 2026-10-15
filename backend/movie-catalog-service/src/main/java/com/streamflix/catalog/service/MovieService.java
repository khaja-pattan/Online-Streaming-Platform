package com.streamflix.catalog.service;

import com.streamflix.catalog.dto.MovieCreateRequest;
import com.streamflix.catalog.dto.MovieDto;
import com.streamflix.catalog.dto.PageResponse;
import com.streamflix.catalog.model.Movie;
import com.streamflix.catalog.repository.MovieRepository;
import com.streamflix.catalog.util.TrailerValidator;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class MovieService {

    private final MovieRepository movieRepository;

    public MovieService(MovieRepository movieRepository) {
        this.movieRepository = movieRepository;
    }

    public PageResponse<MovieDto> getAllMovies(int page, int size, String sortBy, String sortDir, String genre) {
        Sort.Direction direction = "desc".equalsIgnoreCase(sortDir) ? Sort.Direction.DESC : Sort.Direction.ASC;
        Sort sort = Sort.by(direction, sortBy != null ? sortBy : "id");
        Pageable pageable = PageRequest.of(page, size, sort);

        Page<Movie> moviePage;
        if (genre != null && !genre.isBlank() && !genre.equalsIgnoreCase("all")) {
            moviePage = movieRepository.findByGenreContainingIgnoreCase(genre.trim(), pageable);
        } else {
            moviePage = movieRepository.findAll(pageable);
        }

        List<MovieDto> dtos = moviePage.getContent().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());

        return new PageResponse<>(
                dtos,
                moviePage.getNumber(),
                moviePage.getSize(),
                moviePage.getTotalElements(),
                moviePage.getTotalPages(),
                moviePage.isLast()
        );
    }

    public MovieDto getMovieById(Long id) {
        Movie movie = movieRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Movie with ID " + id + " not found."));
        return mapToDto(movie);
    }

    public List<MovieDto> searchMovies(String keyword) {
        if (keyword == null || keyword.trim().isEmpty()) {
            return movieRepository.findTop10ByOrderByRatingDesc().stream()
                    .map(this::mapToDto)
                    .collect(Collectors.toList());
        }
        return movieRepository.searchByKeyword(keyword.trim()).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public List<MovieDto> getMoviesByGenre(String genre) {
        return movieRepository.findByGenreContainingIgnoreCase(genre).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public List<MovieDto> getTrendingMovies() {
        return movieRepository.findTop10ByOrderByRatingDesc().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public List<MovieDto> getFeaturedMovies() {
        List<Movie> featured = movieRepository.findByFeaturedTrue();
        if (featured.isEmpty()) {
            featured = movieRepository.findTop10ByOrderByRatingDesc();
        }
        return featured.stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public List<MovieDto> getMoviesByIds(List<Long> ids) {
        if (ids == null || ids.isEmpty()) {
            return List.of();
        }
        return movieRepository.findByIdIn(ids).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public MovieDto createMovie(MovieCreateRequest request) {
        // Enforce strict Copyright-Safe YouTube trailer validation
        String videoId = TrailerValidator.extractAndValidateVideoId(request.getOfficialTrailerUrl());
        String embedUrl = TrailerValidator.buildEmbedUrl(videoId);

        Movie movie = new Movie();
        movie.setTitle(request.getTitle().trim());
        movie.setDescription(request.getDescription());
        movie.setReleaseDate(request.getReleaseDate());
        movie.setGenre(request.getGenre());
        movie.setPosterUrl(request.getPosterUrl());
        movie.setBackdropUrl(request.getBackdropUrl());
        movie.setOfficialTrailerUrl(embedUrl);
        movie.setYoutubeVideoId(videoId);
        movie.setDirector(request.getDirector());
        movie.setCast(request.getCast());
        movie.setRuntime(request.getRuntime());
        movie.setContentRating(request.getContentRating());
        movie.setRating(request.getRating() != null ? request.getRating() : 8.0);
        movie.setFeatured(request.getFeatured() != null ? request.getFeatured() : false);

        Movie saved = movieRepository.save(movie);
        return mapToDto(saved);
    }

    @Transactional
    public MovieDto updateMovie(Long id, MovieCreateRequest request) {
        Movie movie = movieRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Movie with ID " + id + " not found."));

        if (request.getTitle() != null && !request.getTitle().isBlank()) {
            movie.setTitle(request.getTitle().trim());
        }
        if (request.getDescription() != null) {
            movie.setDescription(request.getDescription());
        }
        if (request.getReleaseDate() != null) {
            movie.setReleaseDate(request.getReleaseDate());
        }
        if (request.getGenre() != null) {
            movie.setGenre(request.getGenre());
        }
        if (request.getPosterUrl() != null) {
            movie.setPosterUrl(request.getPosterUrl());
        }
        if (request.getBackdropUrl() != null) {
            movie.setBackdropUrl(request.getBackdropUrl());
        }
        if (request.getOfficialTrailerUrl() != null && !request.getOfficialTrailerUrl().isBlank()) {
            String videoId = TrailerValidator.extractAndValidateVideoId(request.getOfficialTrailerUrl());
            movie.setYoutubeVideoId(videoId);
            movie.setOfficialTrailerUrl(TrailerValidator.buildEmbedUrl(videoId));
        }
        if (request.getDirector() != null) {
            movie.setDirector(request.getDirector());
        }
        if (request.getCast() != null) {
            movie.setCast(request.getCast());
        }
        if (request.getRuntime() != null) {
            movie.setRuntime(request.getRuntime());
        }
        if (request.getContentRating() != null) {
            movie.setContentRating(request.getContentRating());
        }
        if (request.getRating() != null) {
            movie.setRating(request.getRating());
        }
        if (request.getFeatured() != null) {
            movie.setFeatured(request.getFeatured());
        }

        Movie updated = movieRepository.save(movie);
        return mapToDto(updated);
    }

    @Transactional
    public void deleteMovie(Long id) {
        if (!movieRepository.existsById(id)) {
            throw new IllegalArgumentException("Movie with ID " + id + " does not exist.");
        }
        movieRepository.deleteById(id);
    }

    public MovieDto mapToDto(Movie movie) {
        return new MovieDto(
                movie.getId(),
                movie.getTitle(),
                movie.getDescription(),
                movie.getReleaseDate(),
                movie.getGenre(),
                movie.getPosterUrl(),
                movie.getBackdropUrl(),
                movie.getOfficialTrailerUrl(),
                movie.getYoutubeVideoId(),
                movie.getDirector(),
                movie.getCast(),
                movie.getRuntime(),
                movie.getContentRating(),
                movie.getRating(),
                movie.getFeatured(),
                movie.getCreatedAt()
        );
    }
}
