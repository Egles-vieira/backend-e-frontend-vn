// src/services/auth.service.js
import { apiPost, apiGet } from './api';

class AuthService {
  // Login
  async login(credentials) {
    try {
      const response = await apiPost('/auth/login', credentials);
      
      if (response.success && response.data.token) {
        // Salvar token e dados do usuário
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        
        // Se houver refresh token, salvar também
        if (response.data.refreshToken) {
          localStorage.setItem('refreshToken', response.data.refreshToken);
        }
      }
      
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Registro
  async register(userData) {
    try {
      const response = await apiPost('/auth/register', userData);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Logout
  async logout() {
    try {
      // Tentar fazer logout no servidor
      await apiPost('/auth/logout');
    } catch (error) {
      console.error('Erro no logout:', error);
    } finally {
      // Limpar dados locais independentemente do resultado
      this.clearAuthData();
    }
  }

  // Limpar dados de autenticação
  clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('refreshToken');
  }

  // Verificar se está autenticado
  isAuthenticated() {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    return !!(token && user);
  }

  // Obter usuário atual
  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch (error) {
        console.error('Erro ao parsear dados do usuário:', error);
        return null;
      }
    }
    return null;
  }

  // Obter token
  getToken() {
    return localStorage.getItem('token');
  }

  // Atualizar perfil
  async updateProfile(profileData) {
    try {
      const response = await apiPost('/auth/profile', profileData);
      
      if (response.success && response.data) {
        // Atualizar dados do usuário no localStorage
        localStorage.setItem('user', JSON.stringify(response.data));
      }
      
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Alterar senha
  async changePassword(passwordData) {
    try {
      const response = await apiPost('/auth/change-password', passwordData);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Solicitar recuperação de senha
  async forgotPassword(email) {
    try {
      const response = await apiPost('/auth/forgot-password', { email });
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Redefinir senha
  async resetPassword(token, newPassword) {
    try {
      const response = await apiPost('/auth/reset-password', {
        token,
        password: newPassword
      });
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Refresh token
  async refreshToken() {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        // Se não há refresh token, simplesmente retornar false sem erro
        return false;
      }

      const response = await apiPost('/auth/refresh-token', {
        refreshToken
      });

      if (response.success && response.data.token) {
        localStorage.setItem('token', response.data.token);
        
        if (response.data.refreshToken) {
          localStorage.setItem('refreshToken', response.data.refreshToken);
        }
        
        return true;
      }

      return false;
    } catch (error) {
      // Se refresh falhar, limpar dados mas não lançar erro
      console.warn('Erro no refresh token:', error.message);
      this.clearAuthData();
      return false;
    }
  }

  // Verificar se token é válido
  async isTokenValid() {
    const token = this.getToken();
    if (!token) return false;

    try {
      // Fazer uma requisição simples para verificar se o token é válido
      const response = await fetch('http://localhost:3001/health', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      return response.ok;
    } catch (error) {
      return false;
    }
  }

  // Verificar permissões do usuário
  hasPermission(permission) {
    const user = this.getCurrentUser();
    if (!user || !user.permissions) {
      return false;
    }
    
    return user.permissions.includes(permission) || user.permissions.includes('admin');
  }

  // Verificar papel do usuário
  hasRole(role) {
    const user = this.getCurrentUser();
    if (!user || !user.role) {
      return false;
    }
    
    return user.role === role || user.role === 'admin';
  }
}

export default new AuthService();