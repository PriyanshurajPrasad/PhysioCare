import API from './api';

const adminService = {
  // Authentication
  loginAdmin: async (credentials) => {
    return await API.post('/admin/auth/login', credentials);
  },

  registerAdmin: async (adminData) => {
    return await API.post('/admin/auth/register', adminData);
  },

  getAdminProfile: async () => {
    return await API.get('/admin/auth/me');
  },

  // Dashboard
  getDashboardStats: async () => {
    return await API.get('/admin/dashboard/stats');
  },

  // SSE for real-time updates
  connectSSE: () => {
    const eventSource = new EventSource(`${API.defaults.baseURL}/admin/events`, {
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
    const response = await API.get(`/admin/messages?${queryString}`);
    console.log('🔍 API Response:', response);
    return response;
  },

  getMessageOptions: async () => {
    const response = await API.get('/admin/messages/options');
    console.log('🔍 Message Options API Response:', response);
    return response;
  },

  getMessageById: async (id) => {
    return await API.get(`/admin/messages/${id}`);
  },

  markMessageAsRead: async (id) => {
    return await API.patch(`/admin/messages/${id}/read`);
  },

  resolveMessage: async (id) => {
    return await API.patch(`/admin/messages/${id}/resolve`);
  },

  deleteMessage: async (id) => {
    return await API.delete(`/admin/messages/${id}`);
  },

  replyToMessage: async (id, replyData) => {
    return await API.post(`/admin/messages/${id}/reply`, replyData);
  },

  // Appointments
  getAppointments: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return await API.get(`/admin/appointments?${queryString}`);
  },

  createAppointment: async (appointmentData) => {
    return await API.post('/admin/appointments', appointmentData);
  },

  updateAppointment: async (id, data) => {
    return await API.patch(`/admin/appointments/${id}`, data);
  },

  getAppointmentById: async (id) => {
    return await API.get(`/admin/appointments/${id}`);
  },

  deleteAppointment: async (id) => {
    return await API.delete(`/admin/appointments/${id}`);
  },

  // Services
  getServices: async () => {
    return await API.get('/admin/services');
  },

  getServiceById: async (id) => {
    return await API.get(`/admin/services/${id}`);
  },

  createService: async (serviceData) => {
    return await API.post('/admin/services', serviceData);
  },

  updateService: async (id, serviceData) => {
    return await API.patch(`/admin/services/${id}`, serviceData);
  },

  deleteService: async (id) => {
    return await API.delete(`/admin/services/${id}`);
  },

  // Testimonials
  getTestimonials: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return await API.get(`/admin/testimonials?${queryString}`);
  },

  approveTestimonial: async (testimonialId) => {
    return await API.post('/admin/testimonials/approve', { testimonialId });
  },

  deleteTestimonial: async (id) => {
    return await API.delete(`/admin/testimonials/${id}`);
  },

  // About
  getAbout: async () => {
    return await API.get('/admin/about');
  },

  updateAbout: async (aboutData) => {
    return await API.put('/admin/about', aboutData);
  },

  // Profile
  updateAdminProfile: async (profileData) => {
    return await API.put('/admin/auth/profile', profileData);
  },

  updateAdminPassword: async (passwordData) => {
    return await API.put('/admin/auth/password', passwordData);
  }
};

export default adminService;
