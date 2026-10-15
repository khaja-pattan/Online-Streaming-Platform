import React, { useState } from 'react';
import { User, Mail, Shield, Calendar, LogOut, Check, AlertCircle, Bookmark } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useWatchlist } from '../context/WatchlistContext';
import { Link } from 'react-router-dom';

export default function Profile() {
  const { user, isAdmin, updateProfile, logout } = useAuth();
  const { watchlist } = useWatchlist();

  const [username, setUsername] = useState(user?.username || '');
  const [email, setEmail] = useState(user?.email || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage('');
    setErrorMessage('');
    setSaving(true);

    try {
      const payload = { username, email };
      if (newPassword) {
        payload.currentPassword = currentPassword;
        payload.newPassword = newPassword;
      }
      await updateProfile(payload);
      setSuccessMessage('Profile details updated successfully!');
      setCurrentPassword('');
      setNewPassword('');
    } catch (err) {
      setErrorMessage(err.response?.data?.message || err.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0B0E] pt-24 pb-20 px-4 sm:px-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-white tracking-tight">User Account & Settings</h1>
        <p className="text-gray-400 text-sm mt-1">Manage your StreamFlix profile and security preferences.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* User Card */}
        <div className="bg-[#14141A] border border-white/5 rounded-2xl p-6 flex flex-col items-center text-center shadow-xl md:col-span-1">
          <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-[#E50914] to-amber-500 flex items-center justify-center text-white text-3xl font-black uppercase mb-4 shadow-lg">
            {user?.username ? user.username.charAt(0) : 'U'}
          </div>

          <h3 className="text-lg font-bold text-white truncate max-w-full">{user?.username}</h3>
          <p className="text-xs text-gray-400 truncate max-w-full mb-3">{user?.email}</p>

          <span
            className={`px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase mb-6 ${
              isAdmin
                ? 'bg-[#E50914]/20 text-[#E50914] border border-[#E50914]/40'
                : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
            }`}
          >
            {isAdmin ? 'Administrator' : 'Standard Member'}
          </span>

          {/* Quick Stats */}
          <div className="w-full border-t border-white/5 pt-4 space-y-3 text-left text-xs text-gray-400">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5"><Bookmark size={14} /> Saved Trailers</span>
              <strong className="text-white text-sm">{watchlist.length}</strong>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5"><Calendar size={14} /> Member Since</span>
              <span className="text-gray-300">
                {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Active'}
              </span>
            </div>
          </div>

          <button
            onClick={logout}
            className="w-full mt-6 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-red-500/20 text-red-400 hover:text-red-300 border border-white/5 transition text-xs font-bold"
          >
            <LogOut size={16} /> Sign Out
          </button>
        </div>

        {/* Edit Profile Form */}
        <div className="bg-[#14141A] border border-white/5 rounded-2xl p-6 sm:p-8 shadow-xl md:col-span-2">
          <h3 className="text-lg font-bold text-white mb-6 pb-3 border-b border-white/5">
            Edit Profile Information
          </h3>

          {successMessage && (
            <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm flex items-center gap-2">
              <Check size={18} /> {successMessage}
            </div>
          )}

          {errorMessage && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm flex items-center gap-2">
              <AlertCircle size={18} /> {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
                Username
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 pl-10 rounded-xl bg-black/40 border border-white/10 text-white text-sm focus:outline-none focus:border-[#E50914]"
                />
                <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 pl-10 rounded-xl bg-black/40 border border-white/10 text-white text-sm focus:outline-none focus:border-[#E50914]"
                />
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
            </div>

            <div className="pt-4 border-t border-white/5">
              <h4 className="text-sm font-semibold text-white mb-3">Change Password (Optional)</h4>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Current Password</label>
                  <input
                    type="password"
                    placeholder="Enter current password to verify"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-sm focus:outline-none focus:border-[#E50914]"
                  />
                </div>

                <div>
                  <label className="block text-xs text-gray-400 mb-1">New Password</label>
                  <input
                    type="password"
                    placeholder="Min. 6 characters"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-sm focus:outline-none focus:border-[#E50914]"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2.5 rounded-xl bg-[#E50914] hover:bg-[#F40612] text-white font-semibold text-sm shadow-md transition disabled:opacity-50"
              >
                {saving ? 'Saving changes...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
