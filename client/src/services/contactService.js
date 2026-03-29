import API from './api';

const contactService = {
  createContact: async (payload) => {
    if (import.meta.env.DEV) {
      console.log('🔧 Contact Service - createContact called');
    }
    
    try {
      if (import.meta.env.DEV) {
        console.log('📡 Making API POST request to /api/contact...');
      }
      
      const response = await API.post('/api/contact', payload);
      
      if (import.meta.env.DEV) {
        console.log('✅ API Response received');
      }
      
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      if (import.meta.env.DEV) {
        console.log('❌ Contact Service Error');
      }
      
      // Handle different error types
      if (error.response) {
        // Server responded with error status
        if (import.meta.env.DEV) {
          console.log('🔴 Server Error Response:', {
            status: error.response.status
          });
        }
        
        return {
          success: false,
          error: error.response.data?.message || 'Server error occurred',
          status: error.response.status
        };
      } else if (error.request) {
        // Network error
        if (import.meta.env.DEV) {
          console.log('🌐 Network Error - No response received');
        }
        
        return {
          success: false,
          error: 'Network error. Please check your connection.',
          status: 0
        };
      } else {
        // Other error
        if (import.meta.env.DEV) {
          console.log('⚠️ Other Error Type');
        }
        
        return {
          success: false,
          error: error.message || 'An unexpected error occurred',
          status: -1
        };
      }
    }
  }
};

export default contactService;
