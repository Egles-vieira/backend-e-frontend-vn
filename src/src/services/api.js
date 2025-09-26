// src/services/api.js
import axios from 'axios';
import { environments, getStoredEnvironment } from '../config/environments';

// Instância principal do axios
const api = axios.create({
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Configurar ambiente inicial
const updateApiConfig = (envKey) => {
  const env = environments[envKey];
  if (env) {
    api.defaults.baseURL = env.baseURL + env.apiPrefix;
    
    // Atualizar token se existir
    const token = localStorage.getItem('auth.token');
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }
};

// Configurar ambiente inicial
updateApiConfig(getStoredEnvironment());

// Interceptor de request para adicionar token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth.token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor de response para tratar erros
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado ou inválido
      localStorage.removeItem('auth.token');
      localStorage.removeItem('auth.user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Função para atualizar configuração da API
export const updateEnvironment = (envKey) => {
  updateApiConfig(envKey);
};

export default api;