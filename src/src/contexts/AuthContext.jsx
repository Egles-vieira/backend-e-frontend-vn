// src/contexts/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/auth.service';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = () => {
      const token = authService.getToken();
      const userData = authService.getCurrentUser();
      
      if (token && userData) {
        setUser(userData);
      }
      
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (credentials) => {
    try {
      const result = await authService.login(credentials);
      
      if (result.success) {
        setUser(result.user);
        toast.success('Login realizado com sucesso!');
        return { success: true };
      } else {
        toast.error(result.message || 'Erro ao fazer login');
        return { success: false, message: result.message };
      }
    } catch (error) {
      const message = 'Erro ao conectar com o servidor';
      toast.error(message);
      return { success: false, message };
    }
  };

  const register = async (userData) => {
    try {
      const result = await authService.register(userData);
      
      if (result.success) {
        setUser(result.user);
        toast.success('Conta criada com sucesso!');
        return { success: true };
      } else {
        toast.error(result.message || 'Erro ao criar conta');
        return { success: false, message: result.message };
      }
    } catch (error) {
      const message = 'Erro ao conectar com o servidor';
      toast.error(message);
      return { success: false, message };
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      setUser(null);
      toast.success('Logout realizado com sucesso!');
    } catch (error) {
      console.warn('Erro no logout:', error);
      setUser(null);
    }
  };

  const updateUser = (userData) => {
    setUser(userData);
    localStorage.setItem('auth.user', JSON.stringify(userData));
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateUser,
    isAuthenticated: !!user,
    hasRole: (role) => user?.role === role || user?.role === 'admin'
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};