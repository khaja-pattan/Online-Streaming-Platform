package com.streamflix.watchlist;

import com.streamflix.watchlist.client.MovieCatalogClient;
import com.streamflix.watchlist.dto.MovieSummaryDto;
import com.streamflix.watchlist.dto.WatchlistResponseDto;
import com.streamflix.watchlist.model.WatchlistItem;
import com.streamflix.watchlist.repository.WatchlistRepository;
import com.streamflix.watchlist.service.WatchlistService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class WatchlistServiceTest {

    @Mock
    private WatchlistRepository watchlistRepository;

    @Mock
    private MovieCatalogClient movieCatalogClient;

    private WatchlistService watchlistService;

    @BeforeEach
    void setUp() {
        watchlistService = new WatchlistService(watchlistRepository, movieCatalogClient);
    }

    @Test
    void addToWatchlist_Success() {
        when(watchlistRepository.existsByUserIdAndMovieId(1L, 100L)).thenReturn(false);

        WatchlistItem saved = new WatchlistItem(1L, 100L);
        saved.setId(10L);
        when(watchlistRepository.save(any(WatchlistItem.class))).thenReturn(saved);

        MovieSummaryDto movie = new MovieSummaryDto();
        movie.setId(100L);
        movie.setTitle("Dune: Part Two");
        when(movieCatalogClient.getMovieById(100L)).thenReturn(movie);

        WatchlistResponseDto result = watchlistService.addToWatchlist(1L, 100L);

        assertNotNull(result);
        assertEquals(1L, result.getUserId());
        assertEquals(100L, result.getMovieId());
        assertEquals("Dune: Part Two", result.getMovie().getTitle());
    }

    @Test
    void addToWatchlist_Duplicate_ThrowsException() {
        when(watchlistRepository.existsByUserIdAndMovieId(1L, 100L)).thenReturn(true);
        assertThrows(IllegalArgumentException.class, () -> watchlistService.addToWatchlist(1L, 100L));
    }

    @Test
    void removeFromWatchlist_Success() {
        when(watchlistRepository.existsByUserIdAndMovieId(1L, 100L)).thenReturn(true);
        watchlistService.removeFromWatchlist(1L, 100L);
        verify(watchlistRepository, times(1)).deleteByUserIdAndMovieId(1L, 100L);
    }
}
