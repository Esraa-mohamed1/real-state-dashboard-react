import api from './api';

export async function getOverview() {
  const { data } = await api.get('/api/dashboard/overview');
  return data; // { totalPayments, outstandingDebt, netPosition }
} 