package com.streamflix.recommendation.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

@FeignClient(name = "WATCHLIST-SERVICE")
public interface WatchlistClient {

    @GetMapping("/api/watchlist/user/{userId}/movies")
    List<Long> getUserMovieIds(@PathVariable("userId") Long userId);
}
