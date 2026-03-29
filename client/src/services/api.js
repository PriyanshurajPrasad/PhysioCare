import axios from 'axios';

// Create axios instance with environment-based baseURL
const getBaseURL = () => {
  // Check if we're in production and have a specific backend URL
  if (import.meta.env.PROD && import.meta.env.VITE_API_BASE_URL) {
    if (import.meta.env.DEV) {
      console.log('🌐 Production API URL:', import.meta.env.VITE_API_BASE_URL);
    }
    return import.meta.env.VITE_API_BASE_URL;
  }
  
  // Check if we're in production but no explicit URL is set
  if (import.meta.env.PROD) {
    // For Vercel deployment, use the production backend URL
    const prodURL = 'https://physiocare-backend-ov2z.onrender.com/api';
    if (import.meta.env.DEV) {
      console.log('🌐 Using default production API URL:', prodURL);
    }
    return prodURL;
  }
  
  // Development fallback
  if (import.meta.env.DEV) {
    console.log('🔧 Using development API URL: /api');
  }
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
    
    // Only log in development
    if (import.meta.env.DEV) {
      console.log('🔗 API Request:', {
        method: config.method?.toUpperCase(),
        url: config.baseURL + config.url,
        hasToken: !!token
      });
    }
    
    return config;
  },
  (error) => {
    if (import.meta.env.DEV) {
      console.error('❌ Request interceptor error:', error);
    }
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
API.interceptors.response.use(
  (response) => {
    // Only log in development
    if (import.meta.env.DEV) {
      console.log('✅ API Response:', {
        status: response.status,
        url: response.config.url
      });
    }
    
    return response;
  },
  (error) => {
    // Only log in development
    if (import.meta.env.DEV) {
      console.error('❌ API Error:', {
        status: error.response?.status,
        url: error.config?.url,
        message: error.message
      });
    }

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
        error.customMessage = `Request timeout (${error.config?.timeout}ms). This is likely due to Render cold start. Please try again in a few seconds.`;
      } else {
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
      if (import.meta.env.DEV) {
        console.log(`🔄 Attempt ${attempt}/${maxRetries} for request`);
      }
      
      const result = await requestFn();
      
      if (import.meta.env.DEV) {
        console.log(`✅ Request succeeded on attempt ${attempt}`);
      }
      
      return result;
    } catch (error) {
      lastError = error;
      
      if (import.meta.env.DEV) {
        console.error(`❌ Attempt ${attempt} failed:`, error.message);
      }
      
      // Don't retry on 4xx errors (client errors)
      if (error.response && error.response.status >= 400 && error.response.status < 500) {
        if (import.meta.env.DEV) {
          console.log('🚫 Not retrying client error (4xx)');
        }
        throw error;
      }
      
      // Don't retry on the last attempt
      if (attempt === maxRetries) {
        if (import.meta.env.DEV) {
          console.log('🚫 Max retries reached');
        }
        throw error;
      }
      
      // Wait before retrying (exponential backoff)
      const waitTime = delay * Math.pow(2, attempt - 1);
      if (import.meta.env.DEV) {
        console.log(`⏳ Waiting ${waitTime}ms before retry...`);
      }
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
  }
  
  throw lastError;
};

export default API;
