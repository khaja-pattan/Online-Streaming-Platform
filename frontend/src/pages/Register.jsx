import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Film, Lock, User, Mail, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('ROLE_USER');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);
    try {
      await register(username, email, password, role);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0B0E] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-1/4 -right-32 w-96 h-96 bg-[#E50914]/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 w-full max-w-md bg-[#14141A] border border-white/10 rounded-3xl p-8 sm:p-10 shadow-2xl">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-3">
            <div className="w-10 h-10 rounded-xl bg-[#E50914] flex items-center justify-center text-white shadow-lg">
              <Film size={22} />
            </div>
            <span className="text-2xl font-black text-white">
              Stream<span className="text-[#E50914]">Flix</span>
            </span>
          </Link>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">Create Free Account</h2>
          <p className="text-gray-400 text-xs mt-1">Explore, bookmark, and discover movie trailers</p>
        </div>

        {error && (
          <div className="mb-6 p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
            <AlertCircle size={16} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1.5">
              Username
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Choose a username"
                className="w-full px-4 py-3 pl-10 rounded-xl bg-black/40 border border-white/10 text-white text-sm focus:outline-none focus:border-[#E50914]"
              />
              <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-3 pl-10 rounded-xl bg-black/40 border border-white/10 text-white text-sm focus:outline-none focus:border-[#E50914]"
              />
              <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="w-full px-4 py-3 pl-10 rounded-xl bg-black/40 border border-white/10 text-white text-sm focus:outline-none focus:border-[#E50914]"
              />
              <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1.5">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repeat password"
                className="w-full px-4 py-3 pl-10 rounded-xl bg-black/40 border border-white/10 text-white text-sm focus:outline-none focus:border-[#E50914]"
              />
              <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1.5">
              Account Role
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-sm focus:outline-none focus:border-[#E50914]"
            >
              <option value="ROLE_USER">Standard Movie Fan (USER)</option>
              <option value="ROLE_ADMIN">Catalog Curator (ADMIN)</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3.5 rounded-xl bg-[#E50914] hover:bg-[#F40612] text-white font-bold text-sm shadow-xl transition red-glow-hover disabled:opacity-50"
          >
            {loading ? 'Registering...' : 'Create StreamFlix Account'}
          </button>
        </form>

        <div className="mt-8 text-center text-xs text-gray-400">
          Already have an account?{' '}
          <Link to="/login" className="text-[#E50914] hover:underline font-bold">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
