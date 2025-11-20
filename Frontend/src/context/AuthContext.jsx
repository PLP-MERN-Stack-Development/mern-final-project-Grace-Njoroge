import React, { createContext, useState, useEffect, useContext } from 'react';
import apiService from '../services/apiService';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore session from localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem('authUser');
    const savedToken = localStorage.getItem('authToken');

    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser));
      setToken(savedToken);
    }

    setLoading(false);
  }, []);

  // ---------------------------
  // LOGIN (real backend)
  // ---------------------------
  const login = async (credentials) => {
    const data = await apiService.login(credentials);

    // Expecting: { token, user }
    if (data?.token && data?.user) {
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('authUser', JSON.stringify(data.user));
      setToken(data.token);
      setUser(data.user);
      return { success: true };
    }

    return { success: false, message: data?.message || 'Login failed' };
  };

  // ---------------------------
  // REGISTER (real backend)
  // ---------------------------
  const register = async (userData) => {
    const data = await apiService.register(userData);

    if (data?.token && data?.user) {
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('authUser', JSON.stringify(data.user));
      setToken(data.token);
      setUser(data.user);
      return { success: true };
    }

    return { success: false, message: data?.message || 'Registration failed' };
  };

  // ---------------------------
  // LOGOUT
  // ---------------------------
  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
export default AuthProvider;
