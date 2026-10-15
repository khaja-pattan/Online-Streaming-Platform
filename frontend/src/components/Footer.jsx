import React from 'react';
import { Film, ShieldCheck, Video, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="mt-auto bg-[#08080A] border-t border-white/5 pt-12 pb-8 text-gray-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand Info */}
          <div className="space-y-3 md:col-span-1">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#E50914] flex items-center justify-center text-white font-bold">
                <Film size={18} />
              </div>
              <span className="text-xl font-black text-white">
                Stream<span className="text-[#E50914]">Flix</span>
              </span>
            </Link>
            <p className="text-xs text-gray-400 leading-relaxed">
              Discover official cinematic trailers, teasers, and promotional videos from major world studios.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-3 text-sm tracking-wide">Navigation</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/" className="hover:text-white transition">Home</Link></li>
              <li><Link to="/browse" className="hover:text-white transition">Browse All Movies</Link></li>
              <li><Link to="/browse?genre=Action" className="hover:text-white transition">Action & Adventure</Link></li>
              <li><Link to="/browse?genre=Sci-Fi" className="hover:text-white transition">Sci-Fi Masterpieces</Link></li>
              <li><Link to="/watchlist" className="hover:text-white transition">Personal Watchlist</Link></li>
            </ul>
          </div>

          {/* Architecture & Tech */}
          <div>
            <h4 className="text-white font-semibold mb-3 text-sm tracking-wide">Architecture</h4>
            <ul className="space-y-1.5 text-xs text-gray-400">
              <li>Java 17/21 & Spring Boot 3.x</li>
              <li>Spring Cloud Gateway & Eureka</li>
              <li>Spring Data JPA & MySQL</li>
              <li>OpenFeign Inter-service</li>
              <li>React 19, Vite & Tailwind CSS</li>
            </ul>
          </div>

          {/* Copyright Safe Notice */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-white font-semibold text-sm">
              <ShieldCheck size={18} className="text-emerald-400" />
              <span>Copyright Compliance</span>
            </div>
            <p className="text-xs leading-relaxed text-gray-400">
              StreamFlix is an independent movie discovery platform. All movie names, posters, trademarks, and trailers belong to their respective copyright holders.
            </p>
            <div className="flex items-center gap-2 text-xs text-gray-400 pt-1">
              <Video size={16} className="text-red-500" />
              <span>Embedded via official YouTube IFrame API</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/5 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-400 gap-3">
          <p>© {new Date().getFullYear()} StreamFlix Platform. Built with modern Spring Boot Microservices.</p>
          <p className="flex items-center gap-1">
            Engineered for high performance and visual excellence
          </p>
        </div>
      </div>
    </footer>
  );
}
