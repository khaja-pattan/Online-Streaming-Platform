package com.streamflix.watchlist.service;

import com.streamflix.watchlist.client.MovieCatalogClient;
import com.streamflix.watchlist.dto.MovieSummaryDto;
import com.streamflix.watchlist.dto.WatchlistResponseDto;
import com.streamflix.watchlist.model.WatchlistItem;
import com.streamflix.watchlist.repository.WatchlistRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
public class WatchlistService {

    private final WatchlistRepository watchlistRepository;
    private final MovieCatalogClient movieCatalogClient;

    public WatchlistService(WatchlistRepository watchlistRepository, MovieCatalogClient movieCatalogClient) {
        this.watchlistRepository = watchlistRepository;
        this.movieCatalogClient = movieCatalogClient;
    }

    public List<WatchlistResponseDto> getUserWatchlist(Long userId) {
        List<WatchlistItem> items = watchlistRepository.findByUserIdOrderByAddedAtDesc(userId);
        if (items.isEmpty()) {
            return Collections.emptyList();
        }

        List<Long> movieIds = items.stream().map(WatchlistItem::getMovieId).collect(Collectors.toList());

        Map<Long, MovieSummaryDto> movieMap = new HashMap<>();
        try {
            List<MovieSummaryDto> movies = movieCatalogClient.getMoviesByIds(movieIds);
            if (movies != null) {
                movieMap = movies.stream().collect(Collectors.toMap(MovieSummaryDto::getId, Function.identity(), (a, b) -> a));
            }
        } catch (Exception e) {
            // Log warning, return partial or dummy representations if catalog is down
            System.err.println("Failed to fetch movies from MovieCatalogClient: " + e.getMessage());
        }

        final Map<Long, MovieSummaryDto> finalMovieMap = movieMap;
        return items.stream().map(item -> {
            MovieSummaryDto movie = finalMovieMap.get(item.getMovieId());
            if (movie == null) {
                movie = new MovieSummaryDto();
                movie.setId(item.getMovieId());
                movie.setTitle("Movie #" + item.getMovieId());
            }
            return new WatchlistResponseDto(item.getId(), item.getUserId(), item.getMovieId(), item.getAddedAt(), movie);
        }).collect(Collectors.toList());
    }

    @Transactional
    public WatchlistResponseDto addToWatchlist(Long userId, Long movieId) {
        Optional<WatchlistItem> existing = watchlistRepository.findByUserIdAndMovieId(userId, movieId);
        if (existing.isPresent()) {
            WatchlistItem item = existing.get();
            MovieSummaryDto movie = null;
            try {
                movie = movieCatalogClient.getMovieById(movieId);
            } catch (Exception e) {
                movie = new MovieSummaryDto();
                movie.setId(movieId);
            }
            return new WatchlistResponseDto(item.getId(), item.getUserId(), item.getMovieId(), item.getAddedAt(), movie);
        }

        WatchlistItem item = new WatchlistItem(userId, movieId);
        WatchlistItem saved = watchlistRepository.save(item);

        MovieSummaryDto movie = null;
        try {
            movie = movieCatalogClient.getMovieById(movieId);
        } catch (Exception e) {
            movie = new MovieSummaryDto();
            movie.setId(movieId);
        }

        return new WatchlistResponseDto(saved.getId(), saved.getUserId(), saved.getMovieId(), saved.getAddedAt(), movie);
    }

    @Transactional
    public void removeFromWatchlist(Long userId, Long movieId) {
        watchlistRepository.deleteByUserIdAndMovieId(userId, movieId);
    }

    public boolean isInWatchlist(Long userId, Long movieId) {
        return watchlistRepository.existsByUserIdAndMovieId(userId, movieId);
    }

    public List<Long> getWatchlistMovieIds(Long userId) {
        return watchlistRepository.findMovieIdsByUserId(userId);
    }
}
