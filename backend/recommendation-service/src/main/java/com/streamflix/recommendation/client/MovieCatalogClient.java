package com.streamflix.recommendation.client;

import com.streamflix.recommendation.dto.MovieDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;

@FeignClient(name = "MOVIE-CATALOG-SERVICE")
public interface MovieCatalogClient {

    @GetMapping("/api/movies/trending")
    List<MovieDto> getTrendingMovies();

    @GetMapping("/api/movies/genre/{genre}")
    List<MovieDto> getMoviesByGenre(@PathVariable("genre") String genre);

    @PostMapping("/api/movies/batch")
    List<MovieDto> getMoviesByIds(@RequestBody List<Long> ids);
}
