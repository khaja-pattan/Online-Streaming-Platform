import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { WatchlistProvider } from './context/WatchlistContext';
import { TrailerModalProvider } from './context/TrailerModalContext';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import TrailerPlayerModal from './components/TrailerPlayerModal';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import Browse from './pages/Browse';
import MovieDetails from './pages/MovieDetails';
import Watchlist from './pages/Watchlist';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <WatchlistProvider>
          <TrailerModalProvider>
            <div className="min-h-screen bg-[#0B0B0E] text-gray-100 flex flex-col font-sans selection:bg-[#E50914] selection:text-white">
              {/* Glassmorphic Navbar */}
              <Navbar />

              {/* Global Trailer Video Player Modal */}
              <TrailerPlayerModal />

              {/* Main Content Area */}
              <main className="flex-1">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/browse" element={<Browse />} />
                  <Route path="/movies/:id" element={<MovieDetails />} />
                  <Route
                    path="/watchlist"
                    element={
                      <ProtectedRoute>
                        <Watchlist />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/profile"
                    element={
                      <ProtectedRoute>
                        <Profile />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin"
                    element={
                      <ProtectedRoute requireAdmin={true}>
                        <AdminDashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>

              {/* Legal & Architectural Footer */}
              <Footer />
            </div>
          </TrailerModalProvider>
        </WatchlistProvider>
      </AuthProvider>
    </Router>
  );
}
