
// src/hooks/useNotasFiscais.js
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import notasFiscaisService from '../services/notas-fiscais.service';

export function useNotasFiscais(initialFilters = {}) {
  const [notasFiscais, setNotasFiscais] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [stats, setStats] = useState({});
  const [filters, setFilters] = useState(initialFilters);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0
  });

  const loadNotasFiscais = useCallback(async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true);
      
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        ...Object.fromEntries(
          Object.entries(filters).filter(([_, value]) => value !== '')
        )
      };

      const response = await notasFiscaisService.getAll(params);
      
      if (response.success) {
        setNotasFiscais(response.data || []);
        
        if (response.pagination) {
          setPagination(prev => ({
            ...prev,
            total: response.pagination.total,
            totalPages: response.pagination.totalPages
          }));
        }
      }
    } catch (error) {
      console.error('Erro ao carregar notas fiscais:', error);
      toast.error('Erro ao carregar notas fiscais');
    } finally {
      if (showLoading) setLoading(false);
    }
  }, [filters, pagination.page, pagination.limit]);

  const loadStats = useCallback(async () => {
    try {
      const response = await notasFiscaisService.getStats();
      if (response.success) {
        setStats(response.data || {});
      }
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    }
  }, []);

  const handleSearch = async () => {
    setSearchLoading(true);
    setPagination(prev => ({ ...prev, page: 1 }));
    await loadNotasFiscais(false);
    setSearchLoading(false);
  };

  const handleFilterChange = (name, value) => {
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleClearFilters = () => {
    setFilters(initialFilters);
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  const refreshData = () => {
    loadNotasFiscais();
    loadStats();
  };

  useEffect(() => {
    loadNotasFiscais();
  }, [loadNotasFiscais]);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  return {
    // Data
    notasFiscais,
    stats,
    filters,
    pagination,
    
    // Loading states
    loading,
    searchLoading,
    
    // Actions
    handleSearch,
    handleFilterChange,
    handleClearFilters,
    handlePageChange,
    refreshData,
    
    // Services
    notasFiscaisService
  };
}