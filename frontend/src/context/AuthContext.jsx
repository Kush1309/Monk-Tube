import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkUserStatus = async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const response = await api.get('/users/current-user');
      if (response.data?.success && response.data?.data) {
        setUser(response.data.data);
      } else {
        // Safe fallback if response has unusual structure
        setUser(null);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
      }
    } catch (error) {
      console.error('Error fetching current user:', error);
      setUser(null);
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkUserStatus();

    // Listen for auth expiration events dispatched by Axios interceptor
    const handleAuthExpired = () => {
      setUser(null);
    };

    window.addEventListener('auth-expired', handleAuthExpired);
    return () => {
      window.removeEventListener('auth-expired', handleAuthExpired);
    };
  }, []);

  const login = async (email, password) => {
    try {
      const response = await api.post('/users/login', { email, password });
      if (response.data?.success && response.data?.data) {
        const { accessToken, refreshToken, user: userData } = response.data.data;
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        setUser(userData);
        return { success: true };
      }
      return { success: false, message: 'Invalid response from server' };
    } catch (error) {
      console.error('Login error:', error);
      const message = error.response?.data?.message || 'Login failed. Please check credentials.';
      return { success: false, message };
    }
  };

  const logout = async () => {
    try {
      // Call backend logout endpoint (ignores failure to ensure local state is cleared anyway)
      await api.post('/users/logout');
    } catch (error) {
      console.error('Logout request failed:', error);
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, setUser, checkUserStatus }}>
      {children}
    </AuthContext.Provider>
  );
};
