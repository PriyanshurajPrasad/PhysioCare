import axios from 'axios';

// Create axios instance for admin auth
const adminAuthAPI = axios.create({
  baseURL: '/api/admin/auth',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to add admin auth token
adminAuthAPI.interceptors.request.use(
  (config) => {
    const adminToken = localStorage.getItem('adminToken');
    if (adminToken) {
      config.headers.Authorization = `Bearer ${adminToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
adminAuthAPI.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 unauthorized - clear admin token and redirect to login
    if (error.response?.status === 401) {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
      window.location.href = '/admin';
    }
    return Promise.reject(error);
  }
);

// Admin Auth Service
export const adminAuthService = {
  // Register new admin
  registerAdmin: async (adminData) => {
    const response = await adminAuthAPI.post('/register', adminData);
    return response.data;
  },

  // Login admin
  loginAdmin: async (credentials) => {
    const response = await adminAuthAPI.post('/login', credentials);
    return response.data;
  },

  // Get current admin profile
  getAdminMe: async () => {
    const response = await adminAuthAPI.get('/me');
    return response.data;
  },

  // Logout admin
  logoutAdmin: async () => {
    const response = await adminAuthAPI.post('/logout');
    return response.data;
  }
};

// Helper functions for admin token management
export const tokenManager = {
  // Save admin token and user data to localStorage
  saveAuthData: (token, user) => {
    localStorage.setItem('adminToken', token);
    localStorage.setItem('adminUser', JSON.stringify(user));
  },

  // Get admin token from localStorage
  getToken: () => {
    return localStorage.getItem('adminToken');
  },

  // Get admin user data from localStorage
  getUser: () => {
    const userStr = localStorage.getItem('adminUser');
    return userStr ? JSON.parse(userStr) : null;
  },

  // Clear admin auth data from localStorage
  clearAuthData: () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
  },

  // Check if admin user is authenticated
  isAuthenticated: () => {
    const adminToken = tokenManager.getToken();
    const adminUser = tokenManager.getUser();
    return !!(adminToken && adminUser && adminUser.role === 'admin');
  }
};

export default adminAuthService;
