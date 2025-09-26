// src/pages/clientes/ClientesList.jsx
import React, { useState, useEffect } from 'react';
import { Plus, Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DataTable from '../../components/common/DataTable';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { clientesService } from '../../services/entities.service';
import toast from 'react-hot-toast';

const ClientesList = () => {
  const navigate = useNavigate();
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState(null);
  const [filters, setFilters] = useState({
    page: 1,
    limit: 20,
    orderBy: 'created_at',
    orderDirection: 'desc',
    search: ''
  });
  const [deleteDialog, setDeleteDialog] = useState({ open: false, item: null });

  const columns = [
    { key: 'id', label: 'ID', sortable: true },
    { key: 'cod_cliente', label: 'Código', sortable: true },
    { key: 'nome', label: 'Nome', sortable: true },
    { key: 'documento', label: 'CPF/CNPJ', sortable: true },
    { key: 'cidade', label: 'Cidade', sortable: true },
    { key: 'uf', label: 'UF', sortable: true },
    { key: 'contato', label: 'Contato' },
    { 
      key: 'created_at', 
      label: 'Criado em', 
      sortable: true,
      type: 'datetime'
    }
  ];

  useEffect(() => {
    loadClientes();
  }, [filters]);

  const loadClientes = async () => {
    try {
      setLoading(true);
      const response = await clientesService.getAll(filters);
      
      if (response.success) {
        setClientes(response.data);
        setPagination(response.pagination);
      }
    } catch (error) {
      toast.error('Erro ao carregar clientes');
      console.error('Erro:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page) => {
    setFilters(prev => ({ ...prev, page }));
  };

  const handleSort = (orderBy, orderDirection) => {
    setFilters(prev => ({ ...prev, orderBy, orderDirection, page: 1 }));
  };

  const handleSearch = (search) => {
    setFilters(prev => ({ ...prev, search, page: 1 }));
  };

  const handleEdit = (cliente) => {
    navigate(`/clientes/${cliente.id}/edit`);
  };

  const handleView = (cliente) => {
    navigate(`/clientes/${cliente.id}`);
  };

  const handleDelete = (cliente) => {
    setDeleteDialog({ open: true, item: cliente });
  };

  const confirmDelete = async () => {
    try {
      const response = await clientesService.delete(deleteDialog.item.id);
      
      if (response.success) {
        toast.success('Cliente excluído com sucesso');
        loadClientes();
      }
    } catch (error) {
      toast.error(error.message || 'Erro ao excluir cliente');
    } finally {
      setDeleteDialog({ open: false, item: null });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Clientes</h1>
          <p className="text-gray-600">Gerencie os clientes do sistema</p>
        </div>
        
        <div className="flex space-x-3">
          <button
            onClick={() => {/* TODO: Implementar exportação */}}
            className="flex items-center px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </button>
          
          <button
            onClick={() => navigate('/clientes/new')}
            className="flex items-center px-4 py-2 bg-[#045c53] text-white rounded-lg hover:bg-[#034a42] transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" />
            Novo Cliente
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-[#045c53] mr-3" />
            <div>
              <p className="text-sm text-gray-600">Total</p>
              <p className="text-xl font-bold text-gray-900">{pagination?.total || 0}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <CheckCircle className="h-8 w-8 text-[#165d2b] mr-3" />
            <div>
              <p className="text-sm text-gray-600">Ativos</p>
              <p className="text-xl font-bold text-gray-900">{pagination?.total || 0}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <FileText className="h-8 w-8 text-[#aacb55] mr-3" />
            <div>
              <p className="text-sm text-gray-600">Com NFs</p>
              <p className="text-xl font-bold text-gray-900">-</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <TrendingUp className="h-8 w-8 text-[#7ab467] mr-3" />
            <div>
              <p className="text-sm text-gray-600">Este Mês</p>
              <p className="text-xl font-bold text-gray-900">-</p>
            </div>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <DataTable
        data={clientes}
        columns={columns}
        loading={loading}
        pagination={pagination}
        onPageChange={handlePageChange}
        onSort={handleSort}
        onEdit={handleEdit}
        onView={handleView}
        onDelete={handleDelete}
        sortBy={filters.orderBy}
        sortDirection={filters.orderDirection}
        searchValue={filters.search}
        onSearchChange={handleSearch}
        emptyMessage="Nenhum cliente encontrado"
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, item: null })}
        onConfirm={confirmDelete}
        title="Excluir Cliente"
        message={`Tem certeza que deseja excluir o cliente "${deleteDialog.item?.nome}"? Esta ação não pode ser desfeita.`}
        type="danger"
        confirmText="Excluir"
        cancelText="Cancelar"
      />
    </div>
  );
};

export default ClientesList;