// src/pages/notas-fiscais/NotasFiscaisPage.jsx
import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

function NotasFiscaisPage() {
  const [notasFiscais, setNotasFiscais] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [transportadoras, setTransportadoras] = useState([]);
  const [clientes, setClientes] = useState([]);
  
  // Estados de filtros
  const [filters, setFilters] = useState({
    chave_nf: '',
    numero: '',
    cliente_id: '',
    transportadora_id: '',
    status_nf: '',
    finalizada: '',
    data_inicio: '',
    data_fim: ''
  });

  // Estados de paginação
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0
  });

  // Estados de estatísticas
  const [stats, setStats] = useState({
    total: 0,
    finalizadas: 0,
    pendentes: 0,
    em_transito: 0,
    entregues: 0
  });

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    loadNotasFiscais();
  }, [pagination.page]);

  const loadInitialData = async () => {
    try {
      // Carregar transportadoras e clientes
      const [transportadorasRes, clientesRes] = await Promise.all([
        fetch('http://localhost:3001/api/transportadoras', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        }),
        fetch('http://localhost:3001/api/clientes', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        })
      ]);

      if (transportadorasRes.ok) {
        const transportadorasData = await transportadorasRes.json();
        setTransportadoras(transportadorasData.data || []);
      }

      if (clientesRes.ok) {
        const clientesData = await clientesRes.json();
        setClientes(clientesData.data || []);
      }

      // Carregar estatísticas
      await loadStats();
    } catch (error) {
      console.error('Erro ao carregar dados iniciais:', error);
      toast.error('Erro ao carregar dados iniciais');
    }
  };

  const loadNotasFiscais = async () => {
    try {
      setLoading(true);
      
      // Montar parâmetros da URL
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString()
      });

      // Adicionar filtros se preenchidos
      Object.entries(filters).forEach(([key, value]) => {
        if (value) {
          if (key === 'numero') {
            params.append('nro', value);
          } else {
            params.append(key, value);
          }
        }
      });

      const response = await fetch(`http://localhost:3001/api/notas-fiscais?${params}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        
        if (data.success) {
          setNotasFiscais(data.data || []);
          
          // Atualizar paginação se disponível
          if (data.pagination) {
            setPagination(prev => ({
              ...prev,
              total: data.pagination.total || 0,
              totalPages: data.pagination.totalPages || 1
            }));
          }
        } else {
          toast.error(data.message || 'Erro ao carregar notas fiscais');
        }
      } else if (response.status === 401) {
        toast.error('Sessão expirada. Faça login novamente.');
        // Redirecionar para login se necessário
      } else {
        toast.error('Erro ao carregar notas fiscais');
      }
    } catch (error) {
      console.error('Erro ao carregar notas fiscais:', error);
      toast.error('Erro de conexão com o servidor');
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/notas-fiscais/stats', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setStats(data.data || {});
        }
      }
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
      // Não mostrar erro para estatísticas para não poluir a UX
    }
  };

  const handleFilterChange = (name, value) => {
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSearch = async () => {
    setSearchLoading(true);
    setPagination(prev => ({ ...prev, page: 1 }));
    await loadNotasFiscais();
    setSearchLoading(false);
  };

  const handleClearFilters = () => {
    setFilters({
      chave_nf: '',
      numero: '',
      cliente_id: '',
      transportadora_id: '',
      status_nf: '',
      finalizada: '',
      data_inicio: '',
      data_fim: ''
    });
    setPagination(prev => ({ ...prev, page: 1 }));
    setTimeout(() => loadNotasFiscais(), 100);
  };

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  const formatCurrency = (value) => {
    if (!value) return 'R$ 0,00';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const formatWeight = (weight) => {
    if (!weight) return '-';
    return `${parseFloat(weight).toFixed(2)} kg`;
  };

  const getStatusColor = (status) => {
    const colors = {
      'pendente': 'bg-yellow-100 text-yellow-800',
      'em_transito': 'bg-blue-100 text-blue-800',
      'entregue': 'bg-green-100 text-green-800',
      'devolvida': 'bg-red-100 text-red-800',
      'cancelada': 'bg-gray-100 text-gray-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusText = (status) => {
    const texts = {
      'pendente': 'Pendente',
      'em_transito': 'Em Trânsito',
      'entregue': 'Entregue',
      'devolvida': 'Devolvida',
      'cancelada': 'Cancelada'
    };
    return texts[status] || 'Pendente';
  };

  const getClienteName = (clienteId) => {
    const cliente = clientes.find(c => c.id === clienteId);
    return cliente ? cliente.nome || cliente.razao_social : `Cliente ${clienteId}`;
  };

  const getTransportadoraName = (transportadoraId) => {
    const transportadora = transportadoras.find(t => t.id === transportadoraId);
    return transportadora ? transportadora.nome || transportadora.razao_social : `Transportadora ${transportadoraId}`;
  };

  const handleViewNota = async (nota) => {
    try {
      const response = await fetch(`http://localhost:3001/api/notas-fiscais/${nota.id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          // Aqui você pode abrir um modal ou navegar para uma página de detalhes
          console.log('Detalhes da nota:', data.data);
          toast.success('Detalhes carregados! (verifique o console)');
        }
      }
    } catch (error) {
      console.error('Erro ao carregar detalhes:', error);
      toast.error('Erro ao carregar detalhes da nota fiscal');
    }
  };

  const handleFinalizarNota = async (nota) => {
    if (confirm(`Deseja finalizar a nota fiscal ${nota.nro}?`)) {
      try {
        const dataEntrega = new Date().toISOString().split('T')[0];
        const horaEntrega = new Date().toTimeString().split(' ')[0];

        const response = await fetch(`http://localhost:3001/api/notas-fiscais/${nota.id}/finalizar`, {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            data_entrega: dataEntrega,
            hora_entrega: horaEntrega,
            observacoes: 'Finalizada via sistema'
          })
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            toast.success('Nota fiscal finalizada com sucesso!');
            loadNotasFiscais();
            loadStats();
          } else {
            toast.error(data.message || 'Erro ao finalizar nota fiscal');
          }
        } else {
          toast.error('Erro ao finalizar nota fiscal');
        }
      } catch (error) {
        console.error('Erro ao finalizar:', error);
        toast.error('Erro de conexão');
      }
    }
  };

  if (loading && notasFiscais.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando notas fiscais...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notas Fiscais</h1>
          <p className="mt-1 text-sm text-gray-600">
            Gestão e consulta de notas fiscais ({pagination.total} registros)
          </p>
        </div>
        <button className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">
          <svg className="w-4 h-4 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Nova Nota Fiscal
        </button>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
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
                    Total
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {stats.total || 0}
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
                <svg className="h-6 w-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Finalizadas
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {stats.finalizadas || 0}
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
                <svg className="h-6 w-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Pendentes
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {stats.pendentes || 0}
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
                <svg className="h-6 w-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Em Trânsito
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {stats.em_transito || 0}
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
                <svg className="h-6 w-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Entregues
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {stats.entregues || 0}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Filtros de Pesquisa</h3>
          
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Chave da NF</label>
              <input
                type="text"
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="44 dígitos da chave"
                value={filters.chave_nf}
                onChange={(e) => handleFilterChange('chave_nf', e.target.value)}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Número da NF</label>
              <input
                type="number"
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Número da nota"
                value={filters.numero}
                onChange={(e) => handleFilterChange('numero', e.target.value)}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Cliente</label>
              <select
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={filters.cliente_id}
                onChange={(e) => handleFilterChange('cliente_id', e.target.value)}
              >
                <option value="">Todos os clientes</option>
                {clientes.map(cliente => (
                  <option key={cliente.id} value={cliente.id}>
                    {cliente.nome || cliente.razao_social}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Transportadora</label>
              <select
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={filters.transportadora_id}
                onChange={(e) => handleFilterChange('transportadora_id', e.target.value)}
              >
                <option value="">Todas as transportadoras</option>
                {transportadoras.map(transportadora => (
                  <option key={transportadora.id} value={transportadora.id}>
                    {transportadora.nome || transportadora.razao_social}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={filters.status_nf}
                onChange={(e) => handleFilterChange('status_nf', e.target.value)}
              >
                <option value="">Todos os status</option>
                <option value="pendente">Pendente</option>
                <option value="em_transito">Em Trânsito</option>
                <option value="entregue">Entregue</option>
                <option value="devolvida">Devolvida</option>
                <option value="cancelada">Cancelada</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Finalizada</label>
              <select
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={filters.finalizada}
                onChange={(e) => handleFilterChange('finalizada', e.target.value)}
              >
                <option value="">Todas</option>
                <option value="true">Sim</option>
                <option value="false">Não</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Data Início</label>
              <input
                type="date"
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={filters.data_inicio}
                onChange={(e) => handleFilterChange('data_inicio', e.target.value)}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Data Fim</label>
              <input
                type="date"
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={filters.data_fim}
                onChange={(e) => handleFilterChange('data_fim', e.target.value)}
              />
            </div>
          </div>
          
          <div className="mt-4 flex space-x-3">
            <button 
              onClick={handleSearch}
              disabled={searchLoading}
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 disabled:opacity-50"
            >
              {searchLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Pesquisando...
                </div>
              ) : (
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  Pesquisar
                </div>
              )}
            </button>
            
            <button 
              onClick={handleClearFilters}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300"
            >
              Limpar Filtros
            </button>
          </div>
        </div>
      </div>

      {/* Tabela de Notas Fiscais */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">
              Lista de Notas Fiscais
            </h3>
            <div className="text-sm text-gray-500">
              {notasFiscais.length} de {pagination.total} registros
            </div>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Número
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cliente
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Transportadora
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Valor
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Peso
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Emissão
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {notasFiscais.map((nota) => (
                    <tr key={nota.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="font-medium">
                          {nota.nro || '-'}
                          {nota.ser && <div className="text-xs text-gray-500">Série: {nota.ser}</div>}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="max-w-xs truncate" title={getClienteName(nota.cliente_id)}>
                          {getClienteName(nota.cliente_id)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="max-w-xs truncate" title={getTransportadoraName(nota.transportadora_id)}>
                          {getTransportadoraName(nota.transportadora_id)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                        {formatCurrency(nota.valor)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatWeight(nota.peso_calculo)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDate(nota.emi_nf)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(nota.status_nf)}`}>
                          {getStatusText(nota.status_nf)}
                        </span>
                        {nota.finalizada && (
                          <span className="ml-2 inline-flex px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                            Finalizada
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => handleViewNota(nota)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            Ver
                          </button>
                          <button className="text-indigo-600 hover:text-indigo-800">
                            Editar
                          </button>
                          {!nota.finalizada && (
                            <button 
                              onClick={() => handleFinalizarNota(nota)}
                              className="text-green-600 hover:text-green-800"
                            >
                              Finalizar
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          
          {!loading && notasFiscais.length === 0 && (
            <div className="text-center py-8">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhuma nota fiscal encontrada</h3>
              <p className="mt-1 text-sm text-gray-500">
                Tente ajustar os filtros ou adicionar uma nova nota fiscal.
              </p>
            </div>
          )}

          {/* Paginação */}
          {pagination.totalPages > 1 && (
            <div className="mt-6 flex items-center justify-between border-t border-gray-200 pt-4">
              <div className="text-sm text-gray-700">
                Página {pagination.page} de {pagination.totalPages}
                <span className="ml-2 text-gray-500">
                  ({((pagination.page - 1) * pagination.limit) + 1} - {Math.min(pagination.page * pagination.limit, pagination.total)} de {pagination.total})
                </span>
              </div>
              
              <div className="flex space-x-2">
                <button
                  onClick={() => handlePageChange(1)}
                  disabled={pagination.page <= 1}
                  className="px-3 py-1 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Primeira
                </button>
                
                <button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page <= 1}
                  className="px-3 py-1 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Anterior
                </button>
                
                <button
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page >= pagination.totalPages}
                  className="px-3 py-1 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Próxima
                </button>
                
                <button
                  onClick={() => handlePageChange(pagination.totalPages)}
                  disabled={pagination.page >= pagination.totalPages}
                  className="px-3 py-1 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Última
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default NotasFiscaisPage;