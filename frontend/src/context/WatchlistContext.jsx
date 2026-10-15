import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';

const WatchlistContext = createContext(null);

export const WatchlistProvider = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  const [watchlist, setWatchlist] = useState([]);
  const [watchlistIds, setWatchlistIds] = useState(new Set());
  const [loading, setLoading] = useState(false);

  const fetchWatchlist = useCallback(async () => {
    if (!isAuthenticated) {
      setWatchlist([]);
      setWatchlistIds(new Set());
      return;
    }
    setLoading(true);
    try {
      const items = await api.watchlist.get();
      setWatchlist(items || []);
      const ids = new Set((items || []).map(i => i.movieId || i.id));
      setWatchlistIds(ids);
    } catch (err) {
      console.warn('Error fetching watchlist:', err.message);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchWatchlist();
  }, [fetchWatchlist, user]);

  const addToWatchlist = async (movie) => {
    if (!isAuthenticated) {
      throw new Error('Please sign in to add movies to your watchlist.');
    }
    const movieId = movie.id;
    // Optimistic update
    setWatchlistIds(prev => new Set([...prev, movieId]));
    setWatchlist(prev => [{ id: movieId, movieId, movie, addedAt: new Date().toISOString() }, ...prev]);

    try {
      await api.watchlist.add(movieId);
    } catch (err) {
      console.warn('Watchlist add rollback:', err.message);
      // rollback on error
      setWatchlistIds(prev => {
        const copy = new Set(prev);
        copy.delete(movieId);
        return copy;
      });
      setWatchlist(prev => prev.filter(i => (i.movieId || i.id) !== movieId));
      throw err;
    }
  };

  const removeFromWatchlist = async (movieId) => {
    if (!isAuthenticated) return;

    // Optimistic update
    setWatchlistIds(prev => {
      const copy = new Set(prev);
      copy.delete(movieId);
      return copy;
    });
    setWatchlist(prev => prev.filter(i => (i.movieId || i.id) !== movieId));

    try {
      await api.watchlist.remove(movieId);
    } catch (err) {
      console.warn('Watchlist remove error:', err.message);
      fetchWatchlist(); // re-fetch on failure
    }
  };

  const isInWatchlist = (movieId) => {
    return watchlistIds.has(Number(movieId));
  };

  return (
    <WatchlistContext.Provider
      value={{
        watchlist,
        watchlistIds,
        loading,
        addToWatchlist,
        removeFromWatchlist,
        isInWatchlist,
        refreshWatchlist: fetchWatchlist
      }}
    >
      {children}
    </WatchlistContext.Provider>
  );
};

export const useWatchlist = () => {
  const context = useContext(WatchlistContext);
  if (!context) {
    throw new Error('useWatchlist must be used within a WatchlistProvider');
  }
  return context;
};
