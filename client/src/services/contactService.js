import API from './api';

const contactService = {
  createContact: async (payload) => {
    console.log('🔧 Contact Service - createContact called');
    console.log('📦 Payload:', payload);
    
    try {
      console.log('📡 Making API POST request to /api/contact...');
      const response = await API.post('/api/contact', payload);
      console.log('✅ API Response received:', response);
      console.log('📊 Response data:', response.data);
      
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.log('❌ Contact Service Error:', error);
      console.log('Error details:', {
        message: error.message,
        response: error.response,
        request: error.request,
        config: error.config
      });
      
      // Handle different error types
      if (error.response) {
        // Server responded with error status
        console.log('🔴 Server Error Response:', {
          status: error.response.status,
          data: error.response.data,
          headers: error.response.headers
        });
        
        return {
          success: false,
          error: error.response.data?.message || 'Failed to submit contact form',
          errors: error.response.data?.errors || [],
          status: error.response.status
        };
      } else if (error.request) {
        // Network error
        console.log('🌐 Network Error - No response received');
        return {
          success: false,
          error: 'Network error. Please check your connection.',
          status: null
        };
      } else {
        // Other error
        console.log('⚠️ Other Error Type:', error);
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
