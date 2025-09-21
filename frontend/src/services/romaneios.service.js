// src/services/romaneios.service.js
import { apiGet, apiPost, apiPut, apiDelete } from './api';

class RomaneiosService {
  async getAll(params = {}) {
    const queryParams = new URLSearchParams(params).toString();
    return await apiGet(`/romaneios${queryParams ? `?${queryParams}` : ''}`);
  }

  async getById(id) {
    return await apiGet(`/romaneios/${id}`);
  }

  async create(data) {
    return await apiPost('/romaneios', data);
  }

  async update(id, data) {
    return await apiPut(`/romaneios/${id}`, data);
  }

  async delete(id) {
    return await apiDelete(`/romaneios/${id}`);
  }

  async getByStatus(status) {
    return await apiGet(`/romaneios/status/${status}`);
  }

  async finalizar(id) {
    return await apiPost(`/romaneios/${id}/finalizar`);
  }

  async cancelar(id, motivo) {
    return await apiPost(`/romaneios/${id}/cancelar`, { motivo });
  }

  async getRelatorio(id) {
    return await apiGet(`/romaneios/${id}/relatorio`);
  }
}

export default new RomaneiosService();