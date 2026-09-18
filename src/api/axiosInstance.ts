import axios from 'axios';
import { API_URL } from './apiConfig';
import { useAuthStore } from '../features/auth/store/authStore';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
      window.location.href = '/login';
    }
    if (error.response?.status === 403) {
      useAuthStore.getState().logout();
      window.location.href = '/acceso-denegado';
    }
    return Promise.reject(error);
  }
);

export default api;
