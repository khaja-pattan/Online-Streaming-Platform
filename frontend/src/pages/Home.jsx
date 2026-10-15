import React, { useState, useEffect } from 'react';
import { Flame, Film, Clapperboard, Compass, Sparkles, Award } from 'lucide-react';
import HeroBanner from '../components/HeroBanner';
import MovieCarousel from '../components/MovieCarousel';
import LoadingSpinner from '../components/LoadingSpinner';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const [featuredMovie, setFeaturedMovie] = useState(null);
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [teluguMovies, setTeluguMovies] = useState([]);
  const [hindiMovies, setHindiMovies] = useState([]);
  const [actionMovies, setActionMovies] = useState([]);
  const [sciFiMovies, setSciFiMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const loadHomeData = async () => {
      setLoading(true);
      try {
        const res = await api.movies.getAll(0, 100);
        const allList = res.content || [];

        // 1. Featured movie (top highlighted for hero)
        const featured = allList.find((m) => m.featured && m.title.includes('Dune')) || allList[0];
        setFeaturedMovie(featured);

        // 2. Row 1: Trending Global / Hollywood trailers (IDs 1-8)
        const trending = allList.filter(
          (m) =>
            m.id <= 8 &&
            !m.genre?.toLowerCase().includes('telugu') &&
            !m.genre?.toLowerCase().includes('hindi')
        );
        setTrendingMovies(trending);

        // 3. Row 2: Popular Telugu Blockbusters
        const telugu = allList.filter(
          (m) =>
            m.genre?.toLowerCase().includes('telugu') ||
            m.language?.toLowerCase() === 'telugu' ||
            (m.id >= 101 && m.id <= 199)
        );
        setTeluguMovies(telugu);

        // 4. Row 3: Popular Hindi & Bollywood Blockbusters
        const hindi = allList.filter(
          (m) =>
            m.genre?.toLowerCase().includes('hindi') ||
            m.language?.toLowerCase() === 'hindi' ||
            (m.id >= 201 && m.id <= 299)
        );
        setHindiMovies(hindi);

        // 5. Row 4: High-Octane Action & Adrenaline (John Wick, Gladiator II, Deadpool, etc.)
        const action = allList.filter(
          (m) =>
            (m.id === 9 || m.id === 10 || m.id === 11 || m.id === 14 || m.id === 16) &&
            !m.genre?.toLowerCase().includes('telugu') &&
            !m.genre?.toLowerCase().includes('hindi')
        );
        setActionMovies(action);

        // 6. Row 5: Sci-Fi & Mind-Bending Worlds (Blade Runner 2049, Alien: Romulus, etc.)
        const scifi = allList.filter(
          (m) =>
            (m.id === 12 || m.id === 13 || m.id === 3 || m.id === 5)
        );
        setSciFiMovies(scifi);
      } catch (err) {
        console.warn('Error loading home data:', err.message);
      } finally {
        setLoading(false);
      }
    };

    loadHomeData();
  }, [user]);

  if (loading) {
    return <LoadingSpinner text="Loading cinematic trailer catalog..." />;
  }

  return (
    <div className="min-h-screen bg-[#0B0B0E] pb-20">
      {/* Cinematic Hero Section */}
      {featuredMovie && <HeroBanner movie={featuredMovie} />}

      {/* Carousels Container with DISTINCT non-overlapping rows */}
      <div className="max-w-7xl mx-auto -mt-10 sm:-mt-16 relative z-20 space-y-10">
        {/* Row 1: Trending Global Blockbusters */}
        <MovieCarousel
          title="Trending Global Trailers"
          movies={trendingMovies}
          icon={Flame}
        />

        {/* Row 2: Popular Telugu Blockbusters */}
        <MovieCarousel
          title="Popular Telugu Cinema Blockbusters"
          movies={teluguMovies}
          icon={Film}
        />

        {/* Row 3: Popular Hindi & Bollywood Blockbusters */}
        <MovieCarousel
          title="Popular Hindi & Bollywood Blockbusters"
          movies={hindiMovies}
          icon={Sparkles}
        />

        {/* Row 4: High-Octane Action & Crime */}
        <MovieCarousel
          title="High-Octane Action & Thrillers"
          movies={actionMovies}
          icon={Clapperboard}
        />

        {/* Row 5: Sci-Fi & Speculative Fiction */}
        <MovieCarousel
          title="Sci-Fi & Mind-Bending Dimensions"
          movies={sciFiMovies}
          icon={Compass}
        />
      </div>
    </div>
  );
}
