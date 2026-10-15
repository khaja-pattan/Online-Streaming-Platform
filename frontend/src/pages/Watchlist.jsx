import React from 'react';
import { Bookmark, Film, Trash2, Play } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useWatchlist } from '../context/WatchlistContext';
import { useTrailerModal } from '../context/TrailerModalContext';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';

export default function Watchlist() {
  const { watchlist, loading, removeFromWatchlist } = useWatchlist();
  const { openTrailer } = useTrailerModal();
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0B0B0E] pt-28 pb-20 px-4 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-[#E50914] mb-4">
          <Bookmark size={32} />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Sign In to View Your Watchlist</h2>
        <p className="text-gray-400 text-sm max-w-md mb-6">
          Create an account or sign in to save your favorite movie trailers and access your personal watchlist anytime.
        </p>
        <Link
          to="/login"
          className="px-6 py-2.5 rounded-xl bg-[#E50914] text-white font-semibold hover:bg-[#F40612] transition"
        >
          Sign In
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0B0E] pt-24 pb-20 px-4 sm:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-white/5 mb-8 gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#E50914] mb-1">
            <Bookmark size={14} /> Personal Collection
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            My Watchlist
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Trailers saved by <strong className="text-white">{user?.username}</strong>
          </p>
        </div>

        <div className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-semibold text-gray-300 w-fit">
          Total Saved: <span className="text-[#E50914] font-bold text-sm ml-1">{watchlist.length}</span>
        </div>
      </div>

      {loading ? (
        <LoadingSpinner text="Retrieving your personal watchlist..." />
      ) : watchlist.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
          {watchlist.map((item) => {
            const movie = item.movie || item;
            return (
              <div
                key={item.id || item.movieId}
                className="group relative rounded-xl overflow-hidden bg-[#16161C] border border-white/5 transition-all duration-300 hover:scale-[1.03] hover:shadow-2xl hover:border-[#E50914]/50 flex flex-col"
              >
                {/* Poster */}
                <div className="relative aspect-[2/3] w-full overflow-hidden bg-[#0c0c10]">
                  <img
                    src={movie.posterUrl || 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=500&auto=format&fit=crop&q=60'}
                    alt={movie.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-60 group-hover:opacity-90 transition-opacity" />

                  {/* Play Trailer Overlay Button */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => openTrailer(movie)}
                      className="w-12 h-12 rounded-full bg-[#E50914] text-white flex items-center justify-center shadow-lg hover:scale-110 transition"
                      title="Play Trailer"
                    >
                      <Play size={22} fill="currentColor" className="ml-0.5" />
                    </button>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeFromWatchlist(movie.id)}
                    className="absolute top-2.5 right-2.5 p-2 rounded-full bg-black/70 hover:bg-red-600/90 text-gray-300 hover:text-white transition"
                    title="Remove from Watchlist"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>

                {/* Footer Info */}
                <div className="p-3 bg-[#131318] flex-1 flex flex-col justify-between">
                  <div>
                    <Link
                      to={`/movies/${movie.id}`}
                      className="font-semibold text-sm text-gray-100 hover:text-[#E50914] transition truncate block"
                    >
                      {movie.title}
                    </Link>
                    <p className="text-xs text-gray-400 mt-1">
                      {movie.releaseDate ? movie.releaseDate.substring(0, 4) : '2024'} • {movie.genre?.split(',')[0]}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center bg-[#131318] border border-white/5 rounded-2xl">
          <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-gray-400 mb-4">
            <Film size={32} />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Your Watchlist is Empty</h3>
          <p className="text-gray-400 text-sm max-w-md mb-6">
            You haven't saved any movie trailers yet. Browse through our catalog and click the bookmark icon on any trailer to save it here.
          </p>
          <Link
            to="/browse"
            className="px-6 py-2.5 rounded-xl bg-[#E50914] text-white font-semibold text-sm hover:bg-[#F40612] transition"
          >
            Explore Trailers
          </Link>
        </div>
      )}
    </div>
  );
}
