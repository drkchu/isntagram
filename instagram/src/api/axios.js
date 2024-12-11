import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000', // Replace with your backend URL
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); // Add JWT token to headers
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
