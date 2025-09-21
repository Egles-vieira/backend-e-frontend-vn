// src/services/clientes.service.js
import { apiGet, apiPost, apiPut, apiDelete } from './api';

class ClientesService {
  async getAll(params = {}) {
    const queryParams = new URLSearchParams(params).toString();
    return await apiGet(`/clientes${queryParams ? `?${queryParams}` : ''}`);
  }

  async getById(id) {
    return await apiGet(`/clientes/${id}`);
  }

  async create(data) {
    return await apiPost('/clientes', data);
  }

  async update(id, data) {
    return await apiPut(`/clientes/${id}`, data);
  }

  async delete(id) {
    return await apiDelete(`/clientes/${id}`);
  }

  async getAtivos() {
    return await apiGet('/clientes/ativos');
  }

  async search(termo) {
    return await apiGet(`/clientes/search?q=${encodeURIComponent(termo)}`);
  }
}

export default new ClientesService();
