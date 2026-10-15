import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Play,
  Bookmark,
  Check,
  Star,
  Clock,
  Calendar,
  Share2,
  ExternalLink,
  ShieldCheck,
  ArrowLeft,
  User,
  Users
} from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import MovieCarousel from '../components/MovieCarousel';
import api from '../services/api';
import { useWatchlist } from '../context/WatchlistContext';
import { useAuth } from '../context/AuthContext';

export default function MovieDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [similarMovies, setSimilarMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  const { isInWatchlist, addToWatchlist, removeFromWatchlist } = useWatchlist();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchMovieData = async () => {
      setLoading(true);
      window.scrollTo(0, 0);
      try {
        const data = await api.movies.getById(id);
        setMovie(data);

        // Fetch similar movies by primary genre
        if (data.genre) {
          const primaryGenre = data.genre.split(',')[0].trim();
          const genreList = await api.movies.getByGenre(primaryGenre);
          setSimilarMovies(genreList.filter((m) => m.id !== data.id));
        }
      } catch (err) {
        console.warn('Error fetching movie details:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMovieData();
  }, [id]);

  if (loading) {
    return <LoadingSpinner text="Loading trailer details..." />;
  }

  if (!movie) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#0B0B0E] px-4 text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Movie Not Found</h2>
        <p className="text-gray-400 text-sm mb-6">The trailer you are looking for does not exist or has been removed.</p>
        <Link to="/browse" className="px-6 py-2.5 rounded-xl bg-[#E50914] text-white font-semibold">
          Return to Browse
        </Link>
      </div>
    );
  }

  const inList = isInWatchlist(movie.id);

  const toggleWatchlist = async () => {
    if (!isAuthenticated) {
      alert('Please sign in to add movies to your watchlist.');
      return;
    }
    if (inList) {
      await removeFromWatchlist(movie.id);
    } else {
      await addToWatchlist(movie);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const videoId = movie.youtubeVideoId || 'Way9Dexny3w';
  const embedUrl = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&enablejsapi=1&rel=0`;
  const youtubeUrl = `https://www.youtube.com/watch?v=${videoId}`;

  return (
    <div className="min-h-screen bg-[#0B0B0E] pt-20 pb-20 text-gray-200">
      {/* Backdrop Header with Vignette */}
      <div className="relative w-full h-[380px] sm:h-[460px] md:h-[520px] overflow-hidden">
        <img
          src={movie.backdropUrl || movie.posterUrl}
          alt={movie.title}
          className="w-full h-full object-cover object-center filter brightness-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0E] via-[#0B0B0E]/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B0B0E] via-transparent to-transparent" />

        {/* Back Button */}
        <div className="absolute top-6 left-4 sm:left-8 z-20">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-black/60 hover:bg-black/80 backdrop-blur-md text-white text-sm font-semibold border border-white/10 transition"
          >
            <ArrowLeft size={16} /> Back
          </button>
        </div>
      </div>

      {/* Main Details Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 -mt-44 sm:-mt-56 relative z-30">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Poster Card */}
          <div className="w-56 sm:w-64 md:w-72 shrink-0 rounded-2xl overflow-hidden shadow-2xl border-2 border-white/10 bg-[#16161D] mx-auto lg:mx-0">
            <img
              src={movie.posterUrl}
              alt={movie.title}
              className="w-full aspect-[2/3] object-cover"
            />
          </div>

          {/* Details Content */}
          <div className="flex-1 space-y-5">
            {/* Title & Metadata Badges */}
            <div>
              <div className="flex flex-wrap items-center gap-2.5 mb-2">
                {movie.genre?.split(',').map((g) => (
                  <span
                    key={g}
                    className="px-3 py-1 rounded-full text-xs font-semibold bg-white/10 border border-white/10 text-gray-200"
                  >
                    {g.trim()}
                  </span>
                ))}
              </div>
              <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
                {movie.title}
              </h1>
            </div>

            {/* Quick Metrics */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-300">
              {movie.rating && (
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-400 font-bold">
                  <Star size={16} fill="currentColor" /> {movie.rating} / 10
                </div>
              )}
              {movie.releaseDate && (
                <div className="flex items-center gap-1 text-gray-300">
                  <Calendar size={15} /> {movie.releaseDate}
                </div>
              )}
              {movie.runtime && (
                <div className="flex items-center gap-1 text-gray-300">
                  <Clock size={15} /> {Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m
                </div>
              )}
              {movie.contentRating && (
                <span className="px-2 py-0.5 rounded border border-white/20 bg-black/40 text-xs font-bold text-gray-200">
                  {movie.contentRating}
                </span>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href="#trailer-embed"
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#E50914] hover:bg-[#F40612] text-white font-bold text-sm shadow-xl transition red-glow-hover"
              >
                <Play size={18} fill="currentColor" /> Watch Trailer
              </a>

              <button
                onClick={toggleWatchlist}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm transition border ${
                  inList
                    ? 'bg-emerald-600/30 text-emerald-300 border-emerald-500/40'
                    : 'bg-white/10 text-white border-white/10 hover:bg-white/20'
                }`}
              >
                {inList ? <Check size={18} /> : <Bookmark size={18} />}
                {inList ? 'In Watchlist' : 'Add to Watchlist'}
              </button>

              <button
                onClick={handleShare}
                className="flex items-center gap-2 px-4 py-3 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 text-gray-300 hover:text-white text-sm font-semibold transition"
              >
                <Share2 size={16} />
                {copied ? 'Link Copied!' : 'Share'}
              </button>

              <a
                href={youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-4 py-3 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 text-gray-400 hover:text-white text-sm transition"
              >
                <ExternalLink size={16} /> YouTube
              </a>
            </div>

            {/* Synopsis */}
            <div className="pt-2">
              <h3 className="text-base font-bold text-white mb-2 uppercase tracking-wider text-xs text-gray-400">
                Synopsis
              </h3>
              <p className="text-gray-300 text-base leading-relaxed max-w-3xl">
                {movie.description}
              </p>
            </div>

            {/* Cast & Crew Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-white/5">
              {movie.director && (
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-white/5 text-[#E50914]">
                    <User size={18} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 uppercase font-semibold">Director</p>
                    <p className="text-sm font-medium text-white">{movie.director}</p>
                  </div>
                </div>
              )}
              {movie.cast && (
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-white/5 text-amber-400">
                    <Users size={18} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 uppercase font-semibold">Starring Cast</p>
                    <p className="text-sm font-medium text-white">{movie.cast}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Official YouTube Trailer Embed Section */}
        <div id="trailer-embed" className="mt-16 pt-8 border-t border-white/5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <span className="w-1.5 h-6 bg-[#E50914] rounded-full" />
              <h2 className="text-2xl font-bold text-white">Official High-Definition Trailer</h2>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-emerald-400">
              <ShieldCheck size={16} />
              <span>Authorized Embed</span>
            </div>
          </div>

          {/* 16:9 Responsive Trailer Video Container */}
          <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black shadow-2xl border border-white/10">
            <iframe
              src={embedUrl}
              title={`${movie.title} Trailer`}
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>

          <p className="text-xs text-gray-400 mt-3 text-center">
            Promotional video streamed directly from official authorized distributor channels via the YouTube IFrame Player API.
          </p>
        </div>

        {/* Similar Movies Recommendations Row */}
        {similarMovies.length > 0 && (
          <div className="mt-16">
            <MovieCarousel
              title={`Similar in ${movie.genre?.split(',')[0]}`}
              movies={similarMovies}
            />
          </div>
        )}
      </div>
    </div>
  );
}
