import axios from 'axios';

const rawBaseUrl = import.meta.env.VITE_API_URL || 'https://recmate-backend.onrender.com';

const BASE_URL = rawBaseUrl.endsWith('/api/v1')
  ? rawBaseUrl
  : `${rawBaseUrl.replace(/\/+$/, '')}/api/v1`;

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

export const fetchProducts = async (limit = 20) => {
  const res = await apiClient.get(`/products?limit=${limit}`);
  return res.data;
};

export const fetchSampleUsers = async () => {
  const res = await apiClient.get('/users');
  return res.data;
};

export const fetchRecommendations = async (itemId) => {
  const res = await apiClient.get(`/recommend/${itemId}`);
  return res.data;
};

export const predictConversion = async (payload) => {
  const res = await apiClient.post('/predict-conversion', payload);
  return res.data;
};

export default apiClient;