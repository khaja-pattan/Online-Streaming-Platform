import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import MovieCard from './MovieCard';

export default function MovieCarousel({ title, movies = [], icon: Icon }) {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollAmount = clientWidth * 0.75;
      scrollRef.current.scrollTo({
        left: direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  if (!movies || movies.length === 0) return null;

  return (
    <div className="relative py-4 group">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-3 px-4 sm:px-8">
        <div className="flex items-center gap-2.5">
          <span className="w-1.5 h-6 bg-[#E50914] rounded-full" />
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            {Icon && <Icon size={22} className="text-[#E50914]" />}
            {title}
          </h2>
        </div>

        {/* Scroll Controls (Desktop) */}
        <div className="hidden sm:flex items-center gap-1.5">
          <button
            onClick={() => scroll('left')}
            className="p-2 rounded-full bg-white/5 hover:bg-white/15 text-gray-300 hover:text-white transition border border-white/5"
            aria-label="Scroll left"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={() => scroll('right')}
            className="p-2 rounded-full bg-white/5 hover:bg-white/15 text-gray-300 hover:text-white transition border border-white/5"
            aria-label="Scroll right"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* Horizontal Carousel Container */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto no-scrollbar px-4 sm:px-8 py-2 scroll-smooth"
      >
        {movies.map((movie) => (
          <div key={movie.id} className="w-[160px] sm:w-[200px] md:w-[220px] shrink-0">
            <MovieCard movie={movie} />
          </div>
        ))}
      </div>
    </div>
  );
}
