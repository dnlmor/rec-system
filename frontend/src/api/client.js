import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
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