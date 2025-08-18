import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  withCredentials: true,
});

// Attach token automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  console.log('Request config:', config); // Debug log
  return config;
});

// Handle 401 globally
api.interceptors.response.use(
  (res) => {
    console.log('Response data:', res.data); // Debug log
    return res;
  },
  (err) => {
    if (err.response?.status === 401) {
      console.error('401 Unauthorized:', err.response.data);
      localStorage.removeItem('token');
      window.location.href = '/signin';
    }
    return Promise.reject(err);
  }
);

export default api;