import API from './api';

// User service
export const userService = {
  // Create appointment
  createAppointment: async (appointmentData) => {
    const response = await API.post('/user/appointment', appointmentData);
    return response;
  },

  // Get user appointments
  getMyAppointments: async (params = {}) => {
    const response = await API.get('/user/my-appointments', { params });
    return response;
  },

  // Get appointment by ID
  getAppointmentById: async (id) => {
    const response = await API.get(`/user/appointment/${id}`);
    return response;
  },

  // Update appointment
  updateAppointment: async (id, appointmentData) => {
    const response = await API.put(`/user/appointment/${id}`, appointmentData);
    return response;
  },

  // Cancel appointment
  cancelAppointment: async (id) => {
    const response = await API.delete(`/user/appointment/${id}`);
    return response;
  },

  // Get appointment statistics
  getAppointmentStats: async () => {
    const response = await API.get('/user/appointment-stats');
    return response;
  },
};
