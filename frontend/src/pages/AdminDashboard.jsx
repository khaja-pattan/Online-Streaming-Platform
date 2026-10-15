import React, { useState, useEffect } from 'react';
import {
  Shield,
  Plus,
  Edit2,
  Trash2,
  Play,
  Film,
  Search,
  CheckCircle2,
  AlertTriangle,
  X,
  ExternalLink,
  Star
} from 'lucide-react';
import api from '../services/api';
import ConfirmationModal from '../components/ConfirmationModal';
import LoadingSpinner from '../components/LoadingSpinner';

export default function AdminDashboard() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Modal states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingMovie, setEditingMovie] = useState(null);
  const [movieToDelete, setMovieToDelete] = useState(null);
  const [previewTrailerId, setPreviewTrailerId] = useState(null);

  // Form fields
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    releaseDate: '',
    genre: '',
    posterUrl: '',
    backdropUrl: '',
    officialTrailerUrl: '',
    director: '',
    cast: '',
    runtime: 120,
    contentRating: 'PG-13',
    rating: 8.0,
    featured: false,
  });

  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [saving, setSaving] = useState(false);

  const fetchMovies = async () => {
    setLoading(true);
    try {
      const res = await api.movies.getAll(0, 100);
      setMovies(res.content || []);
    } catch (err) {
      console.warn('Error fetching admin movies:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  const openCreateModal = () => {
    setEditingMovie(null);
    setFormData({
      title: '',
      description: '',
      releaseDate: new Date().toISOString().substring(0, 10),
      genre: 'Action, Sci-Fi',
      posterUrl: '',
      backdropUrl: '',
      officialTrailerUrl: '',
      director: '',
      cast: '',
      runtime: 130,
      contentRating: 'PG-13',
      rating: 8.5,
      featured: false,
    });
    setFormError('');
    setFormSuccess('');
    setIsFormOpen(true);
  };

  const openEditModal = (movie) => {
    setEditingMovie(movie);
    setFormData({
      title: movie.title || '',
      description: movie.description || '',
      releaseDate: movie.releaseDate || '',
      genre: movie.genre || '',
      posterUrl: movie.posterUrl || '',
      backdropUrl: movie.backdropUrl || '',
      officialTrailerUrl: movie.officialTrailerUrl || movie.youtubeVideoId || '',
      director: movie.director || '',
      cast: movie.cast || '',
      runtime: movie.runtime || 120,
      contentRating: movie.contentRating || 'PG-13',
      rating: movie.rating || 8.0,
      featured: movie.featured || false,
    });
    setFormError('');
    setFormSuccess('');
    setIsFormOpen(true);
  };

  // Helper to extract YouTube video ID for instant validation & preview
  const extractYouTubeId = (url) => {
    if (!url) return null;
    const trimmed = url.trim();
    if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) return trimmed;
    const match = trimmed.match(
      /(?:https?:\/\/)?(?:www\.|m\.)?(?:youtube\.com\/(?:watch\?v=|embed\/|v\/)|youtu\.be\/|youtube-nocookie\.com\/embed\/)([a-zA-Z0-9_-]{11})/
    );
    return match ? match[1] : null;
  };

  const currentExtractedId = extractYouTubeId(formData.officialTrailerUrl);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');

    // Strict Copyright-Safe source validation
    const videoId = extractYouTubeId(formData.officialTrailerUrl);
    if (!videoId) {
      setFormError(
        'Invalid trailer link. StreamFlix requires official authorized YouTube trailer URLs (e.g., https://www.youtube.com/watch?v=VIDEO_ID or https://youtu.be/VIDEO_ID). Hosting full movies or external hosts is prohibited.'
      );
      return;
    }

    setSaving(true);
    try {
      const payload = {
        ...formData,
        runtime: Number(formData.runtime),
        rating: Number(formData.rating),
        youtubeVideoId: videoId,
      };

      if (editingMovie) {
        await api.movies.update(editingMovie.id, payload);
        setFormSuccess('Movie trailer updated successfully!');
      } else {
        await api.movies.create(payload);
        setFormSuccess('New movie trailer created successfully!');
      }

      await fetchMovies();
      setTimeout(() => {
        setIsFormOpen(false);
      }, 1000);
    } catch (err) {
      setFormError(err.response?.data?.message || err.message || 'Error saving movie metadata.');
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!movieToDelete) return;
    try {
      await api.movies.delete(movieToDelete.id);
      setMovieToDelete(null);
      await fetchMovies();
    } catch (err) {
      alert('Error deleting movie: ' + (err.response?.data?.message || err.message));
    }
  };

  const filteredMovies = movies.filter((m) =>
    m.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (m.genre && m.genre.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-[#0B0B0E] pt-24 pb-20 px-4 sm:px-8 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-white/5 mb-8 gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#E50914] mb-1">
            <Shield size={14} /> Administrator Control Center
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Movie Trailer Catalog Management
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Publish, edit, and curate copyright-safe official YouTube movie trailers.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 px-5 py-3 rounded-xl bg-[#E50914] hover:bg-[#F40612] text-white font-bold text-sm shadow-xl transition red-glow-hover w-fit"
        >
          <Plus size={18} /> Add New Movie Trailer
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-[#14141A] border border-white/5 rounded-2xl p-5 shadow-xl">
          <p className="text-xs font-semibold text-gray-400 uppercase">Total Catalog Trailers</p>
          <p className="text-3xl font-black text-white mt-1">{movies.length}</p>
        </div>
        <div className="bg-[#14141A] border border-white/5 rounded-2xl p-5 shadow-xl">
          <p className="text-xs font-semibold text-gray-400 uppercase">Featured Releases</p>
          <p className="text-3xl font-black text-amber-400 mt-1">
            {movies.filter((m) => m.featured).length}
          </p>
        </div>
        <div className="bg-[#14141A] border border-white/5 rounded-2xl p-5 shadow-xl">
          <p className="text-xs font-semibold text-gray-400 uppercase">Embedding Standard</p>
          <p className="text-sm font-bold text-emerald-400 mt-2 flex items-center gap-1.5">
            <CheckCircle2 size={16} /> Official YouTube IFrame Only
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-[#14141A] border border-white/5 rounded-2xl p-4 mb-6 shadow-xl">
        <div className="relative">
          <input
            type="text"
            placeholder="Search catalog by title or genre..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2.5 pl-10 rounded-xl bg-black/40 border border-white/10 text-white text-sm focus:outline-none focus:border-[#E50914]"
          />
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>
      </div>

      {/* Movies Table */}
      {loading ? (
        <LoadingSpinner text="Fetching movie catalog records..." />
      ) : (
        <div className="bg-[#14141A] border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-300">
              <thead className="bg-[#181822] text-xs uppercase text-gray-400 border-b border-white/5">
                <tr>
                  <th className="px-5 py-4">Trailer</th>
                  <th className="px-5 py-4">Title & Director</th>
                  <th className="px-5 py-4">Genre</th>
                  <th className="px-5 py-4">Release Year</th>
                  <th className="px-5 py-4">Rating</th>
                  <th className="px-5 py-4">YouTube ID</th>
                  <th className="px-5 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredMovies.map((movie) => (
                  <tr key={movie.id} className="hover:bg-white/5 transition">
                    <td className="px-5 py-3">
                      <div className="w-12 h-16 rounded-lg overflow-hidden bg-black shrink-0 relative group">
                        <img
                          src={movie.posterUrl || 'https://via.placeholder.com/100x150'}
                          alt={movie.title}
                          className="w-full h-full object-cover"
                        />
                        <button
                          onClick={() => setPreviewTrailerId(movie.youtubeVideoId)}
                          className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition text-[#E50914]"
                          title="Preview Trailer"
                        >
                          <Play size={16} fill="currentColor" />
                        </button>
                      </div>
                    </td>
                    <td className="px-5 py-3 font-semibold text-white">
                      <div className="truncate max-w-xs">{movie.title}</div>
                      <div className="text-xs text-gray-400 font-normal">{movie.director || 'N/A'}</div>
                    </td>
                    <td className="px-5 py-3">
                      <span className="text-xs text-gray-300">{movie.genre}</span>
                    </td>
                    <td className="px-5 py-3 text-xs text-gray-300">
                      {movie.releaseDate ? movie.releaseDate.substring(0, 4) : '2024'}
                    </td>
                    <td className="px-5 py-3">
                      <span className="flex items-center gap-1 text-xs font-bold text-amber-400">
                        <Star size={13} fill="currentColor" /> {movie.rating}
                      </span>
                    </td>
                    <td className="px-5 py-3 font-mono text-xs text-gray-400">
                      <a
                        href={`https://www.youtube.com/watch?v=${movie.youtubeVideoId}`}
                        target="_blank"
                        rel="noreferrer"
                        className="hover:text-red-400 flex items-center gap-1"
                      >
                        {movie.youtubeVideoId} <ExternalLink size={12} />
                      </a>
                    </td>
                    <td className="px-5 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setPreviewTrailerId(movie.youtubeVideoId)}
                          className="p-2 rounded-lg bg-white/5 hover:bg-white/15 text-gray-300 hover:text-white transition"
                          title="Live Preview"
                        >
                          <Play size={16} />
                        </button>
                        <button
                          onClick={() => openEditModal(movie)}
                          className="p-2 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 transition"
                          title="Edit Details"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => setMovieToDelete(movie)}
                          className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition"
                          title="Delete Movie"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add / Edit Movie Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-3xl bg-[#16161D] border border-white/10 rounded-2xl shadow-2xl p-6 sm:p-8 my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
              <h3 className="text-xl font-bold text-white">
                {editingMovie ? `Edit Movie: ${editingMovie.title}` : 'Add New Movie Trailer'}
              </h3>
              <button
                onClick={() => setIsFormOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                <X size={22} />
              </button>
            </div>

            {formSuccess && (
              <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm flex items-center gap-2">
                <CheckCircle2 size={18} /> {formSuccess}
              </div>
            )}

            {formError && (
              <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm flex items-center gap-2">
                <AlertTriangle size={18} /> {formError}
              </div>
            )}

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase mb-1">
                    Movie Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-sm focus:border-[#E50914]"
                    placeholder="e.g. Dune: Part Two"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase mb-1">
                    Genre(s) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.genre}
                    onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-sm focus:border-[#E50914]"
                    placeholder="e.g. Sci-Fi, Action, Adventure"
                  />
                </div>
              </div>

              {/* Official Trailer Source */}
              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase mb-1">
                  Official YouTube Trailer URL or Video ID * (Copyright-Safe)
                </label>
                <input
                  type="text"
                  required
                  value={formData.officialTrailerUrl}
                  onChange={(e) => setFormData({ ...formData, officialTrailerUrl: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-sm focus:border-[#E50914]"
                  placeholder="https://www.youtube.com/watch?v=Way9Dexny3w or Way9Dexny3w"
                />
                <div className="flex items-center justify-between text-xs mt-1.5">
                  <span className="text-gray-400">
                    Extracted Video ID:{' '}
                    {currentExtractedId ? (
                      <span className="text-emerald-400 font-mono font-bold">
                        {currentExtractedId} (Valid)
                      </span>
                    ) : (
                      <span className="text-amber-400 font-mono">None / Pending URL</span>
                    )}
                  </span>
                  {currentExtractedId && (
                    <button
                      type="button"
                      onClick={() => setPreviewTrailerId(currentExtractedId)}
                      className="text-[#E50914] hover:underline font-semibold"
                    >
                      Preview Trailer Video
                    </button>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase mb-1">
                  Synopsis / Description
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-sm focus:border-[#E50914]"
                  placeholder="Official movie trailer overview and story teaser..."
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase mb-1">
                    Poster Image URL
                  </label>
                  <input
                    type="url"
                    value={formData.posterUrl}
                    onChange={(e) => setFormData({ ...formData, posterUrl: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-sm focus:border-[#E50914]"
                    placeholder="https://image.tmdb.org/t/p/w500/..."
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase mb-1">
                    Backdrop Image URL
                  </label>
                  <input
                    type="url"
                    value={formData.backdropUrl}
                    onChange={(e) => setFormData({ ...formData, backdropUrl: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-sm focus:border-[#E50914]"
                    placeholder="https://image.tmdb.org/t/p/original/..."
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase mb-1">
                    Release Date
                  </label>
                  <input
                    type="date"
                    value={formData.releaseDate}
                    onChange={(e) => setFormData({ ...formData, releaseDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-sm focus:border-[#E50914]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase mb-1">
                    Runtime (min)
                  </label>
                  <input
                    type="number"
                    value={formData.runtime}
                    onChange={(e) => setFormData({ ...formData, runtime: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-sm focus:border-[#E50914]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase mb-1">
                    Rating (1-10)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    max="10"
                    value={formData.rating}
                    onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-sm focus:border-[#E50914]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase mb-1">
                    Content Rating
                  </label>
                  <select
                    value={formData.contentRating}
                    onChange={(e) => setFormData({ ...formData, contentRating: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-sm focus:border-[#E50914]"
                  >
                    <option value="G">G</option>
                    <option value="PG">PG</option>
                    <option value="PG-13">PG-13</option>
                    <option value="R">R</option>
                    <option value="NC-17">NC-17</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase mb-1">
                    Director
                  </label>
                  <input
                    type="text"
                    value={formData.director}
                    onChange={(e) => setFormData({ ...formData, director: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-sm focus:border-[#E50914]"
                    placeholder="e.g. Christopher Nolan"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase mb-1">
                    Starring Cast
                  </label>
                  <input
                    type="text"
                    value={formData.cast}
                    onChange={(e) => setFormData({ ...formData, cast: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-sm focus:border-[#E50914]"
                    placeholder="e.g. Cillian Murphy, Emily Blunt"
                  />
                </div>
              </div>

              {/* Featured Checkbox */}
              <div className="pt-2 flex items-center gap-2">
                <input
                  type="checkbox"
                  id="featuredCheck"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="w-4 h-4 rounded text-[#E50914] focus:ring-[#E50914]"
                />
                <label htmlFor="featuredCheck" className="text-sm font-semibold text-white cursor-pointer">
                  Highlight in Hero Banner (Featured Release)
                </label>
              </div>

              <div className="pt-6 border-t border-white/10 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-white/10 text-gray-300 hover:bg-white/20 text-sm font-semibold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 rounded-xl bg-[#E50914] hover:bg-[#F40612] text-white text-sm font-bold shadow-xl transition disabled:opacity-50"
                >
                  {saving ? 'Saving...' : editingMovie ? 'Update Movie' : 'Publish Movie Trailer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Live YouTube Preview Modal */}
      {previewTrailerId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <div className="relative w-full max-w-4xl bg-black border border-white/20 rounded-2xl overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between p-3.5 bg-[#14141A]">
              <span className="text-sm font-bold text-white flex items-center gap-2">
                <Play size={16} className="text-[#E50914]" /> Live Trailer Preview (YouTube ID: {previewTrailerId})
              </span>
              <button
                onClick={() => setPreviewTrailerId(null)}
                className="text-gray-400 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>
            <div className="relative aspect-video w-full">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${previewTrailerId}?autoplay=1`}
                title="Preview Trailer"
                className="w-full h-full border-0"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal for Delete */}
      <ConfirmationModal
        isOpen={!!movieToDelete}
        title="Delete Movie Trailer"
        message={`Are you sure you want to delete "${movieToDelete?.title}" from the catalog? This action will remove the metadata and cannot be undone.`}
        confirmText="Delete Trailer"
        onConfirm={confirmDelete}
        onCancel={() => setMovieToDelete(null)}
      />
    </div>
  );
}
