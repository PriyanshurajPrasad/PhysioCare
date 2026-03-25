import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for debugging
api.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method?.toUpperCase()} request to ${config.url}`);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('Response error:', error);
    
    // Handle network errors
    if (!error.response) {
      throw new Error('Network error. Please check your connection.');
    }
    
    // Handle API errors
    const { status, data } = error.response;
    
    switch (status) {
      case 400:
        throw new Error(data.message || 'Invalid request. Please check your input.');
      case 404:
        throw new Error('Resource not found.');
      case 500:
        throw new Error('Server error. Please try again later.');
      default:
        throw new Error(data.message || 'An error occurred. Please try again.');
    }
  }
);

/**
 * Get featured reviews
 * @param {number} limit - Number of reviews to fetch (default: 6)
 * @returns {Promise} - Featured reviews data
 */
export const getFeaturedReviews = async (limit = 6) => {
  try {
    const response = await api.get('/reviews/featured', {
      params: { limit }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching featured reviews:', error);
    throw error;
  }
};

/**
 * Get reviews with pagination, search, and filters
 * @param {Object} options - Query options
 * @param {number} options.page - Page number (default: 1)
 * @param {number} options.limit - Reviews per page (default: 9)
 * @param {string} options.q - Search query (name, message, treatment)
 * @param {string|number} options.rating - Filter by rating (1-5 or 'all')
 * @param {string} options.sort - Sort order ('newest', 'oldest', 'highest', 'lowest')
 * @returns {Promise} - Reviews data with pagination
 */
export const getReviews = async (options = {}) => {
  try {
    const {
      page = 1,
      limit = 9,
      q = '',
      rating = 'all',
      sort = 'newest'
    } = options;

    const params = {
      page,
      limit,
      q,
      rating,
      sort
    };

    const response = await api.get('/reviews', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching reviews:', error);
    throw error;
  }
};

/**
 * Create a new review
 * @param {Object} reviewData - Review data
 * @param {string} reviewData.name - Patient name
 * @param {number} reviewData.rating - Rating (1-5)
 * @param {string} reviewData.message - Review message
 * @param {string} reviewData.treatment - Treatment name (optional)
 * @returns {Promise} - Created review data
 */
export const createReview = async (reviewData) => {
  try {
    const response = await api.post('/reviews', reviewData);
    return response.data;
  } catch (error) {
    console.error('Error creating review:', error);
    throw error;
  }
};

/**
 * Get review statistics
 * @returns {Promise} - Review statistics data
 */
export const getReviewStats = async () => {
  try {
    const response = await api.get('/reviews/stats');
    return response.data;
  } catch (error) {
    console.error('Error fetching review stats:', error);
    throw error;
  }
};

// Export all functions as a service object
const reviewService = {
  getFeaturedReviews,
  getReviews,
  createReview,
  getReviewStats
};

export default reviewService;
