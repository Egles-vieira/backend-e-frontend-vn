// src/components/common/EnvironmentStatusIndicator.jsx
import { useState, useEffect } from 'react';
import { getEnvironmentConfig, getApiStats, testConnection } from '../../services/api';

function EnvironmentStatusIndicator({ 
  showDetails = false, 
  autoRefresh = false, 
  className = '' 
}) {
  const [config, setConfig] = useState({});
  const [apiStats, setApiStats] = useState({});
  const [connectionStatus, setConnectionStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadData();
    
    if (autoRefresh) {
      const interval = setInterval(loadData, 30000); // Atualizar a cada 30s
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  const loadData = async () => {
    setConfig(getEnvironmentConfig());
    setApiStats(getApiStats());
    
    if (autoRefresh) {
      await checkConnection();
    }
  };

  const checkConnection = async () => {
    setIsLoading(true);
    try {
      const result = await testConnection();
      setConnectionStatus(result);
    } catch (error) {
      setConnectionStatus({ success: false, message: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  const getEnvironmentBadgeColor = () => {
    switch (config.ENVIRONMENT) {
      case 'development':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'staging':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'production':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getConnectionStatusColor = () => {
    if (connectionStatus === null) return 'text-gray-500';
    return connectionStatus.success ? 'text-green-500' : 'text-red-500';
  };

  const getConnectionIcon = () => {
    if (isLoading) return '⏳';
    if (connectionStatus === null) return '⚪';
    return connectionStatus.success ? '🟢' : '🔴';
  };

  if (!showDetails) {
    // Versão compacta
    return (
      <div className={`inline-flex items-center space-x-2 ${className}`}>
        <span 
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getEnvironmentBadgeColor()}`}
          title={`Ambiente: ${config.ENVIRONMENT}`}
        >
          {config.ENVIRONMENT === 'development' && '🔧'}
          {config.ENVIRONMENT === 'staging' && '🧪'}
          {config.ENVIRONMENT === 'production' && '🚀'}
          <span className="ml-1 capitalize">{config.ENVIRONMENT}</span>
        </span>
        
        {autoRefresh && (
          <span 
            className={`text-sm ${getConnectionStatusColor()}`}
            title={connectionStatus?.message || 'Status da conexão'}
          >
            {getConnectionIcon()}
          </span>
        )}
      </div>
    );
  }

  // Versão detalhada
  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-4 ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-medium text-gray-900">Status do Ambiente</h4>
        {autoRefresh && (
          <button
            onClick={checkConnection}
            disabled={isLoading}
            className="text-xs text-gray-500 hover:text-gray-700 disabled:opacity-50"
          >
            {isLoading ? '⏳ Testando...' : '🔄 Atualizar'}
          </button>
        )}
      </div>

      <div className="space-y-3">
        {/* Ambiente */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">Ambiente:</span>
          <span 
            className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium border ${getEnvironmentBadgeColor()}`}
          >
            {config.ENVIRONMENT === 'development' && '🔧'}
            {config.ENVIRONMENT === 'staging' && '🧪'}
            {config.ENVIRONMENT === 'production' && '🚀'}
            <span className="ml-1 capitalize">{config.ENVIRONMENT}</span>
          </span>
        </div>

        {/* API URL */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">API:</span>
          <span className="text-xs font-mono bg-gray-100 px-2 py-1 rounded max-w-48 truncate" title={config.API_BASE_URL}>
            {config.API_BASE_URL}
          </span>
        </div>

        {/* Status da Conexão */}
        {connectionStatus && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Conexão:</span>
            <div className="flex items-center">
              <span className="text-lg mr-1">{getConnectionIcon()}</span>
              <span className={`text-xs ${getConnectionStatusColor()}`}>
                {connectionStatus.success ? 'Conectado' : 'Falha'}
              </span>
            </div>
          </div>
        )}

        {/* Configurações de Debug */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">Debug:</span>
          <div className="flex items-center space-x-2">
            <span className="text-xs">
              {config.DEBUG_MODE ? '🟢 Ativo' : '🔴 Inativo'}
            </span>
            {config.DEBUG_MODE && config.SHOW_LOGS && (
              <span className="text-xs text-gray-500">📝 Logs</span>
            )}
          </div>
        </div>

        {/* Token Status */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">Autenticação:</span>
          <span className="text-xs">
            {apiStats.hasToken ? '🟢 Logado' : '🔴 Sem login'}
          </span>
        </div>

        {/* Usuário */}
        {apiStats.user && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Usuário:</span>
            <span className="text-xs font-medium truncate max-w-32" title={apiStats.user.nome || apiStats.user.email}>
              {apiStats.user.nome || apiStats.user.email}
            </span>
          </div>
        )}

        {/* Timeout */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">Timeout:</span>
          <span className="text-xs">{config.API_TIMEOUT}ms</span>
        </div>

        {/* Informações Adicionais */}
        <div className="border-t border-gray-100 pt-3 mt-3">
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Logs:</span>
              <span>{config.SHOW_LOGS ? '📝' : '🚫'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Cache:</span>
              <span>💾</span>
            </div>
          </div>
        </div>
      </div>

      {/* Mensagem de erro da conexão */}
      {connectionStatus && !connectionStatus.success && (
        <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded text-xs text-red-700">
          <div className="flex items-center">
            <svg className="h-4 w-4 mr-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <span>{connectionStatus.message}</span>
          </div>
        </div>
      )}

      {/* Mensagem de sucesso da conexão */}
      {connectionStatus && connectionStatus.success && (
        <div className="mt-3 p-2 bg-green-50 border border-green-200 rounded text-xs text-green-700">
          <div className="flex items-center">
            <svg className="h-4 w-4 mr-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{connectionStatus.message}</span>
          </div>
        </div>
      )}

      {/* Última atualização */}
      {autoRefresh && (
        <div className="mt-3 pt-2 border-t border-gray-100 text-center">
          <span className="text-xs text-gray-400">
            Última atualização: {new Date().toLocaleTimeString('pt-BR')}
          </span>
        </div>
      )}
    </div>
  );
}

export default EnvironmentStatusIndicator;