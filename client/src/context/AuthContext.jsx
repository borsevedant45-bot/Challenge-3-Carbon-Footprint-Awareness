import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

// Setup axios defaults for credentials (cookies) and base URL
axios.defaults.withCredentials = true;
if (import.meta.env.VITE_API_URL) {
  axios.defaults.baseURL = import.meta.env.VITE_API_URL;
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  // Fetch current user session on mount
  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        const response = await axios.get('/api/auth/me');
        if (response.data.success) {
          setUser(response.data.data);
        }
      } catch (error) {
        // Not logged in or expired, fail silently
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkLoggedIn();
  }, []);

  // Theme effect
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  // Login User
  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await axios.post('/api/auth/login', { email, password });
      if (res.data.success) {
        setUser(res.data.user);
        return { success: true };
      }
      return { success: false, message: 'Invalid server response' };
    } catch (error) {
      const msg = error.response?.data?.message || 'Login failed';
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  // Register User
  const register = async (name, email, password) => {
    setLoading(true);
    try {
      const res = await axios.post('/api/auth/register', { name, email, password });
      if (res.data.success) {
        setUser(res.data.user);
        return { success: true };
      }
      return { success: false, message: 'Registration failed' };
    } catch (error) {
      const msg = error.response?.data?.message || 'Registration failed';
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  // Logout User
  const logout = async () => {
    try {
      await axios.post('/api/auth/logout');
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Save Baseline onboarding score
  const updateBaseline = async (quizData) => {
    try {
      const res = await axios.post('/api/insights/baseline', quizData);
      if (res.data.success) {
        const { baselineScore, geminiAnalysis } = res.data.data;
        setUser(prev => prev ? { ...prev, baselineScore } : null);
        return { success: true, baselineScore, geminiAnalysis };
      }
      return { success: false, message: 'Baseline update failed' };
    } catch (error) {
      const msg = error.response?.data?.message || 'Onboarding failed';
      return { success: false, message: msg };
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      login,
      register,
      logout,
      updateBaseline,
      theme,
      toggleTheme
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
