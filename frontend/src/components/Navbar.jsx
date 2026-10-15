import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Film, Search, Bookmark, User, LogOut, Shield, Menu, X, Play } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useWatchlist } from '../context/WatchlistContext';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { watchlistIds } = useWatchlist();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
  }, [location.pathname]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/browse?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const watchlistCount = watchlistIds ? watchlistIds.size : 0;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled ? 'glass-nav shadow-lg py-3' : 'bg-gradient-to-b from-black/80 to-transparent py-4 sm:py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-8 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-lg bg-[#E50914] flex items-center justify-center text-white shadow-md group-hover:scale-105 transition">
            <Film size={20} />
          </div>
          <span className="text-xl sm:text-2xl font-black tracking-tight text-white">
            Stream<span className="text-[#E50914]">Flix</span>
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link
            to="/"
            className={`transition ${location.pathname === '/' ? 'text-white font-semibold' : 'text-gray-300 hover:text-white'}`}
          >
            Home
          </Link>
          <Link
            to="/browse"
            className={`transition ${location.pathname === '/browse' ? 'text-white font-semibold' : 'text-gray-300 hover:text-white'}`}
          >
            Browse Trailers
          </Link>
          <Link
            to="/watchlist"
            className={`flex items-center gap-1.5 transition ${location.pathname === '/watchlist' ? 'text-white font-semibold' : 'text-gray-300 hover:text-white'}`}
          >
            <Bookmark size={16} />
            <span>Watchlist</span>
            {watchlistCount > 0 && (
              <span className="ml-1 px-1.5 py-0.2 rounded-full bg-[#E50914] text-white text-[11px] font-bold">
                {watchlistCount}
              </span>
            )}
          </Link>
          {isAdmin && (
            <Link
              to="/admin"
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition ${
                location.pathname === '/admin'
                  ? 'bg-[#E50914] text-white'
                  : 'bg-white/10 text-gray-200 hover:bg-white/20'
              }`}
            >
              <Shield size={14} />
              <span>Admin</span>
            </Link>
          )}
        </div>

        {/* Search Bar & User Actions */}
        <div className="hidden sm:flex items-center gap-4">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              placeholder="Search movies, actors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-48 lg:w-64 px-3.5 py-1.5 pl-9 rounded-full bg-black/40 border border-white/15 text-sm text-gray-200 placeholder-gray-400 focus:outline-none focus:border-[#E50914] focus:w-72 transition-all duration-300"
            />
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </form>

          {/* User Profile / Login */}
          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 p-1.5 rounded-full hover:bg-white/10 transition border border-white/10"
                aria-label="User menu"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#E50914] to-amber-500 flex items-center justify-center text-white text-xs font-bold uppercase">
                  {user?.username ? user.username.charAt(0) : 'U'}
                </div>
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-[#16161D] border border-white/10 rounded-xl shadow-2xl py-2 z-50 animate-fadeIn">
                  <div className="px-4 py-2 border-b border-white/10">
                    <p className="text-sm font-semibold text-white truncate">{user?.username}</p>
                    <p className="text-xs text-gray-400 truncate">{user?.email}</p>
                    {isAdmin && (
                      <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold bg-[#E50914]/20 text-[#E50914] border border-[#E50914]/30">
                        ADMINISTRATOR
                      </span>
                    )}
                  </div>

                  <Link
                    to="/profile"
                    className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition"
                  >
                    <User size={16} /> Profile
                  </Link>
                  <Link
                    to="/watchlist"
                    className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition"
                  >
                    <Bookmark size={16} /> My Watchlist ({watchlistCount})
                  </Link>
                  {isAdmin && (
                    <Link
                      to="/admin"
                      className="flex items-center gap-2.5 px-4 py-2 text-sm text-[#E50914] hover:bg-white/5 transition font-medium"
                    >
                      <Shield size={16} /> Admin Dashboard
                    </Link>
                  )}

                  <div className="border-t border-white/10 my-1" />

                  <button
                    onClick={logout}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-white/5 transition text-left"
                  >
                    <LogOut size={16} /> Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="px-4 py-1.5 rounded-lg text-sm font-medium bg-[#E50914] hover:bg-[#F40612] text-white shadow-md transition"
              >
                Sign In
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg bg-white/10 text-white"
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#111116] border-b border-white/10 px-6 py-4 space-y-3 animate-fadeIn">
          <form onSubmit={handleSearchSubmit} className="relative mb-3">
            <input
              type="text"
              placeholder="Search trailers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3.5 py-2 pl-9 rounded-lg bg-black/60 border border-white/20 text-sm text-white focus:outline-none"
            />
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </form>

          <Link to="/" className="block py-1.5 text-base font-medium text-gray-200 hover:text-white">
            Home
          </Link>
          <Link to="/browse" className="block py-1.5 text-base font-medium text-gray-200 hover:text-white">
            Browse Movies
          </Link>
          <Link to="/watchlist" className="flex items-center justify-between py-1.5 text-base font-medium text-gray-200 hover:text-white">
            <span>Watchlist</span>
            {watchlistCount > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-[#E50914] text-white text-xs font-bold">
                {watchlistCount}
              </span>
            )}
          </Link>
          {isAdmin && (
            <Link to="/admin" className="block py-1.5 text-base font-medium text-[#E50914]">
              Admin Dashboard
            </Link>
          )}

          <div className="border-t border-white/10 pt-3">
            {isAuthenticated ? (
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-white">{user?.username}</p>
                  <p className="text-xs text-gray-400">{user?.email}</p>
                </div>
                <button
                  onClick={logout}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-500/20 text-red-400"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="block text-center w-full py-2 rounded-lg bg-[#E50914] text-white font-semibold"
              >
                Sign In / Register
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
