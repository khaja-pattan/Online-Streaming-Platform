package com.streamflix.watchlist.client;

import com.streamflix.watchlist.dto.MovieSummaryDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;

@FeignClient(name = "MOVIE-CATALOG-SERVICE")
public interface MovieCatalogClient {

    @GetMapping("/api/movies/{id}")
    MovieSummaryDto getMovieById(@PathVariable("id") Long id);

    @PostMapping("/api/movies/batch")
    List<MovieSummaryDto> getMoviesByIds(@RequestBody List<Long> ids);
}
