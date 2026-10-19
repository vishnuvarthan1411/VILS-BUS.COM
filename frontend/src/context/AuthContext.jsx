// AuthContext.jsx - Authentication and Session Management for VILS BUS.COM
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api.js';
import { useToast } from './ToastContext.jsx';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('vils_token') || null);
  const [loading, setLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('login'); // 'login' or 'register'
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const { showToast } = useToast();

  // Load user profile on startup if token exists
  useEffect(() => {
    async function loadUser() {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const res = await api.getMe();
        if (res && res.user) {
          setUser(res.user);
        }
      } catch (err) {
        console.warn('Session expired or invalid token:', err.message);
        localStorage.removeItem('vils_token');
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
    loadUser();
  }, [token]);

  const login = useCallback(async (email, password) => {
    try {
      const res = await api.login({ email, password });
      localStorage.setItem('vils_token', res.token);
      setToken(res.token);
      setUser(res.user);
      setIsAuthModalOpen(false);
      showToast(`Welcome back, ${res.user.name}!`, 'success');
      return res.user;
    } catch (err) {
      showToast(err.message || 'Login failed. Please check credentials.', 'error');
      throw err;
    }
  }, [showToast]);

  const register = useCallback(async ({ name, email, phone, password }) => {
    try {
      const res = await api.register({ name, email, phone, password });
      localStorage.setItem('vils_token', res.token);
      setToken(res.token);
      setUser(res.user);
      setIsAuthModalOpen(false);
      showToast(`Welcome to VILS BUS.COM, ${res.user.name}!`, 'success');
      return res.user;
    } catch (err) {
      showToast(err.message || 'Registration failed', 'error');
      throw err;
    }
  }, [showToast]);

  const logout = useCallback(async () => {
    try {
      await api.logout().catch(() => {});
    } finally {
      localStorage.removeItem('vils_token');
      setToken(null);
      setUser(null);
      showToast('You have been logged out safely.', 'info');
    }
  }, [showToast]);

  const updateProfile = useCallback(async (data) => {
    try {
      const res = await api.updateProfile(data);
      setUser(res.user);
      showToast('Profile updated successfully!', 'success');
      setIsProfileModalOpen(false);
      return res.user;
    } catch (err) {
      showToast(err.message || 'Failed to update profile', 'error');
      throw err;
    }
  }, [showToast]);

  const openAuthModal = (mode = 'login') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => setIsAuthModalOpen(false);
  const openProfileModal = () => setIsProfileModalOpen(true);
  const closeProfileModal = () => setIsProfileModalOpen(false);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        login,
        register,
        logout,
        updateProfile,
        isAuthModalOpen,
        authModalMode,
        setAuthModalMode,
        openAuthModal,
        closeAuthModal,
        isProfileModalOpen,
        openProfileModal,
        closeProfileModal
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
