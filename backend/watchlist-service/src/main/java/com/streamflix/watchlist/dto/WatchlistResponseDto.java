package com.streamflix.watchlist.dto;

import java.time.LocalDateTime;

public class WatchlistResponseDto {

    private Long id;
    private Long userId;
    private Long movieId;
    private LocalDateTime addedAt;
    private MovieSummaryDto movie;

    public WatchlistResponseDto() {
    }

    public WatchlistResponseDto(Long id, Long userId, Long movieId, LocalDateTime addedAt, MovieSummaryDto movie) {
        this.id = id;
        this.userId = userId;
        this.movieId = movieId;
        this.addedAt = addedAt;
        this.movie = movie;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Long getMovieId() {
        return movieId;
    }

    public void setMovieId(Long movieId) {
        this.movieId = movieId;
    }

    public LocalDateTime getAddedAt() {
        return addedAt;
    }

    public void setAddedAt(LocalDateTime addedAt) {
        this.addedAt = addedAt;
    }

    public MovieSummaryDto getMovie() {
        return movie;
    }

    public void setMovie(MovieSummaryDto movie) {
        this.movie = movie;
    }
}
