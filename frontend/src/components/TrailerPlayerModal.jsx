import React, { useEffect } from 'react';
import { X, ExternalLink, Bookmark, Check, Star, Clock } from 'lucide-react';
import { useTrailerModal } from '../context/TrailerModalContext';
import { useWatchlist } from '../context/WatchlistContext';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

export default function TrailerPlayerModal() {
  const { isOpen, movie, closeTrailer } = useTrailerModal();
  const { isInWatchlist, addToWatchlist, removeFromWatchlist } = useWatchlist();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') closeTrailer();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, closeTrailer]);

  if (!isOpen || !movie) return null;

  const inList = isInWatchlist(movie.id);

  const toggleWatchlist = async () => {
    if (!isAuthenticated) {
      alert('Please log in to save trailers to your watchlist.');
      return;
    }
    if (inList) {
      await removeFromWatchlist(movie.id);
    } else {
      await addToWatchlist(movie);
    }
  };

  const videoId = movie.youtubeVideoId || 'Way9Dexny3w';
  const embedUrl = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&enablejsapi=1`;
  const youtubeWatchUrl = `https://www.youtube.com/watch?v=${videoId}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fadeIn">
      {/* Background dismissal */}
      <div className="absolute inset-0" onClick={closeTrailer} />

      <div className="relative z-10 w-full max-w-4xl bg-[#121217] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header bar */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-[#181820] border-b border-white/5">
          <div className="flex items-center gap-3 truncate">
            <span className="w-2.5 h-2.5 rounded-full bg-[#E50914] animate-pulse" />
            <h3 className="font-semibold text-lg text-white truncate">{movie.title} — Official Trailer</h3>
          </div>
          <button
            onClick={closeTrailer}
            className="p-1.5 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition"
            aria-label="Close modal"
          >
            <X size={22} />
          </button>
        </div>

        {/* 16:9 YouTube Video Embed Container */}
        <div className="relative w-full aspect-video bg-black">
          <iframe
            src={embedUrl}
            title={`${movie.title} Official Trailer`}
            className="w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>

        {/* Modal Info Footer */}
        <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#14141A]">
          <div className="space-y-1">
            <div className="flex items-center gap-3 text-xs text-gray-400">
              {movie.releaseDate && <span>{movie.releaseDate.substring(0, 4)}</span>}
              {movie.contentRating && (
                <span className="px-1.5 py-0.5 rounded border border-gray-700 bg-gray-800 text-gray-300">
                  {movie.contentRating}
                </span>
              )}
              {movie.runtime && (
                <span className="flex items-center gap-1">
                  <Clock size={12} /> {movie.runtime}m
                </span>
              )}
              {movie.rating && (
                <span className="flex items-center gap-1 text-amber-400 font-medium">
                  <Star size={13} fill="currentColor" /> {movie.rating}
                </span>
              )}
            </div>
            <p className="text-sm text-gray-300 line-clamp-2 max-w-xl">
              {movie.description || 'Watch the official promotional trailer in high definition.'}
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={toggleWatchlist}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition ${
                inList
                  ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-600/30'
                  : 'bg-white/10 text-white hover:bg-white/20 border border-white/10'
              }`}
            >
              {inList ? <Check size={16} /> : <Bookmark size={16} />}
              {inList ? 'In Watchlist' : 'Add to Watchlist'}
            </button>

            <Link
              to={`/movies/${movie.id}`}
              onClick={closeTrailer}
              className="px-4 py-2 rounded-lg text-sm font-medium bg-[#E50914] text-white hover:bg-[#F40612] transition shadow-md"
            >
              Details
            </Link>

            <a
              href={youtubeWatchUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition"
              title="Watch on official YouTube page"
            >
              <ExternalLink size={18} />
            </a>
          </div>
        </div>

        {/* Disclaimer bar */}
        <div className="px-5 py-2 bg-[#0c0c0f] border-t border-white/5 text-[11px] text-gray-500 flex items-center justify-between">
          <span>Official trailer embedded via authorized YouTube IFrame API</span>
          <span>© StreamFlix Movie Discovery</span>
        </div>
      </div>
    </div>
  );
}
