// src/pages/clientes/ClienteDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CreditCard as Edit, Trash2, MapPin, FileText } from 'lucide-react';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { clientesService } from '../../services/entities.service';
import toast from 'react-hot-toast';

const ClienteDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [cliente, setCliente] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleteDialog, setDeleteDialog] = useState(false);

  useEffect(() => {
    loadCliente();
  }, [id]);

  const loadCliente = async () => {
    try {
      setLoading(true);
      const response = await clientesService.getById(id);
      
      if (response.success) {
        setCliente(response.data);
      }
    } catch (error) {
      toast.error('Erro ao carregar cliente');
      navigate('/clientes');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await clientesService.delete(id);
      
      if (response.success) {
        toast.success('Cliente excluído com sucesso');
        navigate('/clientes');
      }
    } catch (error) {
      toast.error(error.message || 'Erro ao excluir cliente');
    } finally {
      setDeleteDialog(false);
    }
  };

  if (loading) {
    return <LoadingSpinner size="lg" text="Carregando cliente..." />;
  }

  if (!cliente) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900">Cliente não encontrado</h2>
        <button
          onClick={() => navigate('/clientes')}
          className="mt-4 text-[#045c53] hover:text-[#034a42]"
        >
          Voltar para lista
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/clientes')}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{cliente.nome}</h1>
            <p className="text-gray-600">Código: {cliente.cod_cliente}</p>
          </div>
        </div>
        
        <div className="flex space-x-3">
          <button
            onClick={() => navigate(`/clientes/${id}/edit`)}
            className="flex items-center px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Edit className="h-4 w-4 mr-2" />
            Editar
          </button>
          
          <button
            onClick={() => setDeleteDialog(true)}
            className="flex items-center px-4 py-2 text-red-600 bg-white border border-red-300 rounded-lg hover:bg-red-50 transition-colors"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Excluir
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Informações Básicas */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Informações Básicas</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
                <p className="text-gray-900">{cliente.nome}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Documento</label>
                <p className="text-gray-900">{cliente.documento}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Código</label>
                <p className="text-gray-900">{cliente.cod_cliente}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contato</label>
                <p className="text-gray-900">{cliente.contato || '-'}</p>
              </div>
            </div>
          </div>

          {/* Endereço */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Endereço</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Logradouro</label>
                <p className="text-gray-900">{cliente.endereco || '-'}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bairro</label>
                <p className="text-gray-900">{cliente.bairro || '-'}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">CEP</label>
                <p className="text-gray-900">{cliente.cep || '-'}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cidade</label>
                <p className="text-gray-900">{cliente.cidade || '-'}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">UF</label>
                <p className="text-gray-900">{cliente.uf || '-'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Estatísticas */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Estatísticas</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <FileText className="h-5 w-5 text-[#045c53] mr-2" />
                  <span className="text-gray-600">Notas Fiscais</span>
                </div>
                <span className="font-semibold text-gray-900">
                  {cliente.total_notas || 0}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 text-[#165d2b] mr-2" />
                  <span className="text-gray-600">Endereços</span>
                </div>
                <span className="font-semibold text-gray-900">
                  {cliente.total_enderecos || 0}
                </span>
              </div>
            </div>
          </div>

          {/* Metadados */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Informações do Sistema</h3>
            <div className="space-y-3 text-sm">
              <div>
                <span className="text-gray-600">Criado em:</span>
                <p className="font-medium text-gray-900">
                  {new Date(cliente.created_at).toLocaleString('pt-BR')}
                </p>
              </div>
              
              <div>
                <span className="text-gray-600">Atualizado em:</span>
                <p className="font-medium text-gray-900">
                  {new Date(cliente.updated_at).toLocaleString('pt-BR')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteDialog}
        onClose={() => setDeleteDialog(false)}
        onConfirm={handleDelete}
        title="Excluir Cliente"
        message={`Tem certeza que deseja excluir o cliente "${cliente.nome}"? Esta ação não pode ser desfeita.`}
        type="danger"
        confirmText="Excluir"
        cancelText="Cancelar"
      />
    </div>
  );
};

export default ClienteDetail;