import api from './api';

export const debtService = {
  async getAll() {
    const { data } = await api.get('/api/debts');
    return data;
  },
  async getById(id) {
    const { data } = await api.get(`/api/debts/${id}`);
    return data;
  },
  async create(payload) {
    const { data } = await api.post('/api/debts', payload);
    return data;
  },
  async update(id, payload) {
    const { data } = await api.put(`/api/debts/${id}`, payload);
    return data;
  },
  async remove(id) {
    const { data } = await api.delete(`/api/debts/${id}`);
    return data;
  },
  async getBreakdown() {
    const { data } = await api.get('/api/debts/breakdown');
    return data;
  },
  async getSummary() {
    const { data } = await api.get('/api/debts/summary');
    return data; // { pending, settled }
  },
}; 