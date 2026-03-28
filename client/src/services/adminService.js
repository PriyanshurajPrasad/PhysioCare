import API, { retryRequest } from './api';

const adminService = {
  // Authentication
  loginAdmin: async (credentials) => {
    console.log('🔐 Admin login attempt:', { email: credentials.email, hasPassword: !!credentials.password });
    
    try {
      const response = await retryRequest(
        () => API.post('/api/admin/auth/login', credentials),
        3, // max 3 retries
        1000 // 1 second initial delay
      );
      
      console.log('✅ Admin login successful:', {
        status: response.status,
        hasToken: !!response.data?.token,
        adminId: response.data?.admin?.id
      });
      
      return response;
    } catch (error) {
      console.error('❌ Admin login failed:', {
        status: error.response?.status,
        message: error.message,
        customMessage: error.customMessage,
        code: error.code,
        baseURL: error.config?.baseURL,
        url: error.config?.url
      });
      
      // Add specific error handling for different scenarios
      if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
        error.customMessage = 'Login request timed out. This is likely due to server cold start. Please try again in a few seconds.';
      } else if (error.response?.status === 401) {
        error.customMessage = 'Invalid email or password. Please check your credentials.';
      } else if (error.response?.status === 404) {
        error.customMessage = 'Admin account not found. Please check your email or contact support.';
      } else if (error.response?.status === 500) {
        error.customMessage = 'Server error occurred. Please try again later.';
      } else if (!error.response) {
        error.customMessage = 'Unable to connect to server. Please check your internet connection and try again.';
      }
      
      throw error;
    }
  },

  registerAdmin: async (adminData) => {
    return await API.post('/api/admin/auth/register', adminData);
  },

  getAdminProfile: async () => {
    return await API.get('/api/admin/auth/me');
  },

  // Dashboard
  getDashboardStats: async () => {
    return await API.get('/api/admin/dashboard/stats');
  },

  // SSE for real-time updates
  connectSSE: () => {
    const eventSource = new EventSource(`${API.defaults.baseURL}/api/admin/events`, {
      withCredentials: true
    });

    eventSource.onopen = () => {
      console.log('🔌 SSE connection opened');
    };

    eventSource.onerror = (error) => {
      console.error('❌ SSE connection error:', error);
    };

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log('📨 SSE event received:', data);
        return data;
      } catch (error) {
        console.error('❌ Failed to parse SSE data:', error);
        return null;
      }
    };

    return eventSource;
  },

  // Messages
  getMessages: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const response = await API.get(`/api/admin/messages?${queryString}`);
    console.log('🔍 API Response:', response);
    return response;
  },

  getMessageOptions: async () => {
    const response = await API.get('/api/admin/messages/options');
    console.log('🔍 Message Options API Response:', response);
    return response;
  },

  getMessageById: async (id) => {
    return await API.get(`/api/admin/messages/${id}`);
  },

  markMessageAsRead: async (id) => {
    return await API.patch(`/api/admin/messages/${id}/read`);
  },

  resolveMessage: async (id) => {
    return await API.patch(`/api/admin/messages/${id}/resolve`);
  },

  deleteMessage: async (id) => {
    return await API.delete(`/api/admin/messages/${id}`);
  },

  replyToMessage: async (id, replyData) => {
    return await API.post(`/api/admin/messages/${id}/reply`, replyData);
  },

  // Appointments
  getAppointments: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return await API.get(`/api/admin/appointments?${queryString}`);
  },

  createAppointment: async (appointmentData) => {
    return await API.post('/api/admin/appointments', appointmentData);
  },

  updateAppointment: async (id, data) => {
    return await API.patch(`/api/admin/appointments/${id}`, data);
  },

  getAppointmentById: async (id) => {
    return await API.get(`/api/admin/appointments/${id}`);
  },

  deleteAppointment: async (id) => {
    return await API.delete(`/api/admin/appointments/${id}`);
  },

  // Services
  getServices: async () => {
    return await API.get('/api/admin/services');
  },

  getServiceById: async (id) => {
    return await API.get(`/api/admin/services/${id}`);
  },

  createService: async (serviceData) => {
    return await API.post('/api/admin/services', serviceData);
  },

  updateService: async (id, serviceData) => {
    return await API.patch(`/api/admin/services/${id}`, serviceData);
  },

  deleteService: async (id) => {
    return await API.delete(`/api/admin/services/${id}`);
  },

  // Testimonials
  getTestimonials: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return await API.get(`/api/admin/testimonials?${queryString}`);
  },

  approveTestimonial: async (testimonialId) => {
    return await API.post('/api/admin/testimonials/approve', { testimonialId });
  },

  deleteTestimonial: async (id) => {
    return await API.delete(`/api/admin/testimonials/${id}`);
  },

  // About
  getAbout: async () => {
    return await API.get('/api/admin/about');
  },

  updateAbout: async (aboutData) => {
    return await API.put('/api/admin/about', aboutData);
  },

  // Profile
  updateAdminProfile: async (profileData) => {
    return await API.put('/api/admin/auth/profile', profileData);
  },

  updateAdminPassword: async (passwordData) => {
    return await API.put('/api/admin/auth/password', passwordData);
  }
};

export default adminService;
