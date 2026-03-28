import api from './api';

/**
 * About Service
 * Handles all About Us related API calls
 */

// Get About Us content (public)
export const getAboutContent = async () => {
  try {
    const response = await api.get('/about');
    console.log('About API Response:', response.data); // Debug log
    return response.data;
  } catch (error) {
    console.error('Error fetching About content:', error);
    // Return a more descriptive error
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      throw new Error(error.response.data?.message || `Server error: ${error.response.status}`);
    } else if (error.request) {
      // The request was made but no response was received
      throw new Error('No response from server. Please check your connection.');
    } else {
      // Something happened in setting up the request that triggered an Error
      throw new Error(error.message || 'Failed to fetch About content');
    }
  }
};

// Get About Us content for admin
export const getAboutContentForAdmin = async () => {
  try {
    const response = await api.get('/api/admin/about');
    console.log('About Admin API Response:', response.data); // Debug log
    return response.data;
  } catch (error) {
    console.error('Error fetching About content for admin:', error);
    if (error.response) {
      throw new Error(error.response.data?.message || `Server error: ${error.response.status}`);
    } else if (error.request) {
      throw new Error('No response from server. Please check your connection.');
    } else {
      throw new Error(error.message || 'Failed to fetch About content');
    }
  }
};

// Update About Us content (admin only)
export const updateAboutContent = async (aboutData) => {
  try {
    const response = await api.post('/api/admin/about', aboutData);
    console.log('About Update API Response:', response.data); // Debug log
    return response.data;
  } catch (error) {
    console.error('Error updating About content:', error);
    if (error.response) {
      throw new Error(error.response.data?.message || `Server error: ${error.response.status}`);
    } else if (error.request) {
      throw new Error('No response from server. Please check your connection.');
    } else {
      throw new Error(error.message || 'Failed to update About content');
    }
  }
};
