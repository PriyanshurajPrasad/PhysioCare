import API from './api';

const publicService = {
  // Services
  getServices: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return await API.get(`/services?${queryString}`);
  },

  getServiceById: async (id) => {
    return await API.get(`/services/${id}`);
  },

  // Testimonials
  getTestimonials: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return await API.get(`/testimonials?${queryString}`);
  },

  getFeaturedTestimonials: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return await API.get(`/testimonials/featured?${queryString}`);
  },

  getTestimonialStats: async () => {
    return await API.get('/testimonials/stats');
  },

  createTestimonial: async (testimonialData) => {
    return await API.post('/testimonials', testimonialData);
  },

  // Contact
  submitContact: async (contactData) => {
    return await API.post('/contact', contactData);
  }
};

export default publicService;
