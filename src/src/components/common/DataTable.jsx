// src/components/common/DataTable.jsx
import React, { useState } from 'react';
import { 
  ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight,
  ArrowUpDown, ArrowUp, ArrowDown, Search, Filter,
  Edit, Trash2, Eye, MoreHorizontal
} from 'lucide-react';
import LoadingSpinner from './LoadingSpinner';

const DataTable = ({
  data = [],
  columns = [],
  loading = false,
  pagination = null,
  onPageChange = () => {},
  onSort = () => {},
  onEdit = () => {},
  onDelete = () => {},
  onView = () => {},
  sortBy = null,
  sortDirection = 'desc',
  searchable = true,
  searchValue = '',
  onSearchChange = () => {},
  actions = true,
  selectable = false,
  selectedItems = [],
  onSelectionChange = () => {},
  emptyMessage = 'Nenhum registro encontrado'
}) => {
  const [actionMenuOpen, setActionMenuOpen] = useState(null);

  const handleSort = (column) => {
    if (!column.sortable) return;
    
    let newDirection = 'asc';
    if (sortBy === column.key && sortDirection === 'asc') {
      newDirection = 'desc';
    }
    
    onSort(column.key, newDirection);
  };

  const getSortIcon = (column) => {
    if (!column.sortable) return null;
    
    if (sortBy === column.key) {
      return sortDirection === 'asc' ? 
        <ArrowUp className="h-4 w-4" /> : 
        <ArrowDown className="h-4 w-4" />;
    }
    
    return <ArrowUpDown className="h-4 w-4 opacity-50" />;
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      onSelectionChange(data.map(item => item.id));
    } else {
      onSelectionChange([]);
    }
  };

  const handleSelectItem = (id, checked) => {
    if (checked) {
      onSelectionChange([...selectedItems, id]);
    } else {
      onSelectionChange(selectedItems.filter(item => item !== id));
    }
  };

  const renderCellValue = (item, column) => {
    const value = item[column.key];
    
    if (column.render) {
      return column.render(value, item);
    }
    
    if (value === null || value === undefined) {
      return <span className="text-gray-400">-</span>;
    }
    
    if (typeof value === 'boolean') {
      return (
        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
          value 
            ? 'bg-green-100 text-green-800' 
            : 'bg-gray-100 text-gray-800'
        }`}>
          {value ? 'Sim' : 'Não'}
        </span>
      );
    }
    
    if (column.type === 'currency') {
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      }).format(value);
    }
    
    if (column.type === 'date') {
      return new Date(value).toLocaleDateString('pt-BR');
    }
    
    if (column.type === 'datetime') {
      return new Date(value).toLocaleString('pt-BR');
    }
    
    return String(value);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Header com busca */}
      {searchable && (
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar..."
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#045c53] focus:border-transparent"
            />
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              {selectable && (
                <th className="w-12 px-4 py-3">
                  <input
                    type="checkbox"
                    checked={selectedItems.length === data.length && data.length > 0}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="rounded border-gray-300 text-[#045c53] focus:ring-[#045c53]"
                  />
                </th>
              )}
              
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                    column.sortable ? 'cursor-pointer hover:bg-gray-100' : ''
                  }`}
                  onClick={() => handleSort(column)}
                >
                  <div className="flex items-center space-x-1">
                    <span>{column.label}</span>
                    {getSortIcon(column)}
                  </div>
                </th>
              ))}
              
              {actions && (
                <th className="w-20 px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              )}
            </tr>
          </thead>
          
          <tbody className="bg-white divide-y divide-gray-200">
            {data.length === 0 ? (
              <tr>
                <td 
                  colSpan={columns.length + (selectable ? 1 : 0) + (actions ? 1 : 0)}
                  className="px-4 py-8 text-center text-gray-500"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((item, index) => (
                <tr key={item.id || index} className="hover:bg-gray-50">
                  {selectable && (
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(item.id)}
                        onChange={(e) => handleSelectItem(item.id, e.target.checked)}
                        className="rounded border-gray-300 text-[#045c53] focus:ring-[#045c53]"
                      />
                    </td>
                  )}
                  
                  {columns.map((column) => (
                    <td key={column.key} className="px-4 py-3 text-sm text-gray-900">
                      {renderCellValue(item, column)}
                    </td>
                  ))}
                  
                  {actions && (
                    <td className="px-4 py-3 text-right text-sm">
                      <div className="relative">
                        <button
                          onClick={() => setActionMenuOpen(actionMenuOpen === item.id ? null : item.id)}
                          className="p-1 text-gray-400 hover:text-gray-600 rounded"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </button>
                        
                        {actionMenuOpen === item.id && (
                          <>
                            <div 
                              className="fixed inset-0 z-40"
                              onClick={() => setActionMenuOpen(null)}
                            />
                            <div className="absolute right-0 mt-1 w-32 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                              <button
                                onClick={() => {
                                  onView(item);
                                  setActionMenuOpen(null);
                                }}
                                className="w-full flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              >
                                <Eye className="mr-2 h-4 w-4" />
                                Ver
                              </button>
                              <button
                                onClick={() => {
                                  onEdit(item);
                                  setActionMenuOpen(null);
                                }}
                                className="w-full flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              >
                                <Edit className="mr-2 h-4 w-4" />
                                Editar
                              </button>
                              <button
                                onClick={() => {
                                  onDelete(item);
                                  setActionMenuOpen(null);
                                }}
                                className="w-full flex items-center px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Excluir
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && (
        <div className="px-4 py-3 border-t border-gray-200 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Mostrando {((pagination.page - 1) * pagination.limit) + 1} até{' '}
            {Math.min(pagination.page * pagination.limit, pagination.total)} de{' '}
            {pagination.total} registros
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onPageChange(1)}
              disabled={!pagination.hasPrev}
              className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronsLeft className="h-4 w-4" />
            </button>
            
            <button
              onClick={() => onPageChange(pagination.page - 1)}
              disabled={!pagination.hasPrev}
              className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            
            <span className="px-3 py-1 text-sm font-medium text-gray-700 bg-gray-100 rounded">
              {pagination.page} de {pagination.totalPages}
            </span>
            
            <button
              onClick={() => onPageChange(pagination.page + 1)}
              disabled={!pagination.hasNext}
              className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
            
            <button
              onClick={() => onPageChange(pagination.totalPages)}
              disabled={!pagination.hasNext}
              className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronsRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTable;