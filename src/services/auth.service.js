// src/services/auth.service.js
import api from '../config/api';

class AuthService {
  async login(credentials) {
    try {
      const response = await api.post('/auth/login', credentials);
      
      if (response.data.success) {
        const { token, user } = response.data.data;
        
        // Salvar no localStorage
        localStorage.setItem('auth.token', token);
        localStorage.setItem('auth.user', JSON.stringify(user));
        
        // Atualizar header do axios
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        return { success: true, user, token };
      }
      
      return { success: false, message: response.data.message };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Erro ao fazer login'
      };
    }
  }

  async register(userData) {
    try {
      const response = await api.post('/auth/register', userData);
      
      if (response.data.success) {
        const { token, user } = response.data.data;
        
        localStorage.setItem('auth.token', token);
        localStorage.setItem('auth.user', JSON.stringify(user));
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        return { success: true, user, token };
      }
      
      return { success: false, message: response.data.message };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Erro ao criar conta'
      };
    }
  }

  async logout() {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.warn('Erro ao fazer logout no servidor:', error);
    } finally {
      localStorage.removeItem('auth.token');
      localStorage.removeItem('auth.user');
      delete api.defaults.headers.common['Authorization'];
    }
  }

  getCurrentUser() {
    try {
      const user = localStorage.getItem('auth.user');
      return user ? JSON.parse(user) : null;
    } catch {
      return null;
    }
  }

  getToken() {
    return localStorage.getItem('auth.token');
  }

  isAuthenticated() {
    return !!this.getToken();
  }
}

export default new AuthService();