import axios from 'axios';

// Create axios instance with environment-based baseURL
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api", // Use env var or fallback to proxy
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
      hasToken: !!token,
      authHeader: config.headers.Authorization ? 'Bearer [TOKEN]' : 'None'
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
      console.error('🌐 Network Error - Backend not reachable');
      error.customMessage = 'Backend not reachable (CORS/URL/server down). Check backend on port 4500.';
    }

    return Promise.reject(error);
  }
);

// Debug environment variables
console.log('🌍 Environment Variables:');
console.log('  VITE_API_URL:', import.meta.env.VITE_API_URL);
console.log('  API baseURL:', API.defaults.baseURL);

export default API;
