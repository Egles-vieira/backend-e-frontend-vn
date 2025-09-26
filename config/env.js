// config/env.js
export const environments = {
  development: {
    name: 'Desenvolvimento',
    baseURL: 'http://localhost:3001',
    apiPrefix: '/api',
    color: '#aacb55'
  },
  production: {
    name: 'Produção',
    baseURL: 'https://api.roadrw.com',
    apiPrefix: '/api',
    color: '#045c53'
  },
  staging: {
    name: 'Homologação',
    baseURL: 'https://staging-api.roadrw.com',
    apiPrefix: '/api',
    color: '#7ab467'
  }
};

export const defaultEnvironment = 'development';

export const getStoredEnvironment = () => {
  try {
    const stored = localStorage.getItem('app.env.selected');
    return stored && environments[stored] ? stored : defaultEnvironment;
  } catch {
    return defaultEnvironment;
  }
};

export const setStoredEnvironment = (envKey) => {
  try {
    localStorage.setItem('app.env.selected', envKey);
    localStorage.setItem('app.env.baseUrl', environments[envKey].baseURL);
  } catch (error) {
    console.warn('Erro ao salvar ambiente:', error);
  }
};