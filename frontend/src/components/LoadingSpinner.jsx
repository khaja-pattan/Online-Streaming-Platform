import React from 'react';

export default function LoadingSpinner({ text = 'Loading...' }) {
  return (
    <div className="flex flex-col items-center justify-center p-12 min-h-[40vh]">
      <div className="w-12 h-12 rounded-full border-4 border-white/10 border-t-[#E50914] animate-spin mb-4" />
      <p className="text-gray-400 text-sm font-medium tracking-wide animate-pulse">{text}</p>
    </div>
  );
}
