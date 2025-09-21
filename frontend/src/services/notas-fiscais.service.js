// src/services/notas-fiscais.service.js
import { apiGet, apiPost, apiPut, apiDelete } from './api';

class NotasFiscaisService {
  // Listar todas com filtros e paginação
  async getAll(params = {}) {
    const queryParams = new URLSearchParams();
    
    // Parâmetros de paginação
    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);
    
    // Filtros
    if (params.chave_nf) queryParams.append('chave_nf', params.chave_nf);
    if (params.numero) queryParams.append('nro', params.numero);
    if (params.cliente_id) queryParams.append('cliente_id', params.cliente_id);
    if (params.transportadora_id) queryParams.append('transportadora_id', params.transportadora_id);
    if (params.status_nf) queryParams.append('status_nf', params.status_nf);
    if (params.finalizada) queryParams.append('finalizada', params.finalizada);
    if (params.data_inicio) queryParams.append('data_inicio', params.data_inicio);
    if (params.data_fim) queryParams.append('data_fim', params.data_fim);
    
    const queryString = queryParams.toString();
    return await apiGet(`/notas-fiscais${queryString ? `?${queryString}` : ''}`);
  }

  // Buscar por ID
  async getById(id) {
    return await apiGet(`/notas-fiscais/${id}`);
  }

  // Criar nova
  async create(data) {
    return await apiPost('/notas-fiscais', data);
  }

  // Atualizar
  async update(id, data) {
    return await apiPut(`/notas-fiscais/${id}`, data);
  }

  // Deletar
  async delete(id) {
    return await apiDelete(`/notas-fiscais/${id}`);
  }

  // Buscar por chave da NF
  async getByChaveNf(chave) {
    return await apiGet(`/notas-fiscais/chave-nf/${chave}`);
  }

  // Buscar por chave do CTE
  async getByChaveCte(chave) {
    return await apiGet(`/notas-fiscais/chave-cte/${chave}`);
  }

  // Buscar por número e série
  async getByNumeroSerie(numero, serie) {
    return await apiGet(`/notas-fiscais/numero/${numero}/serie/${serie}`);
  }

  // Buscar por cliente
  async getByCliente(clienteId, params = {}) {
    const queryParams = new URLSearchParams(params).toString();
    return await apiGet(`/notas-fiscais/cliente/${clienteId}${queryParams ? `?${queryParams}` : ''}`);
  }

  // Buscar por transportadora
  async getByTransportadora(transportadoraId, params = {}) {
    const queryParams = new URLSearchParams(params).toString();
    return await apiGet(`/notas-fiscais/transportadora/${transportadoraId}${queryParams ? `?${queryParams}` : ''}`);
  }

  // Buscar por romaneio
  async getByRomaneio(romaneioId) {
    return await apiGet(`/notas-fiscais/romaneio/${romaneioId}`);
  }

  // Obter estatísticas
  async getStats() {
    return await apiGet('/notas-fiscais/stats');
  }

  // Obter estatísticas por período
  async getStatsByPeriod(dataInicio, dataFim) {
    return await apiGet(`/notas-fiscais/stats/period?data_inicio=${dataInicio}&data_fim=${dataFim}`);
  }

  // Buscar pendentes de romaneio
  async getPendentesRomaneio(transportadoraId = null) {
    const query = transportadoraId ? `?transportadoraId=${transportadoraId}` : '';
    return await apiGet(`/notas-fiscais/pendentes-romaneio${query}`);
  }

  // Buscar com atraso
  async getComAtraso() {
    return await apiGet('/notas-fiscais/com-atraso');
  }

  // Atualizar status
  async updateStatus(id, status, observacoes = '') {
    return await apiPut(`/notas-fiscais/${id}/status`, {
      status,
      observacoes
    });
  }

  // Finalizar nota fiscal
  async finalizar(id, data) {
    return await apiPut(`/notas-fiscais/${id}/finalizar`, data);
  }

  // Associar a romaneio
  async associarRomaneio(romaneioId, notaIds) {
    return await apiPost(`/notas-fiscais/romaneio/${romaneioId}/associar`, {
      notaIds
    });
  }

  // Desassociar de romaneio
  async desassociarRomaneio(notaIds) {
    return await apiPost('/notas-fiscais/romaneio/desassociar', {
      notaIds
    });
  }

  // Restaurar nota fiscal deletada
  async restore(id) {
    return await apiPost(`/notas-fiscais/${id}/restore`);
  }

  // Buscar notas para rastreamento
  async buscarParaRastreamento(params = {}) {
    const queryParams = new URLSearchParams(params).toString();
    return await apiGet(`/notas-fiscais/rastreamento${queryParams ? `?${queryParams}` : ''}`);
  }

  // Exportar dados
  async exportar(params = {}) {
    const queryParams = new URLSearchParams(params).toString();
    return await apiGet(`/notas-fiscais/export${queryParams ? `?${queryParams}` : ''}`);
  }

  // Importar dados
  async importar(dados) {
    return await apiPost('/notas-fiscais/import', dados);
  }

  // Validar chave NF
  validateChaveNf(chave) {
    if (!chave) return false;
    return /^\d{44}$/.test(chave.replace(/\D/g, ''));
  }

  // Formatar valores para exibição
  formatCurrency(value) {
    if (!value) return 'R$ 0,00';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  }

  formatWeight(weight) {
    if (!weight) return '-';
    return `${weight.toFixed(2)} kg`;
  }

  formatDate(dateString) {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('pt-BR');
  }

  formatDateTime(dateTimeString) {
    if (!dateTimeString) return '-';
    return new Date(dateTimeString).toLocaleString('pt-BR');
  }

  // Calcular dias de atraso
  calcularDiasAtraso(previsaoEntrega, dataEntrega = null) {
    const previsao = new Date(previsaoEntrega);
    const entrega = dataEntrega ? new Date(dataEntrega) : new Date();
    
    if (entrega <= previsao) return 0;
    
    const diffTime = entrega.getTime() - previsao.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  }

  // Obter cor do status
  getStatusColor(status) {
    const colors = {
      'pendente': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'em_transito': 'bg-blue-100 text-blue-800 border-blue-200',
      'entregue': 'bg-green-100 text-green-800 border-green-200',
      'devolvida': 'bg-red-100 text-red-800 border-red-200',
      'cancelada': 'bg-gray-100 text-gray-800 border-gray-200'
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  }

  // Obter ícone do status
  getStatusIcon(status) {
    const icons = {
      'pendente': 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
      'em_transito': 'M13 10V3L4 14h7v7l9-11h-7z',
      'entregue': 'M5 13l4 4L19 7',
      'devolvida': 'M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6',
      'cancelada': 'M6 18L18 6M6 6l12 12'
    };
    return icons[status] || 'M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z';
  }
}

export default new NotasFiscaisService();


