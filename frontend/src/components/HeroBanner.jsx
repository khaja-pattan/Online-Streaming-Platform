import React from 'react';
import { Play, Bookmark, Check, Info, Star, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTrailerModal } from '../context/TrailerModalContext';
import { useWatchlist } from '../context/WatchlistContext';
import { useAuth } from '../context/AuthContext';

export default function HeroBanner({ movie }) {
  const { openTrailer } = useTrailerModal();
  const { isInWatchlist, addToWatchlist, removeFromWatchlist } = useWatchlist();
  const { isAuthenticated } = useAuth();

  if (!movie) return null;

  const inList = isInWatchlist(movie.id);

  const handleWatchlistClick = async () => {
    if (!isAuthenticated) {
      alert('Please sign in to save trailers to your personal watchlist.');
      return;
    }
    if (inList) {
      await removeFromWatchlist(movie.id);
    } else {
      await addToWatchlist(movie);
    }
  };

  return (
    <div className="relative w-full min-h-[75vh] md:min-h-[85vh] flex items-center bg-[#0B0B0E] overflow-hidden">
      {/* High-Resolution Backdrop Image */}
      <div className="absolute inset-0">
        <img
          src={movie.backdropUrl || movie.posterUrl}
          alt={movie.title}
          className="w-full h-full object-cover object-center filter brightness-90 transform scale-105 transition-transform duration-10000"
        />
        {/* Cinematic Vignette & Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0E] via-[#0B0B0E]/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B0B0E] via-[#0B0B0E]/80 to-transparent w-full md:w-3/4" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 py-20 md:py-28 flex flex-col justify-center">
        {/* Featured Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E50914]/20 border border-[#E50914]/40 text-[#E50914] text-xs font-bold tracking-wider uppercase mb-4 w-fit">
          <span className="w-2 h-2 rounded-full bg-[#E50914] animate-ping" />
          Featured Official Trailer
        </div>

        {/* Title */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-white max-w-3xl leading-none drop-shadow-md mb-4">
          {movie.title}
        </h1>

        {/* Metadata Row */}
        <div className="flex flex-wrap items-center gap-3 text-sm text-gray-300 mb-6">
          {movie.rating && (
            <span className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-amber-500/20 text-amber-400 font-bold border border-amber-500/30">
              <Star size={14} fill="currentColor" /> {movie.rating} / 10
            </span>
          )}
          {movie.releaseDate && (
            <span className="font-semibold text-gray-200">
              {movie.releaseDate.substring(0, 4)}
            </span>
          )}
          {movie.contentRating && (
            <span className="px-2 py-0.5 rounded border border-white/20 bg-black/40 text-xs font-semibold">
              {movie.contentRating}
            </span>
          )}
          {movie.runtime && (
            <span className="flex items-center gap-1 text-gray-400">
              <Clock size={14} /> {movie.runtime} min
            </span>
          )}
          {movie.genre && (
            <span className="text-gray-400 border-l border-white/20 pl-3 hidden sm:inline">
              {movie.genre}
            </span>
          )}
        </div>

        {/* Synopsis */}
        <p className="text-gray-300 text-sm sm:text-base md:text-lg max-w-2xl line-clamp-3 md:line-clamp-4 leading-relaxed mb-8 drop-shadow">
          {movie.description}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3.5">
          <button
            onClick={() => openTrailer(movie)}
            className="flex items-center gap-2.5 px-6 sm:px-8 py-3.5 rounded-xl bg-[#E50914] hover:bg-[#F40612] text-white font-bold text-base shadow-xl transition-all duration-300 hover:scale-105 red-glow-hover"
          >
            <Play size={20} fill="currentColor" />
            Watch Trailer
          </button>

          <button
            onClick={handleWatchlistClick}
            className={`flex items-center gap-2 px-5 py-3.5 rounded-xl font-semibold text-sm sm:text-base transition-all duration-200 border ${
              inList
                ? 'bg-emerald-600/30 border-emerald-500/40 text-emerald-300 hover:bg-emerald-600/40'
                : 'bg-white/10 border-white/15 text-white hover:bg-white/20 backdrop-blur-md'
            }`}
          >
            {inList ? <Check size={18} /> : <Bookmark size={18} />}
            {inList ? 'In Watchlist' : 'Add to Watchlist'}
          </button>

          <Link
            to={`/movies/${movie.id}`}
            className="flex items-center gap-2 px-5 py-3.5 rounded-xl bg-black/40 hover:bg-black/60 border border-white/10 text-gray-300 hover:text-white font-semibold text-sm sm:text-base backdrop-blur-md transition"
          >
            <Info size={18} />
            More Details
          </Link>
        </div>
      </div>
    </div>
  );
}
