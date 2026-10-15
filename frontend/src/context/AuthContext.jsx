import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('streamflix_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('streamflix_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      if (token) {
        try {
          const profile = await api.auth.getCurrentUser();
          setUser(profile);
          localStorage.setItem('streamflix_user', JSON.stringify(profile));
        } catch (e) {
          console.warn('Could not revalidate session token:', e.message);
        }
      }
      setLoading(false);
    };
    initAuth();
  }, [token]);

  const login = async (usernameOrEmail, password) => {
    const data = await api.auth.login(usernameOrEmail, password);
    setToken(data.token);
    setUser(data.user);
    localStorage.setItem('streamflix_token', data.token);
    localStorage.setItem('streamflix_user', JSON.stringify(data.user));
    return data.user;
  };

  const register = async (username, email, password, role = 'ROLE_USER') => {
    const data = await api.auth.register(username, email, password, role);
    setToken(data.token);
    setUser(data.user);
    localStorage.setItem('streamflix_token', data.token);
    localStorage.setItem('streamflix_user', JSON.stringify(data.user));
    return data.user;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('streamflix_token');
    localStorage.removeItem('streamflix_user');
  };

  const updateProfile = async (profileData) => {
    const updated = await api.auth.updateProfile(profileData);
    setUser(updated);
    localStorage.setItem('streamflix_user', JSON.stringify(updated));
    return updated;
  };

  const isAdmin = user?.role === 'ROLE_ADMIN' || user?.role === 'ADMIN';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        isAdmin,
        loading,
        login,
        register,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
