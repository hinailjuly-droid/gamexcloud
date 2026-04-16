import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10s timeout
});

// Interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = Cookies.get('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const gamesApi = {
  getGames: async (params: any) => {
    const { data } = await api.get('/games', { params });
    return data;
  },
  getGameBySlug: async (slug: string) => {
    const { data } = await api.get(`/games/${slug}`);
    return data;
  },
  getFeaturedGames: async () => {
    const { data } = await api.get('/games/featured');
    return data;
  },
  getTrendingGames: async () => {
    const { data } = await api.get('/games/trending');
    return data;
  },
  getPopularGames: async () => {
    const { data } = await api.get('/games/popular');
    return data;
  },
  getCategories: async () => {
    const { data } = await api.get('/games/categories');
    return data;
  },
  searchGames: async (params: any) => {
    const { data } = await api.get('/games/search', { params });
    return data;
  },
  trackPlay: async (id: string) => {
    const { data } = await api.post(`/games/${id}/play`);
    return data;
  },
  trackView: async (id: string) => {
    const { data } = await api.post(`/games/${id}/view`);
    return data;
  },
};

export const adminApi = {
  login: async (credentials: any) => {
    const { data } = await api.post('/admin/login', credentials);
    return data;
  },
  getMe: async () => {
    const { data } = await api.get('/admin/me');
    return data;
  },
  getDashboard: async () => {
    const { data } = await api.get('/admin/dashboard');
    return data;
  },
  getGames: async (params: any) => {
    const { data } = await api.get('/admin/games', { params });
    return data;
  },
  updateGame: async (id: string, updates: any) => {
    const { data } = await api.put(`/admin/games/${id}`, updates);
    return data;
  },
  deleteGame: async (id: string) => {
    const { data } = await api.delete(`/admin/games/${id}`);
    return data;
  },
  toggleFeature: async (id: string) => {
    const { data } = await api.post(`/admin/games/${id}/feature`);
    return data;
  },
  toggleVerify: async (id: string) => {
    const { data } = await api.post(`/admin/games/${id}/verify`);
    return data;
  },
  triggerFetch: async () => {
    const { data } = await api.post('/admin/fetch');
    return data;
  },
  getAnalytics: async () => {
    const { data } = await api.get('/admin/analytics');
    return data;
  },
  changePassword: async (passwords: any) => {
    const { data } = await api.put('/admin/settings/password', passwords);
    return data;
  },
};

export const blogApi = {
  getPosts: async (params: any) => {
    const { data } = await api.get('/blog', { params });
    return data;
  },
  getPostBySlug: async (slug: string) => {
    const { data } = await api.get(`/blog/${slug}`);
    return data;
  },
  getCategories: async () => {
    const { data } = await api.get('/blog/categories');
    return data;
  },
};

export default api;
