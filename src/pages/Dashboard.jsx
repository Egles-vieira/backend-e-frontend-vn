// src/pages/Dashboard.jsx
import React from 'react';
import { Users, Truck, Package, FileText, TrendingUp, CircleAlert as AlertCircle, CircleCheck as CheckCircle, Clock, ChartBar as BarChart3 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();

  const StatCard = ({ title, value, icon: Icon, color, subtitle, trend }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {subtitle && (
            <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
          )}
        </div>
        <div 
          className="p-3 rounded-lg"
          style={{ backgroundColor: `${color}20` }}
        >
          <Icon className="h-6 w-6" style={{ color }} />
        </div>
      </div>
      
      {trend && (
        <div className="mt-4 flex items-center">
          <TrendingUp className={`h-4 w-4 mr-1 ${trend > 0 ? 'text-green-500' : 'text-red-500'}`} />
          <span className={`text-sm font-medium ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
            {trend > 0 ? '+' : ''}{trend}%
          </span>
          <span className="text-sm text-gray-500 ml-1">vs. período anterior</span>
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Bem-vindo, {user?.name || 'Usuário'}!</p>
        </div>
        <button className="px-4 py-2 bg-[#045c53] text-white rounded-lg hover:bg-[#034a42] transition-colors">
          Atualizar
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total de Notas Fiscais"
          value="1,234"
          icon={FileText}
          color="#045c53"
          subtitle="Todas as notas"
        />
        
        <StatCard
          title="Notas Finalizadas"
          value="987"
          icon={CheckCircle}
          color="#165d2b"
          subtitle="Entregas concluídas"
        />
        
        <StatCard
          title="Notas Pendentes"
          value="247"
          icon={Clock}
          color="#aacb55"
          subtitle="Aguardando entrega"
        />
        
        <StatCard
          title="Notas com Atraso"
          value="12"
          icon={AlertCircle}
          color="#7ab467"
          subtitle="Fora do prazo"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Resumo Financeiro */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Resumo Financeiro</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Valor Total</span>
              <span className="font-semibold text-gray-900">R$ 2.456.789,00</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Valor Médio</span>
              <span className="font-semibold text-gray-900">R$ 1.992,00</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Peso Total</span>
              <span className="font-semibold text-gray-900">15.678 kg</span>
            </div>
          </div>
        </div>

        {/* Status das Integrações */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Status das Integrações</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">JAMEF</span>
              <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                Ativo
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Braspress</span>
              <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
                Atenção
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">TNT</span>
              <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                Ativo
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Ações Rápidas</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <FileText className="h-8 w-8 text-[#045c53] mr-3" />
            <div className="text-left">
              <div className="font-medium text-gray-900">Nova Nota Fiscal</div>
              <div className="text-sm text-gray-500">Cadastrar nova NF</div>
            </div>
          </button>
          
          <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <Users className="h-8 w-8 text-[#165d2b] mr-3" />
            <div className="text-left">
              <div className="font-medium text-gray-900">Novo Cliente</div>
              <div className="text-sm text-gray-500">Cadastrar cliente</div>
            </div>
          </button>
          
          <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <BarChart3 className="h-8 w-8 text-[#aacb55] mr-3" />
            <div className="text-left">
              <div className="font-medium text-gray-900">Relatórios</div>
              <div className="text-sm text-gray-500">Ver relatórios</div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;