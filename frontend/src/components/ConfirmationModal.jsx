import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

export default function ConfirmationModal({ isOpen, title, message, onConfirm, onCancel, confirmText = 'Confirm', confirmButtonClass = 'bg-red-600 hover:bg-red-700' }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-md bg-[#16161D] border border-white/10 rounded-2xl p-6 shadow-2xl">
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          <X size={20} />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-red-500/20 text-red-500 flex items-center justify-center">
            <AlertTriangle size={22} />
          </div>
          <h3 className="text-lg font-bold text-white">{title}</h3>
        </div>

        <p className="text-sm text-gray-300 mb-6 leading-relaxed">
          {message}
        </p>

        <div className="flex items-center justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-lg text-sm font-medium bg-white/10 text-gray-300 hover:bg-white/20 transition"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 rounded-lg text-sm font-medium text-white transition ${confirmButtonClass}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
