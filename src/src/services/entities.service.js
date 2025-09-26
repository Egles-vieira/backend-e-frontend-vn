// src/services/entities.service.js
import BaseService from './base.service';
import api from './api';

// Serviços para cada entidade do backend
class ClientesService extends BaseService {
  constructor() {
    super('/clientes');
  }

  async getByDocumento(documento) {
    const response = await api.get(`${this.endpoint}/documento/${documento}`);
    return response.data;
  }

  async getByCodigo(codigo) {
    const response = await api.get(`${this.endpoint}/codigo/${codigo}`);
    return response.data;
  }

  async getByUf(uf) {
    const response = await api.get(`${this.endpoint}/uf/${uf}`);
    return response.data;
  }

  async getByCidade(cidade) {
    const response = await api.get(`${this.endpoint}/cidade/${cidade}`);
    return response.data;
  }
}

class TransportadorasService extends BaseService {
  constructor() {
    super('/transportadoras');
  }

  async getByCnpj(cnpj) {
    const response = await api.get(`${this.endpoint}/cnpj/${cnpj}`);
    return response.data;
  }

  async getForIntegration() {
    const response = await api.get(`${this.endpoint}/integration`);
    return response.data;
  }
}

class EmbarcadoresService extends BaseService {
  constructor() {
    super('/embarcadores');
  }

  async getByDocumento(documento) {
    const response = await api.get(`${this.endpoint}/documento/${documento}`);
    return response.data;
  }

  async getWithDepositos(id) {
    const response = await api.get(`${this.endpoint}/${id}/depositos`);
    return response.data;
  }
}

class MotoristasService extends BaseService {
  constructor() {
    super('/motoristas');
  }

  async getByCpf(cpf) {
    const response = await api.get(`${this.endpoint}/cpf/${cpf}`);
    return response.data;
  }

  async getActiveForMessages() {
    const response = await api.get(`${this.endpoint}/active-messages`);
    return response.data;
  }

  async getWithJornada(id) {
    const response = await api.get(`${this.endpoint}/${id}/jornada`);
    return response.data;
  }
}

class NotasFiscaisService extends BaseService {
  constructor() {
    super('/notas-fiscais');
  }

  async getByChaveNf(chave) {
    const response = await api.get(`${this.endpoint}/chave-nf/${chave}`);
    return response.data;
  }

  async getByChaveCte(chave) {
    const response = await api.get(`${this.endpoint}/chave-cte/${chave}`);
    return response.data;
  }

  async getByNumeroSerie(numero, serie) {
    const response = await api.get(`${this.endpoint}/numero/${numero}/serie/${serie}`);
    return response.data;
  }

  async getByCliente(clienteId, params = {}) {
    const response = await api.get(`${this.endpoint}/cliente/${clienteId}`, { params });
    return response.data;
  }

  async getByRomaneio(romaneioId) {
    const response = await api.get(`${this.endpoint}/romaneio/${romaneioId}`);
    return response.data;
  }

  async getPendentesRomaneio(transportadoraId) {
    const response = await api.get(`${this.endpoint}/pendentes-romaneio`, {
      params: { transportadoraId }
    });
    return response.data;
  }

  async getComAtraso() {
    const response = await api.get(`${this.endpoint}/com-atraso`);
    return response.data;
  }

  async updateStatus(id, statusData) {
    const response = await api.patch(`${this.endpoint}/${id}/status`, statusData);
    return response.data;
  }

  async finalizar(id, finalizarData) {
    const response = await api.patch(`${this.endpoint}/${id}/finalizar`, finalizarData);
    return response.data;
  }

  async associarRomaneio(romaneioId, notaIds) {
    const response = await api.post(`${this.endpoint}/romaneio/${romaneioId}/associar`, {
      notaIds
    });
    return response.data;
  }

  async desassociarRomaneio(notaIds) {
    const response = await api.post(`${this.endpoint}/romaneio/desassociar`, {
      notaIds
    });
    return response.data;
  }

  async getStatsByPeriod(dataInicio, dataFim) {
    const response = await api.get(`${this.endpoint}/stats/period`, {
      params: { data_inicio: dataInicio, data_fim: dataFim }
    });
    return response.data;
  }
}

