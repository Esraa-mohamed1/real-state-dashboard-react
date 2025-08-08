import api from './api';

export const propertyService = {
  async getAll() {
    const { data } = await api.get('/api/properties');
    return data;
  },
  async getById(id) {
    const { data } = await api.get(`/api/properties/${id}`);
    return data;
  },
  async create(payload) {
    const { data } = await api.post('/api/properties', payload);
    return data;
  },
  async update(id, payload) {
    const { data } = await api.put(`/api/properties/${id}`, payload);
    return data;
  },
  async remove(id) {
    const { data } = await api.delete(`/api/properties/${id}`);
    return data;
  },
  async getRentedVacant() {
    const { data } = await api.get('/api/properties/rented-vacant');
    return data; // { rented, vacant }
  },
  async getIncomePortfolio() {
    const { data } = await api.get('/api/properties/income-portfolio');
    return data; // { monthlyIncome, portfolioValue }
  },
}; 