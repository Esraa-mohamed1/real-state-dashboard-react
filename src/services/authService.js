import api from './api';

export async function login(credentials) {
  const { data } = await api.post('/api/auth/login', credentials);
  return data; // { token, user }
} 