class RomaneiosService extends BaseService {
  constructor() {
    super('/romaneios');
  }

  async getByNumero(numero) {
    const response = await api.get(`${this.endpoint}/numero/${numero}`);
    return response.data;
  }

  async getByPlaca(placa) {
    const response = await api.get(`${this.endpoint}/placa/${placa}`);
    return response.data;
  }

  async getByMotorista(motoristaId) {
    const response = await api.get(`${this.endpoint}/motorista/${motoristaId}`);
    return response.data;
  }

  async getByRoteirizacao(status) {
    const response = await api.get(`${this.endpoint}/roteirizacao/${status}`);
    return response.data;
  }

  async getNotasFiscais(id) {
    const response = await api.get(`${this.endpoint}/${id}/notas-fiscais`);
    return response.data;
  }

  async updateRotas(id, rotasData) {
    const response = await api.patch(`${this.endpoint}/${id}/rotas`, rotasData);
    return response.data;
  }

  async toggleRoteirizar(id) {
    const response = await api.patch(`${this.endpoint}/${id}/roteirizar`);
    return response.data;
  }
}

class OcorrenciasService extends BaseService {
  constructor() {
    super('/ocorrencias');
  }

  async getByCodigo(codigo) {
    const response = await api.get(`${this.endpoint}/codigo/${codigo}`);
    return response.data;
  }

  async getByTipo(tipo) {
    const response = await api.get(`${this.endpoint}/tipo/${tipo}`);
    return response.data;
  }

  async getByProcesso(processo) {
    const response = await api.get(`${this.endpoint}/processo/${processo}`);
    return response.data;
  }

  async getFinalizadoras() {
    const response = await api.get(`${this.endpoint}/finalizadoras`);
    return response.data;
  }

  async getAtivasApi() {
    const response = await api.get(`${this.endpoint}/ativas-api`);
    return response.data;
  }

  async toggleApi(id) {
    const response = await api.patch(`${this.endpoint}/${id}/toggle-api`);
    return response.data;
  }

  async toggleFinalizadora(id) {
    const response = await api.patch(`${this.endpoint}/${id}/toggle-finalizadora`);
    return response.data;
  }
}

class EnderecoEntregaService extends BaseService {
  constructor() {
    super('/enderecos-entrega');
  }

  async getByCliente(clienteId) {
    const response = await api.get(`${this.endpoint}/cliente/${clienteId}`);
    return response.data;
  }

  async getByCidadeUf(cidade, uf) {
    const response = await api.get(`${this.endpoint}/localizacao`, {
      params: { cidade, uf }
    });
    return response.data;
  }

  async getComRestricao() {
    const response = await api.get(`${this.endpoint}/restritos`);
    return response.data;
  }

  async updateCoordenadas(id, coordenadas) {
    const response = await api.patch(`${this.endpoint}/${id}/coordenadas`, coordenadas);
    return response.data;
  }
}

class TransportadoraCodigoService extends BaseService {
  constructor() {
    super('/transportadora-codigo-ocorrencia');
  }

  async getByTransportadora(transportadoraId, params = {}) {
    const response = await api.get(`${this.endpoint}/transportadora/${transportadoraId}`, { params });
    return response.data;
  }

  async getByCodigoOcorrencia(codigoOcorrencia, params = {}) {
    const response = await api.get(`${this.endpoint}/codigo-ocorrencia/${codigoOcorrencia}`, { params });
    return response.data;
  }

  async getVinculo(transportadoraId, codigoOcorrencia) {
    const response = await api.get(`${this.endpoint}/transportadora/${transportadoraId}/codigo-ocorrencia/${codigoOcorrencia}`);
    return response.data;
  }

  async createMultiple(vinculos) {
    const response = await api.post(`${this.endpoint}/multiple`, { vinculos });
    return response.data;
  }

  async deleteByTransportadora(transportadoraId) {
    const response = await api.delete(`${this.endpoint}/transportadora/${transportadoraId}`);
    return response.data;
  }

