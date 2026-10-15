package com.streamflix.watchlist.repository;

import com.streamflix.watchlist.model.WatchlistItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface WatchlistRepository extends JpaRepository<WatchlistItem, Long> {

    List<WatchlistItem> findByUserIdOrderByAddedAtDesc(Long userId);

    Optional<WatchlistItem> findByUserIdAndMovieId(Long userId, Long movieId);

    boolean existsByUserIdAndMovieId(Long userId, Long movieId);

    void deleteByUserIdAndMovieId(Long userId, Long movieId);

    @Query("SELECT w.movieId FROM WatchlistItem w WHERE w.userId = :userId")
    List<Long> findMovieIdsByUserId(@Param("userId") Long userId);
}
