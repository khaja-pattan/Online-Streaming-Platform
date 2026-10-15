import axios from 'axios';
import { SEED_MOVIES } from '../data/seedMovies';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:2001';

const client = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 5000,
});

// Interceptor to inject JWT token and X-User-Id
client.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('streamflix_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    const userStr = localStorage.getItem('streamflix_user');
    if (userStr) {
      try {
        const u = JSON.parse(userStr);
        if (u && u.id) {
          config.headers['X-User-Id'] = String(u.id);
        }
      } catch (e) {}
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Fallback in-memory / localStorage storage helpers
const LOCAL_STORAGE_MOVIES_KEY = 'streamflix_custom_movies';
const LOCAL_STORAGE_WATCHLIST_KEY = 'streamflix_local_watchlist';

const getLocalMovies = () => {
  const custom = localStorage.getItem(LOCAL_STORAGE_MOVIES_KEY);
  if (custom) {
    try {
      return JSON.parse(custom);
    } catch (e) {
      // fallback
    }
  }
  return SEED_MOVIES;
};

const saveLocalMovies = (movies) => {
  localStorage.setItem(LOCAL_STORAGE_MOVIES_KEY, JSON.stringify(movies));
};

const getLocalWatchlist = () => {
  const wl = localStorage.getItem(LOCAL_STORAGE_WATCHLIST_KEY);
  return wl ? JSON.parse(wl) : [1, 2]; // Dune 2 and Oppenheimer by default for demo
};

const saveLocalWatchlist = (ids) => {
  localStorage.setItem(LOCAL_STORAGE_WATCHLIST_KEY, JSON.stringify(ids));
};

export const api = {
  // Auth API
  auth: {
    async login(usernameOrEmail, password) {
      try {
        const res = await client.post('/api/auth/login', { usernameOrEmail, password });
        return res.data;
      } catch (err) {
        // Fallback for local testing if backend microservices are offline
        console.warn('Backend unavailable, validating against demo credentials locally:', err.message);
        if (
          (usernameOrEmail === 'admin' || usernameOrEmail === 'admin@streamflix.com') &&
          password === 'Admin@123'
        ) {
          const mockAdmin = {
            token: 'mock-jwt-admin-token-streamflix-2026',
            tokenType: 'Bearer',
            user: {
              id: 1,
              username: 'admin',
              email: 'admin@streamflix.com',
              role: 'ROLE_ADMIN',
              createdAt: '2026-01-01T00:00:00'
            }
          };
          return mockAdmin;
        } else if (
          (usernameOrEmail === 'john_doe' || usernameOrEmail === 'john@streamflix.com') &&
          password === 'User@123'
        ) {
          const mockUser = {
            token: 'mock-jwt-user-token-streamflix-2026',
            tokenType: 'Bearer',
            user: {
              id: 2,
              username: 'john_doe',
              email: 'john@streamflix.com',
              role: 'ROLE_USER',
              createdAt: '2026-01-01T00:00:00'
            }
          };
          return mockUser;
        }
        throw new Error(err.response?.data?.message || 'Invalid username or password.');
      }
    },

    async register(username, email, password, role = 'ROLE_USER') {
      try {
        const res = await client.post('/api/auth/register', { username, email, password, role });
        return res.data;
      } catch (err) {
        console.warn('Backend unavailable, registering user in local session:', err.message);
        const newUser = {
          token: `mock-jwt-token-${Date.now()}`,
          tokenType: 'Bearer',
          user: {
            id: Math.floor(Math.random() * 1000) + 10,
            username,
            email,
            role: role || 'ROLE_USER',
            createdAt: new Date().toISOString()
          }
        };
        return newUser;
      }
    },

    async getCurrentUser() {
      try {
        const res = await client.get('/api/users/me');
        return res.data;
      } catch (err) {
        const stored = localStorage.getItem('streamflix_user');
        if (stored) return JSON.parse(stored);
        throw err;
      }
    },

    async updateProfile(profileData) {
      try {
        const res = await client.put('/api/users/me', profileData);
        return res.data;
      } catch (err) {
        console.warn('Backend unavailable, updating user profile locally');
        const stored = localStorage.getItem('streamflix_user');
        if (stored) {
          const user = { ...JSON.parse(stored), ...profileData };
          localStorage.setItem('streamflix_user', JSON.stringify(user));
          return user;
        }
        throw err;
      }
    }
  },

  // Movies API
  movies: {
    async getAll(page = 0, size = 20, sortBy = 'id', sortDir = 'desc', genre = 'All') {
      try {
        const res = await client.get('/api/movies', {
          params: { page, size, sortBy, sortDir, genre: genre === 'All' ? undefined : genre }
        });
        return res.data;
      } catch (err) {
        console.warn('Backend offline, using fallback movies catalog:', err.message);
        let list = [...getLocalMovies()];
        if (genre && genre !== 'All') {
          list = list.filter(m => m.genre && m.genre.toLowerCase().includes(genre.toLowerCase()));
        }
        if (sortBy === 'rating') {
          list.sort((a, b) => sortDir === 'asc' ? a.rating - b.rating : b.rating - a.rating);
        } else if (sortBy === 'title') {
          list.sort((a, b) => sortDir === 'asc' ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title));
        } else if (sortBy === 'releaseDate') {
          list.sort((a, b) => sortDir === 'asc' ? a.releaseDate.localeCompare(b.releaseDate) : b.releaseDate.localeCompare(a.releaseDate));
        }
        return {
          content: list,
          pageNumber: page,
          pageSize: size,
          totalElements: list.length,
          totalPages: 1,
          last: true
        };
      }
    },

    async getById(id) {
      try {
        const res = await client.get(`/api/movies/${id}`);
        return res.data;
      } catch (err) {
        const list = getLocalMovies();
        const found = list.find(m => m.id === Number(id));
        if (found) return found;
        throw new Error('Movie not found');
      }
    },

    async search(keyword) {
      try {
        const res = await client.get('/api/movies/search', { params: { keyword } });
        return res.data;
      } catch (err) {
        const list = getLocalMovies();
        if (!keyword) return list.slice(0, 10);
        const lower = keyword.toLowerCase();
        return list.filter(m =>
          m.title.toLowerCase().includes(lower) ||
          (m.genre && m.genre.toLowerCase().includes(lower)) ||
          (m.director && m.director.toLowerCase().includes(lower)) ||
          (m.cast && m.cast.toLowerCase().includes(lower))
        );
      }
    },

    async getTrending() {
      try {
        const res = await client.get('/api/movies/trending');
        return res.data;
      } catch (err) {
        return [...getLocalMovies()].sort((a, b) => b.rating - a.rating).slice(0, 8);
      }
    },

    async getFeatured() {
      try {
        const res = await client.get('/api/movies/featured');
        return res.data;
      } catch (err) {
        const list = getLocalMovies();
        return list.filter(m => m.featured).length ? list.filter(m => m.featured) : list.slice(0, 3);
      }
    },

    async getByGenre(genre) {
      try {
        const res = await client.get(`/api/movies/genre/${encodeURIComponent(genre)}`);
        return res.data;
      } catch (err) {
        return getLocalMovies().filter(m => m.genre && m.genre.toLowerCase().includes(genre.toLowerCase()));
      }
    },

    async create(movieData) {
      try {
        const res = await client.post('/api/movies', movieData);
        return res.data;
      } catch (err) {
        console.warn('Backend offline, creating movie locally:', err.message);
        const list = getLocalMovies();
        const newMovie = {
          ...movieData,
          id: Date.now(),
          rating: Number(movieData.rating) || 8.0,
          createdAt: new Date().toISOString()
        };
        const updated = [newMovie, ...list];
        saveLocalMovies(updated);
        return newMovie;
      }
    },

    async update(id, movieData) {
      try {
        const res = await client.put(`/api/movies/${id}`, movieData);
        return res.data;
      } catch (err) {
        console.warn('Backend offline, updating movie locally:', err.message);
        const list = getLocalMovies();
        const updated = list.map(m => m.id === Number(id) ? { ...m, ...movieData } : m);
        saveLocalMovies(updated);
        return updated.find(m => m.id === Number(id));
      }
    },

    async delete(id) {
      try {
        await client.delete(`/api/movies/${id}`);
      } catch (err) {
        console.warn('Backend offline, deleting movie locally:', err.message);
        const list = getLocalMovies();
        const updated = list.filter(m => m.id !== Number(id));
        saveLocalMovies(updated);
      }
    }
  },

  // Watchlist API
  watchlist: {
    async get() {
      const userStr = localStorage.getItem('streamflix_user');
      let userId = 1;
      try {
        if (userStr) userId = JSON.parse(userStr)?.id || 1;
      } catch (e) {}
      try {
        const res = await client.get('/api/watchlist', { params: { userId } });
        return res.data;
      } catch (err) {
        const ids = getLocalWatchlist();
        const allMovies = getLocalMovies();
        return ids.map(id => {
          const m = allMovies.find(movie => movie.id === id);
          return {
            id,
            movieId: id,
            addedAt: new Date().toISOString(),
            movie: m || { id, title: `Movie #${id}` }
          };
        });
      }
    },

    async add(movieId) {
      const userStr = localStorage.getItem('streamflix_user');
      let userId = 1;
      try {
        if (userStr) userId = JSON.parse(userStr)?.id || 1;
      } catch (e) {}
      try {
        const res = await client.post(`/api/watchlist/${movieId}?userId=${userId}`);
        return res.data;
      } catch (err) {
        console.error('Failed to save to database via API:', err.message);
        const ids = getLocalWatchlist();
        if (!ids.includes(Number(movieId))) {
          ids.push(Number(movieId));
          saveLocalWatchlist(ids);
        }
        return { movieId: Number(movieId), inWatchlist: true };
      }
    },

    async remove(movieId) {
      const userStr = localStorage.getItem('streamflix_user');
      let userId = 1;
      try {
        if (userStr) userId = JSON.parse(userStr)?.id || 1;
      } catch (e) {}
      try {
        await client.delete(`/api/watchlist/${movieId}?userId=${userId}`);
      } catch (err) {
        const ids = getLocalWatchlist().filter(id => id !== Number(movieId));
        saveLocalWatchlist(ids);
      }
    },

    async check(movieId) {
      const userStr = localStorage.getItem('streamflix_user');
      let userId = 1;
      try {
        if (userStr) userId = JSON.parse(userStr)?.id || 1;
      } catch (e) {}
      try {
        const res = await client.get(`/api/watchlist/check/${movieId}`, { params: { userId } });
        return res.data.inWatchlist;
      } catch (err) {
        const ids = getLocalWatchlist();
        return ids.includes(Number(movieId));
      }
    }
  },

  // Recommendations API
  recommendations: {
    async get() {
      try {
        const res = await client.get('/api/recommendations');
        return res.data;
      } catch (err) {
        // Simple personalized recommendation fallback
        const allMovies = getLocalMovies();
        const watchlistIds = getLocalWatchlist();
        const savedMovies = allMovies.filter(m => watchlistIds.includes(m.id));
        if (savedMovies.length > 0) {
          const genres = new Set();
          savedMovies.forEach(m => {
            if (m.genre) {
              m.genre.split(',').forEach(g => genres.add(g.trim().toLowerCase()));
            }
          });
          const recs = allMovies.filter(m =>
            !watchlistIds.includes(m.id) &&
            m.genre &&
            Array.from(genres).some(g => m.genre.toLowerCase().includes(g))
          );
          if (recs.length > 0) {
            return recs.sort((a, b) => b.rating - a.rating).slice(0, 8);
          }
        }
        return [...allMovies].sort((a, b) => b.rating - a.rating).slice(0, 8);
      }
    }
  }
};

export default api;