  async deleteByCodigoOcorrencia(codigoOcorrencia) {
    const response = await api.delete(`${this.endpoint}/codigo-ocorrencia/${codigoOcorrencia}`);
    return response.data;
  }
}

class JobsService extends BaseService {
  constructor() {
    super('/jobs');
  }

  async getStatus() {
    const response = await api.get(`${this.endpoint}/status`);
    return response.data;
  }

  async runManual(data = {}) {
    const response = await api.post(`${this.endpoint}/run`, data);
    return response.data;
  }

  async stop() {
    const response = await api.post(`${this.endpoint}/stop`);
    return response.data;
  }

  async restart() {
    const response = await api.post(`${this.endpoint}/restart`);
    return response.data;
  }

  async reloadConfig() {
    const response = await api.post(`${this.endpoint}/reload-config`);
    return response.data;
  }

  async getIntegrations(params = {}) {
    const response = await api.get(`${this.endpoint}/integrations`, { params });
    return response.data;
  }

  async getIntegrationLogs(integracaoId, params = {}) {
    const response = await api.get(`${this.endpoint}/integrations/${integracaoId}/logs`, { params });
    return response.data;
  }

  async processTransportadora(transportadoraId) {
    const response = await api.post(`${this.endpoint}/transportadora/${transportadoraId}/process`);
    return response.data;
  }

  async clearQueue(transportadoraId) {
    const response = await api.delete(`${this.endpoint}/transportadora/${transportadoraId}/queue/clear`);
    return response.data;
  }

  async getApiTokens() {
    const response = await api.get(`${this.endpoint}/api-tokens`);
    return response.data;
  }

  async setApiToken(tokenData) {
    const response = await api.post(`${this.endpoint}/api-tokens`, tokenData);
    return response.data;
  }
}

class MonitoringService extends BaseService {
  constructor() {
    super('/monitoring');
  }

  async getDashboard(params = {}) {
    const response = await api.get(`${this.endpoint}/dashboard`, { params });
    return response.data;
  }

  async getTransportadoraMetrics(transportadoraId, params = {}) {
    const response = await api.get(`${this.endpoint}/transportadora/${transportadoraId}/metrics`, { params });
    return response.data;
  }

  async getPerformanceStats(params = {}) {
    const response = await api.get(`${this.endpoint}/performance`, { params });
    return response.data;
  }

  async getHealthReport() {
    const response = await api.get(`${this.endpoint}/health`);
    return response.data;
  }

  async getLogs(params = {}) {
    const response = await api.get(`${this.endpoint}/logs`, { params });
    return response.data;
  }

  async getActiveAlerts() {
    const response = await api.get(`${this.endpoint}/alerts`);
    return response.data;
  }

  async getNFStatusSummary(params = {}) {
    const response = await api.get(`${this.endpoint}/nf-status`, { params });
    return response.data;
  }

  async exportReport(params = {}) {
    const response = await api.get(`${this.endpoint}/export`, { params });
    return response.data;
  }

  async getConfig() {
    const response = await api.get(`${this.endpoint}/config`);
    return response.data;
  }

  async updateConfig(config) {
    const response = await api.put(`${this.endpoint}/config`, config);
    return response.data;
  }
}

// Instâncias dos serviços
export const clientesService = new ClientesService();
export const transportadorasService = new TransportadorasService();
export const embarcadoresService = new EmbarcadoresService();
export const motoristasService = new MotoristasService();
export const notasFiscaisService = new NotasFiscaisService();
export const romaneiosService = new RomaneiosService();
export const ocorrenciasService = new OcorrenciasService();
export const enderecoEntregaService = new EnderecoEntregaService();
export const transportadoraCodigoService = new TransportadoraCodigoService();
export const jobsService = new JobsService();
export const monitoringService = new MonitoringService();

export default {
  clientes: clientesService,
  transportadoras: transportadorasService,
  embarcadores: embarcadoresService,
  motoristas: motoristasService,
  notasFiscais: notasFiscaisService,
  romaneios: romaneiosService,
  ocorrencias: ocorrenciasService,
  enderecoEntrega: enderecoEntregaService,
  transportadoraCodigo: transportadoraCodigoService,
  jobs: jobsService,
  monitoring: monitoringService
};