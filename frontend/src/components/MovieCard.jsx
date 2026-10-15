import React from 'react';
import { Play, Bookmark, Check, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTrailerModal } from '../context/TrailerModalContext';
import { useWatchlist } from '../context/WatchlistContext';
import { useAuth } from '../context/AuthContext';

export default function MovieCard({ movie }) {
  const { openTrailer } = useTrailerModal();
  const { isInWatchlist, addToWatchlist, removeFromWatchlist } = useWatchlist();
  const { isAuthenticated } = useAuth();

  if (!movie) return null;

  const inList = isInWatchlist(movie.id);

  const handleWatchlistClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      alert('Please log in to save movies to your personal watchlist.');
      return;
    }
    if (inList) {
      await removeFromWatchlist(movie.id);
    } else {
      await addToWatchlist(movie);
    }
  };

  const handlePlayTrailer = (e) => {
    e.preventDefault();
    e.stopPropagation();
    openTrailer(movie);
  };

  return (
    <div className="group relative rounded-xl overflow-hidden bg-[#16161C] border border-white/5 transition-all duration-300 hover:scale-[1.03] hover:shadow-2xl hover:border-[#E50914]/50 flex flex-col">
      {/* Poster Container */}
      <Link to={`/movies/${movie.id}`} className="block relative aspect-[2/3] w-full overflow-hidden bg-[#0c0c10]">
        <img
          src={movie.posterUrl || 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=500&auto=format&fit=crop&q=60'}
          alt={movie.title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-300" />

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none">
          {movie.rating ? (
            <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/70 backdrop-blur-md text-amber-400 text-xs font-semibold border border-white/10">
              <Star size={12} fill="currentColor" /> {movie.rating}
            </span>
          ) : <span />}

          {movie.contentRating && (
            <span className="px-1.5 py-0.5 rounded bg-black/70 backdrop-blur-md text-gray-300 text-[11px] font-medium border border-white/10">
              {movie.contentRating}
            </span>
          )}
        </div>

        {/* Center Play Trailer Button (appears on hover) */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={handlePlayTrailer}
            className="w-13 h-13 rounded-full bg-[#E50914] text-white flex items-center justify-center shadow-lg transform scale-90 group-hover:scale-100 transition hover:bg-[#F40612] hover:scale-110"
            title="Watch Official Trailer"
            aria-label="Play Trailer"
          >
            <Play size={24} fill="currentColor" className="ml-1" />
          </button>
        </div>

        {/* Watchlist Quick Toggle Button */}
        <button
          onClick={handleWatchlistClick}
          className={`absolute bottom-3 right-3 p-2 rounded-full backdrop-blur-md transition z-10 ${
            inList
              ? 'bg-emerald-500/80 text-white'
              : 'bg-black/60 text-gray-300 hover:text-white hover:bg-black/80'
          }`}
          title={inList ? 'Remove from Watchlist' : 'Add to Watchlist'}
          aria-label="Toggle Watchlist"
        >
          {inList ? <Check size={16} /> : <Bookmark size={16} />}
        </button>
      </Link>

      {/* Card Details Footer */}
      <div className="p-3 bg-[#131318] flex-1 flex flex-col justify-between">
        <div>
          <Link
            to={`/movies/${movie.id}`}
            className="font-semibold text-sm text-gray-100 hover:text-[#E50914] transition truncate block"
            title={movie.title}
          >
            {movie.title}
          </Link>
          <div className="flex items-center justify-between text-xs text-gray-400 mt-1">
            <span>{movie.releaseDate ? movie.releaseDate.substring(0, 4) : '2024'}</span>
            <span className="truncate max-w-[120px] text-gray-500">{movie.genre?.split(',')[0]}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
