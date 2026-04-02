import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../axiosConfig';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const savedToken = localStorage.getItem('token');

    if (
      savedUser &&
      savedUser !== 'undefined' &&
      savedUser !== 'null' &&
      savedToken
    ) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Invalid user data in localStorage:', error);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        setUser(null);
      }
    }

    setLoading(false);
  }, []);

  const login = async (formData) => {
    const response = await api.post('/api/auth/login', formData);

    // แปลง response backend ให้เป็น format ที่ frontend ใช้ต่อได้
    const userData = {
      id: response.data.id,
      name: response.data.name,
      email: response.data.email,
      role: response.data.role || 'user', // fallback ไว้ก่อน ถ้า backend ยังไม่ส่ง role
    };

    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(userData));

    setUser(userData);

    return {
      token: response.data.token,
      user: userData,
    };
  };

  const register = async (formData) => {
    const response = await api.post('/api/auth/register', formData);
    return response.data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);