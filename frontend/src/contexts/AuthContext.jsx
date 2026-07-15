import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiClient } from '../client';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    if (token) {
      const userData = JSON.parse(localStorage.getItem('user'));
      setUser(userData);
    }
  }, [token]);

  const login = async (email, password) => {
    const data = await apiClient.login(email, password);
    localStorage.setItem('token', data.accessToken);
    localStorage.setItem('user', JSON.stringify(data.user));
    setUser(data.user);
    setToken(data.accessToken);
  };

  const register = async (email, password, name) => {
    const data = await apiClient.register(name, email, password);
    localStorage.setItem('token', data.accessToken);
    localStorage.setItem('user', JSON.stringify(data.user));
    setUser(data.user);
    setToken(data.accessToken);
  };

  const logout = () => {
    localStorage.removeItem("myLearningCourses");
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setToken(null);
  };
const refetchUser = async () => {
  const user = await apiClient.getCurrentUser();

  localStorage.setItem("user", JSON.stringify(user));
  setUser(user);
};
  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, refetchUser }}>
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
