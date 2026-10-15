import React from 'react';
import { Link } from 'react-router-dom';
import { Film, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0B0B0E] flex flex-col items-center justify-center p-6 text-center">
      <div className="w-20 h-20 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-[#E50914] mb-6 shadow-2xl">
        <Film size={40} />
      </div>
      <h1 className="text-6xl sm:text-7xl font-black text-white tracking-tight mb-2">404</h1>
      <h2 className="text-xl sm:text-2xl font-bold text-gray-200 mb-3">Trailer Scene Not Found</h2>
      <p className="text-gray-400 text-sm max-w-md mb-8">
        The movie trailer or page you're looking for appears to have been cut from the final release.
      </p>
      <Link
        to="/"
        className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#E50914] hover:bg-[#F40612] text-white font-bold text-sm shadow-xl transition red-glow-hover"
      >
        <Home size={18} /> Back to Home Screen
      </Link>
    </div>
  );
}
