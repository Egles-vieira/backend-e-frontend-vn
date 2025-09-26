// src/pages/clientes/ClientesList.jsx
import React from 'react';
import { Plus, Download, Users, CheckCircle, FileText, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ClientesList = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Clientes</h1>
          <p className="text-gray-600">Gerencie os clientes do sistema</p>
        </div>
        
        <div className="flex space-x-3">
          <button className="flex items-center px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
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
              <p className="text-xl font-bold text-gray-900">1,234</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <CheckCircle className="h-8 w-8 text-[#165d2b] mr-3" />
            <div>
              <p className="text-sm text-gray-600">Ativos</p>
              <p className="text-xl font-bold text-gray-900">1,198</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <FileText className="h-8 w-8 text-[#aacb55] mr-3" />
            <div>
              <p className="text-sm text-gray-600">Com NFs</p>
              <p className="text-xl font-bold text-gray-900">987</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <TrendingUp className="h-8 w-8 text-[#7ab467] mr-3" />
            <div>
              <p className="text-sm text-gray-600">Este Mês</p>
              <p className="text-xl font-bold text-gray-900">156</p>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6">
          <p className="text-center text-gray-500">
            Lista de clientes será implementada aqui.
            <br />
            Seguindo o padrão do sistema Road-RW.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ClientesList;