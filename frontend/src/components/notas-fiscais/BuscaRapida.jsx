// src/components/notas-fiscais/BuscaRapida.jsx
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import notasFiscaisService from '../../services/notas-fiscais.service';
import Button from '../common/Button';
import Input from '../common/Input';

function BuscaRapida({ onResultFound }) {
  const [searchType, setSearchType] = useState('chave');
  const [searchValue, setSearchValue] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!searchValue.trim()) {
      toast.error('Digite um valor para buscar');
      return;
    }

    try {
      setLoading(true);
      let response;

      switch (searchType) {
        case 'chave':
          if (!notasFiscaisService.validateChaveNf(searchValue)) {
            toast.error('Chave da NF deve ter 44 dígitos');
            return;
          }
          response = await notasFiscaisService.getByChaveNf(searchValue);
          break;
          
        case 'numero':
          const numero = parseInt(searchValue);
          if (!numero) {
            toast.error('Digite um número válido');
            return;
          }
          response = await notasFiscaisService.getAll({ numero });
          break;
          
        case 'chave_cte':
          response = await notasFiscaisService.getByChaveCte(searchValue);
          break;
          
        default:
          toast.error('Tipo de busca inválido');
          return;
      }

      if (response.success) {
        const data = Array.isArray(response.data) ? response.data : [response.data];
        if (data.length > 0) {
          onResultFound(data);
          toast.success(`${data.length} nota(s) fiscal(is) encontrada(s)`);
        } else {
          toast.error('Nenhuma nota fiscal encontrada');
        }
      } else {
        toast.error(response.message || 'Erro na busca');
      }
    } catch (error) {
      console.error('Erro na busca:', error);
      toast.error(error.response?.data?.message || 'Erro ao buscar nota fiscal');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-4">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Busca Rápida</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tipo de Busca
          </label>
          <select
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            value={searchType}
            onChange={(e) => setSearchType(e.target.value)}
          >
            <option value="chave">Chave da NF</option>
            <option value="numero">Número da NF</option>
            <option value="chave_cte">Chave do CTE</option>
          </select>
        </div>
        
        <Input
          label={
            searchType === 'chave' ? 'Chave da NF (44 dígitos)' :
            searchType === 'numero' ? 'Número da NF' :
            'Chave do CTE (44 dígitos)'
          }
          placeholder={
            searchType === 'chave' ? 'Ex: 35200114200166000187550010000000015180044003' :
            searchType === 'numero' ? 'Ex: 123456' :
            'Ex: 35200114200166000187550010000000015180044003'
          }
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        
        <Button
          variant="primary"
          onClick={handleSearch}
          loading={loading}
          className="w-full"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          Buscar
        </Button>
      </div>
    </div>
  );
}

export default BuscaRapida;