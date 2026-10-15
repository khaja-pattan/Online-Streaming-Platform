import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, SlidersHorizontal, Film, X } from 'lucide-react';
import MovieCard from '../components/MovieCard';
import LoadingSpinner from '../components/LoadingSpinner';
import api from '../services/api';
import { GENRES } from '../data/seedMovies';

export default function Browse() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  // Read URL query parameters
  const initialSearch = searchParams.get('search') || '';
  const initialGenre = searchParams.get('genre') || 'All';
  const initialSort = searchParams.get('sort') || 'rating_desc';

  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [selectedGenre, setSelectedGenre] = useState(initialGenre);
  const [sortBy, setSortBy] = useState(initialSort);

  // Sync state if URL query params change
  useEffect(() => {
    setSearchTerm(searchParams.get('search') || '');
    setSelectedGenre(searchParams.get('genre') || 'All');
    setSortBy(searchParams.get('sort') || 'rating_desc');
  }, [searchParams]);

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      try {
        const res = await api.movies.getAll(0, 50);
        setMovies(res.content || []);
      } catch (err) {
        console.warn('Error loading browse movies:', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchMovies();
  }, []);

  // Update URL query parameters on filter changes
  const updateFilters = (newSearch, newGenre, newSort) => {
    const params = new URLSearchParams();
    if (newSearch) params.set('search', newSearch);
    if (newGenre && newGenre !== 'All') params.set('genre', newGenre);
    if (newSort && newSort !== 'rating_desc') params.set('sort', newSort);
    setSearchParams(params);
  };

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchTerm(val);
    updateFilters(val, selectedGenre, sortBy);
  };

  const handleGenreSelect = (genre) => {
    setSelectedGenre(genre);
    updateFilters(searchTerm, genre, sortBy);
  };

  const handleSortChange = (e) => {
    const val = e.target.value;
    setSortBy(val);
    updateFilters(searchTerm, selectedGenre, val);
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedGenre('All');
    setSortBy('rating_desc');
    setSearchParams({});
  };

  // Filter and sort movies client-side for ultra-responsive feel
  const filteredMovies = useMemo(() => {
    let result = [...movies];

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase().trim();
      result = result.filter(
        (m) =>
          m.title.toLowerCase().includes(q) ||
          (m.genre && m.genre.toLowerCase().includes(q)) ||
          (m.director && m.director.toLowerCase().includes(q)) ||
          (m.cast && m.cast.toLowerCase().includes(q))
      );
    }

    if (selectedGenre && selectedGenre !== 'All') {
      result = result.filter(
        (m) => m.genre && m.genre.toLowerCase().includes(selectedGenre.toLowerCase())
      );
    }

    // Sort
    result.sort((a, b) => {
      if (sortBy === 'rating_desc') return (b.rating || 0) - (a.rating || 0);
      if (sortBy === 'rating_asc') return (a.rating || 0) - (b.rating || 0);
      if (sortBy === 'date_desc') return (b.releaseDate || '').localeCompare(a.releaseDate || '');
      if (sortBy === 'date_asc') return (a.releaseDate || '').localeCompare(b.releaseDate || '');
      if (sortBy === 'title_asc') return (a.title || '').localeCompare(b.title || '');
      if (sortBy === 'title_desc') return (b.title || '').localeCompare(a.title || '');
      return 0;
    });

    return result;
  }, [movies, searchTerm, selectedGenre, sortBy]);

  return (
    <div className="min-h-screen bg-[#0B0B0E] pt-24 pb-20 px-4 sm:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Browse Movie Trailers
        </h1>
        <p className="text-gray-400 text-sm mt-1">
          Explore upcoming blockbusters, trending teasers, and critically acclaimed movie trailers.
        </p>
      </div>

      {/* Controls Bar: Search & Sort */}
      <div className="bg-[#14141A] border border-white/5 rounded-2xl p-4 sm:p-5 mb-6 flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between shadow-xl">
        {/* Search Input */}
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search by title, director, or cast..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full px-4 py-2.5 pl-10 rounded-xl bg-black/40 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-[#E50914] text-sm"
          />
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          {searchTerm && (
            <button
              onClick={() => {
                setSearchTerm('');
                updateFilters('', selectedGenre, sortBy);
              }}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-3">
          <label className="text-xs font-semibold text-gray-400 flex items-center gap-1.5 shrink-0">
            <SlidersHorizontal size={14} /> Sort By:
          </label>
          <select
            value={sortBy}
            onChange={handleSortChange}
            className="px-3 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-sm focus:outline-none focus:border-[#E50914]"
          >
            <option value="rating_desc">Highest Rated</option>
            <option value="rating_asc">Lowest Rated</option>
            <option value="date_desc">Release Date (Newest)</option>
            <option value="date_asc">Release Date (Oldest)</option>
            <option value="title_asc">Title (A - Z)</option>
            <option value="title_desc">Title (Z - A)</option>
          </select>
        </div>
      </div>

      {/* Genre Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-4 mb-6">
        {GENRES.map((genre) => (
          <button
            key={genre}
            onClick={() => handleGenreSelect(genre)}
            className={`px-4 py-2 rounded-full text-xs font-semibold transition shrink-0 border ${
              selectedGenre === genre
                ? 'bg-[#E50914] text-white border-[#E50914] shadow-md'
                : 'bg-white/5 text-gray-300 hover:bg-white/10 border-white/10 hover:text-white'
            }`}
          >
            {genre}
          </button>
        ))}
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-gray-400 mb-6">
        <span>
          Showing <strong className="text-white">{filteredMovies.length}</strong> trailers
          {selectedGenre !== 'All' && <span> in <strong className="text-white">{selectedGenre}</strong></span>}
          {searchTerm && <span> matching "<strong className="text-white">{searchTerm}</strong>"</span>}
        </span>

        {(searchTerm || selectedGenre !== 'All') && (
          <button
            onClick={handleClearFilters}
            className="text-[#E50914] hover:underline font-semibold"
          >
            Clear all filters
          </button>
        )}
      </div>

      {/* Movie Cards Grid */}
      {loading ? (
        <LoadingSpinner text="Searching trailer catalog..." />
      ) : filteredMovies.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
          {filteredMovies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center bg-[#131318] border border-white/5 rounded-2xl">
          <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-gray-400 mb-4">
            <Film size={32} />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">No movie trailers found</h3>
          <p className="text-gray-400 text-sm max-w-md mb-6">
            We couldn't find any trailers matching your criteria. Try adjusting your search keywords or clearing your genre filter.
          </p>
          <button
            onClick={handleClearFilters}
            className="px-6 py-2.5 rounded-xl bg-[#E50914] text-white font-semibold text-sm hover:bg-[#F40612] transition"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
}
