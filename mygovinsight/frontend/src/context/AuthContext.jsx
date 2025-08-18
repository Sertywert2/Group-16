import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setUser(null);
        return;
      }

      try {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        const response = await api.get('/auth/me');
        setUser(response.data);
      } catch (err) {
        console.error('Auth check failed:', {
          message: err.message,
          status: err.response?.status,
          data: err.response?.data,
        });
        localStorage.removeItem('token');
        delete api.defaults.headers.common['Authorization'];
        setUser(null);
      }
    };

    checkAuth();
  }, []);

  const login = (token, userData) => {
    localStorage.setItem('token', token);
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
    setUser(null);
  };

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
export { AuthContext };
