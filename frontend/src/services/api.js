// src/services/api.js
import axios from 'axios';

// Configuração de ambiente que pode ser alterada dinamicamente
let environmentConfig = {
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api',
  API_TIMEOUT: parseInt(import.meta.env.VITE_API_TIMEOUT) || 30000,
  DEBUG_MODE: import.meta.env.VITE_DEBUG_MODE === 'true',
  ENVIRONMENT: import.meta.env.VITE_APP_ENV || 'development',
  SHOW_LOGS: import.meta.env.VITE_SHOW_LOGS === 'true'
};

// Função para atualizar configuração globalmente
export const updateEnvironmentConfig = (newConfig) => {
  environmentConfig = { ...environmentConfig, ...newConfig };
  
  // Recriar instância do axios com nova configuração
  updateApiInstance();
  
  // Salvar no localStorage para persistir
  localStorage.setItem('environmentConfig', JSON.stringify(environmentConfig));
  
  // Log da mudança
  if (environmentConfig.DEBUG_MODE) {
    console.log('🔧 Configuração de ambiente atualizada:', environmentConfig);
  }
};

// Função para obter configuração atual
export const getEnvironmentConfig = () => {
  return { ...environmentConfig };
};

// Função para carregar configuração salva
export const loadSavedConfig = () => {
  try {
    const saved = localStorage.getItem('environmentConfig');
    if (saved) {
      const parsedConfig = JSON.parse(saved);
      environmentConfig = { ...environmentConfig, ...parsedConfig };
      updateApiInstance();
    }
  } catch (error) {
    console.warn('Erro ao carregar configuração salva:', error);
  }
};

// Função para resetar para configuração padrão
export const resetEnvironmentConfig = () => {
  environmentConfig = {
    API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api',
    API_TIMEOUT: parseInt(import.meta.env.VITE_API_TIMEOUT) || 30000,
    DEBUG_MODE: import.meta.env.VITE_DEBUG_MODE === 'true',
    ENVIRONMENT: import.meta.env.VITE_APP_ENV || 'development',
    SHOW_LOGS: import.meta.env.VITE_SHOW_LOGS === 'true'
  };
  
  localStorage.removeItem('environmentConfig');
  updateApiInstance();
  
  if (environmentConfig.DEBUG_MODE) {
    console.log('🔄 Configuração resetada para padrão');
  }
};

// Criar instância do axios
let api = null;

const createApiInstance = () => {
  return axios.create({
    baseURL: environmentConfig.API_BASE_URL,
    timeout: environmentConfig.API_TIMEOUT,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

// Função para atualizar instância da API
const updateApiInstance = () => {
  api = createApiInstance();
  setupInterceptors();
};

// Configurar interceptors
const setupInterceptors = () => {
  if (!api) return;

  // Interceptor para adicionar token de autenticação
  api.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      // Log apenas em modo debug
      if (environmentConfig.DEBUG_MODE && environmentConfig.SHOW_LOGS) {
        console.log(`🔵 API Request [${environmentConfig.ENVIRONMENT}]:`, {
          method: config.method?.toUpperCase(),
          url: config.url,
          baseURL: config.baseURL,
          timeout: config.timeout
        });
      }

      return config;
    },
    (error) => {
      if (environmentConfig.DEBUG_MODE) {
        console.error('🔴 API Request Error:', error);
      }
      return Promise.reject(error);
    }
  );

  // Interceptor para tratar respostas
  api.interceptors.response.use(
    (response) => {
      // Log de sucesso apenas em modo debug
      if (environmentConfig.DEBUG_MODE && environmentConfig.SHOW_LOGS) {
        console.log(`🟢 API Response [${response.status}]:`, {
          url: response.config.url,
          method: response.config.method?.toUpperCase(),
          status: response.status,
          data: response.data?.success ? '✅ Success' : '❌ Error'
        });
      }

      return response;
    },
    (error) => {
      // Tratamento de erro 401
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        
        if (environmentConfig.DEBUG_MODE) {
          console.warn('🔑 Token expirado - redirecionando para login');
        }
        
        window.location.href = '/login';
      }

      // Log detalhado do erro
      const errorInfo = {
        status: error.response?.status,
        message: error.response?.data?.message || error.message,
        url: error.config?.url,
        method: error.config?.method?.toUpperCase(),
        environment: environmentConfig.ENVIRONMENT
      };

      if (environmentConfig.DEBUG_MODE) {
        console.error('🔴 API Error:', errorInfo);
      }

      return Promise.reject(error);
    }
  );
};

// Inicializar API
const initializeApi = () => {
  loadSavedConfig();
  updateApiInstance();
};

// Funções auxiliares para diferentes tipos de requisição
export const apiGet = async (url, config = {}) => {
  try {
    const response = await api.get(url, config);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const apiPost = async (url, data, config = {}) => {
  try {
    const response = await api.post(url, data, config);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const apiPut = async (url, data, config = {}) => {
  try {
    const response = await api.put(url, data, config);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const apiPatch = async (url, data, config = {}) => {
  try {
    const response = await api.patch(url, data, config);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const apiDelete = async (url, config = {}) => {
  try {
    const response = await api.delete(url, config);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Função para verificar saúde da API
export const checkAPIHealth = async () => {
  try {
    const healthUrl = environmentConfig.API_BASE_URL.replace('/api', '') + '/health';
    const response = await axios.get(healthUrl, {
      timeout: 10000
    });
    
    if (environmentConfig.DEBUG_MODE) {
      console.log('💚 API Health Check:', response.data);
    }
    
    return response.data;
  } catch (error) {
    if (environmentConfig.DEBUG_MODE) {
      console.error('💔 API Health Check Failed:', error.message);
    }
    throw error;
  }
};

// Função para testar conectividade
export const testConnection = async () => {
  try {
    await checkAPIHealth();
    return {
      success: true,
      message: 'Conexão com API estabelecida',
      environment: environmentConfig.ENVIRONMENT,
      baseURL: environmentConfig.API_BASE_URL
    };
  } catch (error) {
    return {
      success: false,
      message: `Erro de conexão: ${error.message}`,
      environment: environmentConfig.ENVIRONMENT,
      baseURL: environmentConfig.API_BASE_URL
    };
  }
};

// Função para obter estatísticas da API
export const getApiStats = () => {
  return {
    environment: environmentConfig.ENVIRONMENT,
    baseURL: environmentConfig.API_BASE_URL,
    timeout: environmentConfig.API_TIMEOUT,
    debugMode: environmentConfig.DEBUG_MODE,
    showLogs: environmentConfig.SHOW_LOGS,
    hasToken: !!localStorage.getItem('token'),
    user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null
  };
};

// Inicializar quando o módulo for carregado
initializeApi();

export default api;