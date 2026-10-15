import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Film, Lock, User, AlertCircle, Shield, UserCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(usernameOrEmail, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || 'Invalid username or password.');
    } finally {
      setLoading(false);
    }
  };

  // Quick 1-click test buttons for developer & tester convenience
  const fillCredentials = (user, pass) => {
    setUsernameOrEmail(user);
    setPassword(pass);
    setError('');
  };

  return (
    <div className="min-h-screen bg-[#0B0B0E] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-[#E50914]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

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
          <h2 className="text-2xl font-extrabold text-white tracking-tight">Welcome Back</h2>
          <p className="text-gray-400 text-xs mt-1">Sign in to sync your personal trailer watchlist</p>
        </div>

        {/* 1-Click Test Credentials Buttons */}
        <div className="bg-[#1C1C24] border border-white/5 rounded-2xl p-3.5 mb-6">
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2 text-center">
            Instant Test Accounts (1-Click Fill)
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => fillCredentials('admin', 'Admin@123')}
              className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-[#E50914] text-xs font-bold border border-red-500/20 transition"
            >
              <Shield size={13} /> Admin
            </button>
            <button
              type="button"
              onClick={() => fillCredentials('john_doe', 'User@123')}
              className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 text-xs font-bold border border-blue-500/20 transition"
            >
              <UserCheck size={13} /> Demo User
            </button>
          </div>
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
              Username or Email
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={usernameOrEmail}
                onChange={(e) => setUsernameOrEmail(e.target.value)}
                placeholder="admin or john_doe"
                className="w-full px-4 py-3 pl-10 rounded-xl bg-black/40 border border-white/10 text-white text-sm focus:outline-none focus:border-[#E50914]"
              />
              <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
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
                placeholder="••••••••"
                className="w-full px-4 py-3 pl-10 rounded-xl bg-black/40 border border-white/10 text-white text-sm focus:outline-none focus:border-[#E50914]"
              />
              <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3.5 rounded-xl bg-[#E50914] hover:bg-[#F40612] text-white font-bold text-sm shadow-xl transition red-glow-hover disabled:opacity-50"
          >
            {loading ? 'Authenticating...' : 'Sign In to StreamFlix'}
          </button>
        </form>

        <div className="mt-8 text-center text-xs text-gray-400">
          Don't have an account?{' '}
          <Link to="/register" className="text-[#E50914] hover:underline font-bold">
            Create an Account
          </Link>
        </div>
      </div>
    </div>
  );
}
