import { User, Record } from '../../../backend/models/types';

export const api = {
  async fetch(url: string, options: RequestInit = {}) {
    const token = localStorage.getItem('token');
    const headers = {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      ...options.headers,
    };
    
    const res = await fetch(url, { ...options, headers });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'API request failed');
    }
    return res.status === 204 ? null : res.json();
  },

  auth: {
    login: (credentials: any) => api.fetch('/api/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
    register: (data: any) => api.fetch('/api/auth/register', { method: 'POST', body: JSON.stringify(data) }),
    getUsers: () => api.fetch('/api/auth/users'),
  },

  records: {
    getAll: (params: URLSearchParams) => api.fetch(`/api/records?${params.toString()}`),
    create: (data: any) => api.fetch('/api/records', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: any) => api.fetch(`/api/records/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: string) => api.fetch(`/api/records/${id}`, { method: 'DELETE' }),
    getStats: () => api.fetch('/api/records/stats'),
  }
};
