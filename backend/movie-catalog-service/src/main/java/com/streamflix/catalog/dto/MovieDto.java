package com.streamflix.catalog.dto;

import java.time.LocalDateTime;

public class MovieDto {

    private Long id;
    private String title;
    private String description;
    private String releaseDate;
    private String genre;
    private String posterUrl;
    private String backdropUrl;
    private String officialTrailerUrl;
    private String youtubeVideoId;
    private String director;
    private String cast;
    private Integer runtime;
    private String contentRating;
    private Double rating;
    private Boolean featured;
    private LocalDateTime createdAt;

    public MovieDto() {
    }

    public MovieDto(Long id, String title, String description, String releaseDate, String genre,
                    String posterUrl, String backdropUrl, String officialTrailerUrl,
                    String youtubeVideoId, String director, String cast, Integer runtime,
                    String contentRating, Double rating, Boolean featured, LocalDateTime createdAt) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.releaseDate = releaseDate;
        this.genre = genre;
        this.posterUrl = posterUrl;
        this.backdropUrl = backdropUrl;
        this.officialTrailerUrl = officialTrailerUrl;
        this.youtubeVideoId = youtubeVideoId;
        this.director = director;
        this.cast = cast;
        this.runtime = runtime;
        this.contentRating = contentRating;
        this.rating = rating;
        this.featured = featured;
        this.createdAt = createdAt;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getReleaseDate() {
        return releaseDate;
    }

    public void setReleaseDate(String releaseDate) {
        this.releaseDate = releaseDate;
    }

    public String getGenre() {
        return genre;
    }

    public void setGenre(String genre) {
        this.genre = genre;
    }

    public String getPosterUrl() {
        return posterUrl;
    }

    public void setPosterUrl(String posterUrl) {
        this.posterUrl = posterUrl;
    }

    public String getBackdropUrl() {
        return backdropUrl;
    }

    public void setBackdropUrl(String backdropUrl) {
        this.backdropUrl = backdropUrl;
    }

    public String getOfficialTrailerUrl() {
        return officialTrailerUrl;
    }

    public void setOfficialTrailerUrl(String officialTrailerUrl) {
        this.officialTrailerUrl = officialTrailerUrl;
    }

    public String getYoutubeVideoId() {
        return youtubeVideoId;
    }

    public void setYoutubeVideoId(String youtubeVideoId) {
        this.youtubeVideoId = youtubeVideoId;
    }

    public String getDirector() {
        return director;
    }

    public void setDirector(String director) {
        this.director = director;
    }

    public String getCast() {
        return cast;
    }

    public void setCast(String cast) {
        this.cast = cast;
    }

    public Integer getRuntime() {
        return runtime;
    }

    public void setRuntime(Integer runtime) {
        this.runtime = runtime;
    }

    public String getContentRating() {
        return contentRating;
    }

    public void setContentRating(String contentRating) {
        this.contentRating = contentRating;
    }

    public Double getRating() {
        return rating;
    }

    public void setRating(Double rating) {
        this.rating = rating;
    }

    public Boolean getFeatured() {
        return featured;
    }

    public void setFeatured(Boolean featured) {
        this.featured = featured;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
