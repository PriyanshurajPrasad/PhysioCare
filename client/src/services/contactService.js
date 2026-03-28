import API from './api';

const contactService = {
  createContact: async (payload) => {
    try {
      const response = await API.post('/contact', payload);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      // Handle different error types
      if (error.response) {
        // Server responded with error status
        return {
          success: false,
          error: error.response.data.message || 'Failed to submit contact form',
          errors: error.response.data.errors || [],
          status: error.response.status
        };
      } else if (error.request) {
        // Network error
        return {
          success: false,
          error: 'Network error. Please check your connection.',
          status: null
        };
      } else {
        // Other error
        return {
          success: false,
          error: error.message || 'An unexpected error occurred',
          status: null
        };
      }
    }
  },
};

export default contactService;
