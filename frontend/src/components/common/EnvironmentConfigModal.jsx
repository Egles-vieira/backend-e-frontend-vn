// src/components/common/EnvironmentConfigModal.jsx - Versão com z-index forçado
import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import Button from './Button';
import Input from './Input';
import { 
  getEnvironmentConfig, 
  updateEnvironmentConfig, 
  resetEnvironmentConfig,
  testConnection,
  getApiStats
} from '../../services/api';

function EnvironmentConfigModal({ isOpen, onClose }) {
  const [config, setConfig] = useState({});
  const [testing, setTesting] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState(null);
  const [apiStats, setApiStats] = useState({});
  const [activeTab, setActiveTab] = useState('config');

  useEffect(() => {
    if (isOpen) {
      loadCurrentConfig();
      loadApiStats();
      // Bloquear scroll do body
      document.body.style.overflow = 'hidden';
    } else {
      // Restaurar scroll do body
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const loadCurrentConfig = () => {
    const currentConfig = getEnvironmentConfig();
    setConfig(currentConfig);
  };

  const loadApiStats = () => {
    const stats = getApiStats();
    setApiStats(stats);
  };

  const handleConfigChange = (field, value) => {
    setConfig(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    try {
      if (!config.API_BASE_URL) {
        toast.error('URL da API é obrigatória');
        return;
      }

      if (!config.API_BASE_URL.startsWith('http')) {
        toast.error('URL da API deve começar com http:// ou https://');
        return;
      }

      if (config.API_TIMEOUT < 1000) {
        toast.error('Timeout deve ser pelo menos 1000ms');
        return;
      }

      updateEnvironmentConfig(config);
      loadApiStats();
      
      toast.success('Configuração aplicada com sucesso!');
      
      setTimeout(() => {
        window.location.reload();
      }, 1000);
      
    } catch (error) {
      console.error('Erro ao salvar configuração:', error);
      toast.error('Erro ao aplicar configuração');
    }
  };

  const handleReset = () => {
    if (confirm('Tem certeza que deseja resetar para a configuração padrão?')) {
      resetEnvironmentConfig();
      loadCurrentConfig();
      loadApiStats();
      toast.success('Configuração resetada');
    }
  };

  const handleTestConnection = async () => {
    setTesting(true);
    try {
      const result = await testConnection();
      setConnectionStatus(result);
      
      if (result.success) {
        toast.success('Conexão testada com sucesso!');
      } else {
        toast.error('Falha na conexão');
      }
    } catch (error) {
      setConnectionStatus({
        success: false,
        message: error.message
      });
      toast.error('Erro ao testar conexão');
    } finally {
      setTesting(false);
    }
  };

  const presetConfigs = {
    development: {
      ENVIRONMENT: 'development',
      API_BASE_URL: 'http://localhost:3001/api',
      API_TIMEOUT: 30000,
      DEBUG_MODE: true,
      SHOW_LOGS: true
    },
    production: {
      ENVIRONMENT: 'production',
      API_BASE_URL: 'https://api.roadrw.com/api',
      API_TIMEOUT: 15000,
      DEBUG_MODE: false,
      SHOW_LOGS: false
    },
    staging: {
      ENVIRONMENT: 'staging',
      API_BASE_URL: 'https://staging-api.roadrw.com/api',
      API_TIMEOUT: 20000,
      DEBUG_MODE: true,
      SHOW_LOGS: true
    }
  };

  const applyPreset = (presetName) => {
    const preset = presetConfigs[presetName];
    setConfig(prev => ({ ...prev, ...preset }));
    toast.success(`Configuração ${presetName} carregada`);
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
      style={{ zIndex: 99999 }}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div 
        className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">⚙️ Configuração de Ambiente</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Tabs */}
          <div className="border-b border-gray-200 mb-6">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('config')}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'config'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                🔧 Configuração
              </button>
              <button
                onClick={() => setActiveTab('status')}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'status'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                📊 Status
              </button>
              <button
                onClick={() => setActiveTab('presets')}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'presets'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                🎯 Presets
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="space-y-6">
            {/* Tab: Configuração */}
            {activeTab === 'config' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ambiente
                    </label>
                    <select
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      value={config.ENVIRONMENT || ''}
                      onChange={(e) => handleConfigChange('ENVIRONMENT', e.target.value)}
                    >
                      <option value="development">🔧 Development</option>
                      <option value="staging">🧪 Staging</option>
                      <option value="production">🚀 Production</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Timeout da API (ms)
                    </label>
                    <input
                      type="number"
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      value={config.API_TIMEOUT || ''}
                      onChange={(e) => handleConfigChange('API_TIMEOUT', parseInt(e.target.value))}
                      placeholder="30000"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    URL Base da API
                  </label>
                  <input
                    type="text"
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    value={config.API_BASE_URL || ''}
                    onChange={(e) => handleConfigChange('API_BASE_URL', e.target.value)}
                    placeholder="http://localhost:3001/api"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="debugMode"
                      checked={config.DEBUG_MODE || false}
                      onChange={(e) => handleConfigChange('DEBUG_MODE', e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="debugMode" className="ml-2 block text-sm text-gray-900">
                      🐛 Modo Debug
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="showLogs"
                      checked={config.SHOW_LOGS || false}
                      onChange={(e) => handleConfigChange('SHOW_LOGS', e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="showLogs" className="ml-2 block text-sm text-gray-900">
                      📝 Mostrar Logs
                    </label>
                  </div>
                </div>

                {/* Teste de Conexão */}
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-medium text-gray-900">🔌 Teste de Conexão</h4>
                    <button
                      onClick={handleTestConnection}
                      disabled={testing}
                      className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded border border-gray-300 disabled:opacity-50"
                    >
                      {testing ? 'Testando...' : 'Testar Agora'}
                    </button>
                  </div>

                  {connectionStatus && (
                    <div className={`p-3 rounded-md ${connectionStatus.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                      <div className="flex items-center">
                        <span className="text-lg mr-2">
                          {connectionStatus.success ? '🟢' : '🔴'}
                        </span>
                        <div>
                          <p className={`text-sm font-medium ${connectionStatus.success ? 'text-green-600' : 'text-red-600'}`}>
                            {connectionStatus.message}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {connectionStatus.baseURL}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Tab: Status */}
            {activeTab === 'status' && (
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-3">📊 Status Atual da API</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Ambiente:</span>
                      <span className="ml-2 font-medium">{apiStats.environment}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Debug Mode:</span>
                      <span className="ml-2">{apiStats.debugMode ? '🟢 Ativo' : '🔴 Inativo'}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Timeout:</span>
                      <span className="ml-2 font-medium">{apiStats.timeout}ms</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Token:</span>
                      <span className="ml-2">{apiStats.hasToken ? '🟢 Presente' : '🔴 Ausente'}</span>
                    </div>
                  </div>
                  
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <span className="text-gray-500">URL Base:</span>
                    <p className="font-mono text-xs bg-gray-100 p-2 rounded mt-1 break-all">
                      {apiStats.baseURL}
                    </p>
                  </div>

                  {apiStats.user && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <span className="text-gray-500">Usuário Logado:</span>
                      <p className="text-sm font-medium mt-1">
                        {apiStats.user.nome || apiStats.user.email}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Tab: Presets */}
            {activeTab === 'presets' && (
              <div className="space-y-4">
                <p className="text-sm text-gray-600">
                  Configurações pré-definidas para diferentes ambientes:
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {Object.entries(presetConfigs).map(([name, preset]) => (
                    <div key={name} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-sm font-medium text-gray-900 capitalize">
                          {name === 'development' && '🔧 '}
                          {name === 'staging' && '🧪 '}
                          {name === 'production' && '🚀 '}
                          {name}
                        </h4>
                        <button
                          onClick={() => applyPreset(name)}
                          className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 rounded border border-gray-300"
                        >
                          Usar
                        </button>
                      </div>
                      
                      <div className="space-y-2 text-xs text-gray-600">
                        <div>
                          <span>URL:</span>
                          <p className="font-mono bg-gray-100 p-1 rounded mt-1 break-all">
                            {preset.API_BASE_URL}
                          </p>
                        </div>
                        <div className="flex justify-between">
                          <span>Timeout:</span>
                          <span>{preset.API_TIMEOUT}ms</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Debug:</span>
                          <span>{preset.DEBUG_MODE ? '🟢' : '🔴'}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm bg-gray-200 hover:bg-gray-300 text-gray-700 rounded border border-gray-300"
            >
              Cancelar
            </button>
            <button
              onClick={handleReset}
              className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded border border-gray-300"
            >
              🔄 Resetar
            </button>
          </div>
          
          <button
            onClick={handleSave}
            className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded"
          >
            💾 Salvar e Aplicar
          </button>
        </div>

        {/* Aviso */}
        <div className="p-4 bg-yellow-50 border-t border-yellow-200">
          <div className="flex">
            <svg className="h-5 w-5 text-yellow-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <p className="text-sm text-yellow-700">
              <strong>Aviso:</strong> Alterar a configuração pode recarregar a página para aplicar as mudanças globalmente.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EnvironmentConfigModal;