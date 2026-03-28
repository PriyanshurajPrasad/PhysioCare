import axios from 'axios';

// Create axios instance with environment-based baseURL
const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "/api", // Use env var or fallback to proxy
  timeout: 10000,
  withCredentials: false,
  headers: { 'Content-Type': 'application/json' }
});

// Request interceptor to add auth token
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('admin_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log('🔗 API Request:', {
      method: config.method?.toUpperCase(),
      url: config.baseURL + config.url,
      baseURL: config.baseURL,
      hasToken: !!token
    });
    return config;
  },
  (error) => {
    console.error('❌ Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
API.interceptors.response.use(
  (response) => {
    console.log('✅ API Response:', {
      status: response.status,
      url: response.config.url,
      data: response.data
    });
    return response;
  },
  (error) => {
    console.error('❌ API Error:', {
      status: error.response?.status,
      url: error.config?.url,
      baseURL: error.config?.baseURL,
      message: error.message,
      data: error.response?.data
    });

    // Handle 401 unauthorized
    if (error.response?.status === 401) {
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_user');
      window.location.href = '/admin/login';
    }

    // Handle network errors
    if (!error.response) {
      const baseURL = error.config?.baseURL;
      console.error('🌐 Network Error - Backend not reachable');
      error.customMessage = `Backend not reachable. Check backend URL (${baseURL}) and CORS settings. Ensure backend is running and accessible.`;
    }

    return Promise.reject(error);
  }
);

export default API;
