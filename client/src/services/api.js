import axios from 'axios';

// Create axios instance with environment-based baseURL
const getBaseURL = () => {
  // Check if we're in production and have a specific backend URL
  if (import.meta.env.PROD && import.meta.env.VITE_API_BASE_URL) {
    console.log('🌐 Production API URL:', import.meta.env.VITE_API_BASE_URL);
    return import.meta.env.VITE_API_BASE_URL;
  }
  
  // Check if we're in production but no explicit URL is set
  if (import.meta.env.PROD) {
    // For Vercel deployment, use the production backend URL
    const prodURL = 'https://physiocare-backend-ov2z.onrender.com/api';
    console.log('🌐 Using default production API URL:', prodURL);
    return prodURL;
  }
  
  // Development fallback
  console.log('🔧 Using development API URL: /api');
  return '/api';
};

const API = axios.create({
  baseURL: getBaseURL(),
  timeout: 30000, // Increased timeout for Render cold starts
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
      hasToken: !!token,
      timeout: config.timeout
    });
    return config;
  },
  (error) => {
    console.error('❌ Request interceptor error');
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
API.interceptors.response.use(
  (response) => {
    console.log('✅ API Response:', {
      status: response.status,
      url: response.config.url,
      responseTime: response.headers['x-response-time']
    });
    return response;
  },
  (error) => {
    console.error('❌ API Error:', {
      status: error.response?.status,
      url: error.config?.url,
      baseURL: error.config?.baseURL,
      message: error.message,
      code: error.code,
      timeout: error.config?.timeout
    });

    // Handle 401 unauthorized
    if (error.response?.status === 401) {
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_user');
      window.location.href = '/admin/login';
    }

    // Handle network errors and timeouts
    if (!error.response) {
      const baseURL = error.config?.baseURL;
      
      if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
        console.error('⏰ Request timeout - likely Render cold start');
        error.customMessage = `Request timeout (${error.config?.timeout}ms). This is likely due to Render cold start. Please try again in a few seconds.`;
      } else {
        console.error('🌐 Network Error - Backend not reachable');
        error.customMessage = `Backend not reachable. Check backend URL (${baseURL}) and CORS settings. Ensure backend is running and accessible.`;
      }
    }

    return Promise.reject(error);
  }
);

// Retry function for failed requests (especially for cold starts)
export const retryRequest = async (requestFn, maxRetries = 3, delay = 1000) => {
  let lastError;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`🔄 Attempt ${attempt}/${maxRetries} for request`);
      const result = await requestFn();
      console.log(`✅ Request succeeded on attempt ${attempt}`);
      return result;
    } catch (error) {
      lastError = error;
      console.error(`❌ Attempt ${attempt} failed:`, error.message);
      
      // Don't retry on 4xx errors (client errors)
      if (error.response && error.response.status >= 400 && error.response.status < 500) {
        console.log('🚫 Not retrying client error (4xx)');
        throw error;
      }
      
      // Don't retry on the last attempt
      if (attempt === maxRetries) {
        console.log('🚫 Max retries reached');
        throw error;
      }
      
      // Wait before retrying (exponential backoff)
      const waitTime = delay * Math.pow(2, attempt - 1);
      console.log(`⏳ Waiting ${waitTime}ms before retry...`);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
  }
  
  throw lastError;
};

export default API;
