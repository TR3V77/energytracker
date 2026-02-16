import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
});

export const healthCheck = () => api.get('/health');
export const uploadFile = (formData) => api.post('/upload', formData);
export const getNeighborhoods = () => api.get('/neighborhoods');
export const getEnergyData = (params) => api.get('/energy', { params });

export default api;
