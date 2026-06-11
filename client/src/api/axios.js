import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://ecopulse-jyys.onrender.com';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken && !error.config._retry) {
        error.config._retry = true;
        try {
          const res = await axios.post(`${API_BASE_URL}/api/auth/refresh`, {}, {
            withCredentials: true,
            headers: { Authorization: `Bearer ${refreshToken}` },
          });
          if (res.data.success && res.data.accessToken) {
            localStorage.setItem('accessToken', res.data.accessToken);
            error.config.headers.Authorization = `Bearer ${res.data.accessToken}`;
            return api(error.config);
          }
        } catch (refreshError) {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          window.location.href = '/login';
          return Promise.reject(refreshError);
        }
      }
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    }
    return Promise.reject(error);
  }
);

export default api;
