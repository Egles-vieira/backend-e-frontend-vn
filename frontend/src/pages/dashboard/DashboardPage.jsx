// src/pages/dashboard/DashboardPage.jsx
import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { checkAPIHealth } from '../../services/api';
import EnvironmentStatusIndicator from '../../components/common/EnvironmentStatusIndicator';

function DashboardPage() {
  const [stats, setStats] = useState({
    totalTransportadoras: 0,
    totalClientes: 0,
    totalNotasFiscais: 0,
    totalRomaneios: 0
  });
  const [apiStatus, setApiStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Verificar status da API
      const healthCheck = await checkAPIHealth();
      setApiStatus(healthCheck);

      // Aqui você pode carregar estatísticas reais das suas APIs
      // Exemplo:
      // const transportadorasResponse = await transportadorasService.getAll();
      // const clientesResponse = await clientesService.getAll();
      // etc...

      // Por enquanto, dados simulados
      setStats({
        totalTransportadoras: 25,
        totalClientes: 150,
        totalNotasFiscais: 1250,
        totalRomaneios: 89
      });

    } catch (error) {
      console.error('Erro ao carregar dados do dashboard:', error);
      toast.error('Erro ao carregar dados do dashboard');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('pt-BR');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'OK':
        return 'text-green-600 bg-green-100';
      case 'ERROR':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-yellow-600 bg-yellow-100';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-600">
          Visão geral do sistema de gestão logística
        </p>
      </div>

      {/* Status da API */}
      {apiStatus && (
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Status da API
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Última verificação: {formatDate(apiStatus.timestamp)}
                </p>
              </div>
              <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(apiStatus.status)}`}>
                <span className="w-2 h-2 bg-current rounded-full mr-2"></span>
                {apiStatus.status}
              </div>
            </div>
            
            <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Versão:</span>
                <span className="ml-2 font-medium">{apiStatus.version}</span>
              </div>
              <div>
                <span className="text-gray-500">Ambiente:</span>
                <span className="ml-2 font-medium">{apiStatus.environment}</span>
              </div>
              <div>
                <span className="text-gray-500">Uptime:</span>
                <span className="ml-2 font-medium">{Math.floor(apiStatus.uptime / 60)} minutos</span>
              </div>
              <div>
                <span className="text-gray-500">Database:</span>
                <span className={`ml-2 font-medium ${apiStatus.database?.status === 'connected' ? 'text-green-600' : 'text-red-600'}`}>
                  {apiStatus.database?.status || 'N/A'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Transportadoras
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {stats.totalTransportadoras}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Clientes
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {stats.totalClientes}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Notas Fiscais
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {stats.totalNotasFiscais}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Romaneios
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {stats.totalRomaneios}
                  </dd>
                </dl>
              </div>
            </div>
            
          </div>
        </div>
        
      </div>
<div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
  <div className="lg:col-span-3">
    {/* Conteúdo existente do dashboard */}
  </div>
  
  <div className="lg:col-span-1">
    <EnvironmentStatusIndicator 
      showDetails={true}
      autoRefresh={true}
    />
  </div>
</div>
      {/* Ações Rápidas */}
      <div className="bg-white overflow-hidden shadow rounded-lg">
       
       
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            Ações Rápidas
          </h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Nova Nota Fiscal
            </button>
            
            <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-green-700 bg-green-100 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
              <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Novo Romaneio
            </button>
            
            <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Rastrear Envio
            </button>
            
            <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-purple-700 bg-purple-100 hover:bg-purple-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500">
              <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Relatórios
            </button>
          </div>
        </div>
      </div>

      {/* Atividades Recentes */}
      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            Atividades Recentes
          </h3>
          <div className="flow-root">
            <ul className="-mb-8">
              <li>
                <div className="relative pb-8">
                  <div className="relative flex items-start space-x-3">
                    <div className="relative">
                      <div className="h-8 w-8 bg-blue-500 rounded-full flex items-center justify-center ring-8 ring-white">
                        <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                      </div>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div>
                        <div className="text-sm">
                          <span className="font-medium text-gray-900">Nova nota fiscal criada</span>
                        </div>
                        <p className="mt-0.5 text-sm text-gray-500">NF 123456 - Cliente ABC Ltda</p>
                        <p className="mt-0.5 text-sm text-gray-500">há 2 horas</p>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
              
              <li>
                <div className="relative pb-8">
                  <div className="relative flex items-start space-x-3">
                    <div className="relative">
                      <div className="h-8 w-8 bg-green-500 rounded-full flex items-center justify-center ring-8 ring-white">
                        <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div>
                        <div className="text-sm">
                          <span className="font-medium text-gray-900">Romaneio finalizado</span>
                        </div>
                        <p className="mt-0.5 text-sm text-gray-500">ROM-2024-001 entregue com sucesso</p>
                        <p className="mt-0.5 text-sm text-gray-500">há 4 horas</p>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
              
              <li>
                <div className="relative">
                  <div className="relative flex items-start space-x-3">
                    <div className="relative">
                      <div className="h-8 w-8 bg-yellow-500 rounded-full flex items-center justify-center ring-8 ring-white">
                        <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                      </div>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div>
                        <div className="text-sm">
                          <span className="font-medium text-gray-900">Ocorrência registrada</span>
                        </div>
                        <p className="mt-0.5 text-sm text-gray-500">NF 123457 - Atraso na entrega</p>
                        <p className="mt-0.5 text-sm text-gray-500">há 6 horas</p>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;