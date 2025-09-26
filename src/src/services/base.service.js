// src/services/base.service.js
import api from './api';

class BaseService {
  constructor(endpoint) {
    this.endpoint = endpoint;
  }

  async getAll(params = {}) {
    try {
      const response = await api.get(this.endpoint, { params });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getById(id) {
    try {
      const response = await api.get(`${this.endpoint}/${id}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async create(data) {
    try {
      const response = await api.post(this.endpoint, data);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async update(id, data) {
    try {
      const response = await api.put(`${this.endpoint}/${id}`, data);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async delete(id) {
    try {
      const response = await api.delete(`${this.endpoint}/${id}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async search(query, limit = 10) {
    try {
      const response = await api.get(`${this.endpoint}/search`, {
        params: { q: query, limit }
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getStats() {
    try {
      const response = await api.get(`${this.endpoint}/stats`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  handleError(error) {
    const message = error.response?.data?.message || error.message || 'Erro desconhecido';
    const status = error.response?.status;
    const errors = error.response?.data?.errors || [];
    
    return {
      message,
      status,
      errors,
      originalError: error
    };
  }
}

export default BaseService;