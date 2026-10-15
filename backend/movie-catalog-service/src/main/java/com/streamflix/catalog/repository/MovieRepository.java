package com.streamflix.catalog.repository;

import com.streamflix.catalog.model.Movie;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MovieRepository extends JpaRepository<Movie, Long> {

    Page<Movie> findByGenreContainingIgnoreCase(String genre, Pageable pageable);

    @Query("SELECT m FROM Movie m WHERE LOWER(m.title) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
           "OR LOWER(m.description) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
           "OR LOWER(m.director) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
           "OR LOWER(m.cast) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<Movie> searchByKeyword(@Param("keyword") String keyword);

    List<Movie> findTop10ByOrderByRatingDesc();

    List<Movie> findByFeaturedTrue();

    List<Movie> findByGenreContainingIgnoreCase(String genre);

    List<Movie> findByIdIn(List<Long> ids);
}
