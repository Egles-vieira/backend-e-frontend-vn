// src/services/ocorrencias.service.js
import { apiGet, apiPost, apiPut, apiDelete } from './api';

class OcorrenciasService {
  async getAll(params = {}) {
    const queryParams = new URLSearchParams(params).toString();
    return await apiGet(`/ocorrencias${queryParams ? `?${queryParams}` : ''}`);
  }

  async getById(id) {
    return await apiGet(`/ocorrencias/${id}`);
  }

  async create(data) {
    return await apiPost('/ocorrencias', data);
  }

  async update(id, data) {
    return await apiPut(`/ocorrencias/${id}`, data);
  }

  async delete(id) {
    return await apiDelete(`/ocorrencias/${id}`);
  }

  async getFinalizadoras() {
    return await apiGet('/ocorrencias/finalizadoras');
  }

  async getAtivasApi() {
    return await apiGet('/ocorrencias/ativas-api');
  }

  async search(termo) {
    return await apiGet(`/ocorrencias/search?q=${encodeURIComponent(termo)}`);
  }

  async getStats() {
    return await apiGet('/ocorrencias/stats');
  }

  async toggleApi(id) {
    return await apiPost(`/ocorrencias/${id}/toggle-api`);
  }

  async toggleFinalizadora(id) {
    return await apiPost(`/ocorrencias/${id}/toggle-finalizadora`);
  }
}

export default new OcorrenciasService();