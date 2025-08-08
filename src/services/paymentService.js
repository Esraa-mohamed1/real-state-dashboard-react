import api from './api';

export const paymentService = {
  async getAll() {
    const { data } = await api.get('/api/payments');
    return data;
  },
  async getById(id) {
    const { data } = await api.get(`/api/payments/${id}`);
    return data;
  },
  async create(payload) {
    const { data } = await api.post('/api/payments', payload);
    return data;
  },
  async update(id, payload) {
    const { data } = await api.put(`/api/payments/${id}`, payload);
    return data;
  },
  async remove(id) {
    const { data } = await api.delete(`/api/payments/${id}`);
    return data;
  },
  async getSummary() {
    const { data } = await api.get('/api/payments/summary');
    return data; // { totalPaid }
  },
}; 