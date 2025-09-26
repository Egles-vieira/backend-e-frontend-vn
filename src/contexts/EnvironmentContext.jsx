// src/contexts/EnvironmentContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { environments, getStoredEnvironment, setStoredEnvironment } from '../config/env';
import { updateEnvironment } from '../config/api';
import toast from 'react-hot-toast';

const EnvironmentContext = createContext();

export const useEnvironment = () => {
  const context = useContext(EnvironmentContext);
  if (!context) {
    throw new Error('useEnvironment deve ser usado dentro de EnvironmentProvider');
  }
  return context;
};

export const EnvironmentProvider = ({ children }) => {
  const [currentEnvironment, setCurrentEnvironment] = useState(getStoredEnvironment());

  const environmentConfig = environments[currentEnvironment];

  const changeEnvironment = (envKey) => {
    if (!environments[envKey]) {
      toast.error('Ambiente inválido');
      return;
    }

    try {
      // Atualizar estado local
      setCurrentEnvironment(envKey);
      
      // Persistir no localStorage
      setStoredEnvironment(envKey);
      
      // Atualizar configuração da API
      updateEnvironment(envKey);
      
      toast.success(`Ambiente alterado para: ${environments[envKey].name}`);
    } catch (error) {
      toast.error('Erro ao alterar ambiente');
      console.error('Erro ao alterar ambiente:', error);
    }
  };

  const value = {
    currentEnvironment,
    environmentConfig,
    environments,
    changeEnvironment
  };

  return (
    <EnvironmentContext.Provider value={value}>
      {children}
    </EnvironmentContext.Provider>
  );
};