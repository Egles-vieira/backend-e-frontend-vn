// src/components/notas-fiscais/FiltrosAvancados.jsx
import { useState } from 'react';
import Button from '../common/Button';
import Input from '../common/Input';

function FiltrosAvancados({ 
  filters, 
  onFiltersChange, 
  onSearch, 
  onClear, 
  clientes = [], 
  transportadoras = [],
  loading = false 
}) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleFilterChange = (name, value) => {
    onFiltersChange(name, value);
  };

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">Filtros de Pesquisa</h3>
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
          >
            {showAdvanced ? 'Ocultar filtros avançados' : 'Mostrar filtros avançados'}
          </button>
        </div>
        
        {/* Filtros básicos */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-4">
          <Input
            label="Chave da NF"
            placeholder="44 dígitos da chave"
            value={filters.chave_nf || ''}
            onChange={(e) => handleFilterChange('chave_nf', e.target.value)}
          />
          
          <Input
            label="Número da NF"
            type="number"
            placeholder="Número da nota"
            value={filters.numero || ''}
            onChange={(e) => handleFilterChange('numero', e.target.value)}
          />
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              value={filters.status_nf || ''}
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
        </div>
        
        {/* Filtros avançados */}
        {showAdvanced && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-4 pt-4 border-t border-gray-200">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Cliente</label>
              <select
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={filters.cliente_id || ''}
                onChange={(e) => handleFilterChange('cliente_id', e.target.value)}
              >
                <option value="">Todos os clientes</option>
                {clientes.map(cliente => (
                  <option key={cliente.id} value={cliente.id}>
                    {cliente.nome}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Transportadora</label>
              <select
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={filters.transportadora_id || ''}
                onChange={(e) => handleFilterChange('transportadora_id', e.target.value)}
              >
                <option value="">Todas as transportadoras</option>
                {transportadoras.map(transportadora => (
                  <option key={transportadora.id} value={transportadora.id}>
                    {transportadora.nome}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Finalizada</label>
              <select
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={filters.finalizada || ''}
                onChange={(e) => handleFilterChange('finalizada', e.target.value)}
              >
                <option value="">Todas</option>
                <option value="true">Sim</option>
                <option value="false">Não</option>
              </select>
            </div>
            
            <Input
              label="Série"
              type="number"
              placeholder="Série da NF"
              value={filters.serie || ''}
              onChange={(e) => handleFilterChange('serie', e.target.value)}
            />
            
            <Input
              label="Data Início (Emissão)"
              type="date"
              value={filters.data_inicio || ''}
              onChange={(e) => handleFilterChange('data_inicio', e.target.value)}
            />
            
            <Input
              label="Data Fim (Emissão)"
              type="date"
              value={filters.data_fim || ''}
              onChange={(e) => handleFilterChange('data_fim', e.target.value)}
            />
            
            <Input
              label="Valor Mínimo"
              type="number"
              step="0.01"
              placeholder="0.00"
              value={filters.valor_min || ''}
              onChange={(e) => handleFilterChange('valor_min', e.target.value)}
            />
            
            <Input
              label="Valor Máximo"
              type="number"
              step="0.01"
              placeholder="0.00"
              value={filters.valor_max || ''}
              onChange={(e) => handleFilterChange('valor_max', e.target.value)}
            />
          </div>
        )}
        
        <div className="flex space-x-3">
          <Button 
            variant="primary" 
            onClick={onSearch}
            loading={loading}
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            Pesquisar
          </Button>
          
          <Button 
            variant="secondary" 
            onClick={onClear}
          >
            Limpar Filtros
          </Button>
          
          <Button 
            variant="outline"
            onClick={() => {/* Implementar exportação */}}
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Exportar
          </Button>
        </div>
      </div>
    </div>
  );
}

export default FiltrosAvancados;
