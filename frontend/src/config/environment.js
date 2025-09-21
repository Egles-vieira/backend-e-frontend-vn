// src/config/environment.js
const config = {
  // Ambiente
  NODE_ENV: import.meta.env.VITE_NODE_ENV || 'development',
  APP_ENV: import.meta.env.VITE_APP_ENV || 'development',
  
  // API
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api',
  API_TIMEOUT: parseInt(import.meta.env.VITE_API_TIMEOUT) || 30000,
  
  // App
  APP_NAME: import.meta.env.VITE_APP_NAME || 'Road RW',
  APP_VERSION: import.meta.env.VITE_APP_VERSION || '1.0.0',
  
  // Debug
  DEBUG_MODE: import.meta.env.VITE_DEBUG_MODE === 'true',
  SHOW_LOGS: import.meta.env.VITE_SHOW_LOGS === 'true',
  MOCK_DATA: import.meta.env.VITE_MOCK_DATA === 'true',
  
  // Features
  ENABLE_NEW_FEATURES: import.meta.env.VITE_ENABLE_NEW_FEATURES === 'true',
  ENABLE_DEBUG_PANEL: import.meta.env.VITE_ENABLE_DEBUG_PANEL === 'true',
  
  // Computed values
  get isDevelopment() {
    return this.NODE_ENV === 'development';
  },
  
  get isProduction() {
    return this.NODE_ENV === 'production';
  },
  
  get isTest() {
    return this.NODE_ENV === 'test';
  }
};

export default config;