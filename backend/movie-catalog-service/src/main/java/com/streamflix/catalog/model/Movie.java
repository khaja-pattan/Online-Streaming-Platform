package com.streamflix.catalog.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "movies")
public class Movie {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "release_date")
    private String releaseDate;

    private String genre;

    @Column(name = "poster_url", length = 500)
    private String posterUrl;

    @Column(name = "backdrop_url", length = 500)
    private String backdropUrl;

    @Column(name = "official_trailer_url", length = 500, nullable = false)
    private String officialTrailerUrl;

    @Column(name = "youtube_video_id", length = 50, nullable = false)
    private String youtubeVideoId;

    private String director;

    @Column(name = "movie_cast", length = 500)
    private String cast;

    private Integer runtime; // minutes

    @Column(name = "content_rating")
    private String contentRating; // e.g., PG-13, R

    private Double rating; // e.g., 8.8

    private Boolean featured;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    public Movie() {
    }

    public Movie(String title, String description, String releaseDate, String genre,
                 String posterUrl, String backdropUrl, String officialTrailerUrl,
                 String youtubeVideoId, String director, String cast, Integer runtime,
                 String contentRating, Double rating, Boolean featured) {
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
    }

    @PrePersist
    protected void onCreate() {
        if (this.createdAt == null) {
            this.createdAt = LocalDateTime.now();
        }
        if (this.featured == null) {
            this.featured = false;
        }
        if (this.rating == null) {
            this.rating = 8.0;
        }
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
