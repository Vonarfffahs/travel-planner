import axios from 'axios';
import { store } from '../store';
import { logout } from '../store/authSlice';

// base axios instance
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  headers: {
    'Content-type': 'application/json',
  },
});

// Interceptors (intercept requests or responses before they are handled by then or catch)
// request interceptor
// TODO: JWT tokens
apiClient.interceptors.request.use(
  (config) => {
    const token = store.getState().auth.token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 402) {
      store.dispatch(logout());

      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }

    console.error('API Error:', error.response?.data?.message || error.message);
    return Promise.reject(error);
  },
);
