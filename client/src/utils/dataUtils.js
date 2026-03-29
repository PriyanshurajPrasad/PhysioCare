/**
 * Utility functions for safe data handling and API response normalization
 */

/**
 * Safely extracts array from nested API response
 * @param {any} response - API response object
 * @param {string} arrayPath - Path to array (e.g., 'data.appointments')
 * @returns {Array} - Always returns an array
 */
export const extractArray = (response, arrayPath = 'data') => {
  const paths = [
    arrayPath,
    `data.${arrayPath}`,
    'data.data.appointments',
    'data.appointments',
    'data',
    ''
  ];

  for (const path of paths) {
    try {
      const result = path ? getNestedValue(response, path) : response;
      if (Array.isArray(result)) {
        if (import.meta.env.DEV) {
          console.log(`✅ Array found at path: ${path}`, result.length > 0 ? `[${result.length} items]` : '[]');
        }
        return result;
      }
    } catch (error) {
      // Continue to next path
    }
  }

  if (import.meta.env.DEV) {
    console.warn('⚠️ No array found in response, returning empty array');
  }
  return [];
};

/**
 * Get nested value from object using dot notation
 * @param {object} obj - Object to traverse
 * @param {string} path - Dot notation path (e.g., 'data.appointments')
 * @returns {any} - Value at path or undefined
 */
export const getNestedValue = (obj, path) => {
  return path.split('.').reduce((current, key) => current?.[key], obj);
};

/**
 * Safely normalize API response data
 * @param {object} response - API response
 * @param {string} dataType - Type of data to extract ('appointments', 'messages', etc.)
 * @returns {Array} - Normalized array
 */
export const normalizeResponseData = (response, dataType) => {
  if (import.meta.env.DEV) {
    console.log(`🔍 Normalizing ${dataType} response`);
  }
  
  const array = extractArray(response, dataType);
  
  if (import.meta.env.DEV) {
    console.log(`📋 Normalized ${dataType}:`, {
      isArray: Array.isArray(array),
      length: array.length,
      sample: array.length > 0 ? `[${array.slice(0, 2).length} items]` : '[]'
    });
  }
  
  return array;
};

/**
 * Safe fallback for missing data
 * @param {any} value - Value to check
 * @param {any} fallback - Fallback value
 * @returns {any} - Value or fallback
 */
export const safeFallback = (value, fallback = 'N/A') => {
  return value !== null && value !== undefined && value !== '' ? value : fallback;
};

/**
 * Check if response is successful
 * @param {object} response - API response
 * @returns {boolean} - Whether response indicates success
 */
export const isSuccessResponse = (response) => {
  return response?.success === true || response?.status === 'success' || response?.data?.success === true;
};

export default {
  extractArray,
  getNestedValue,
  normalizeResponseData,
  safeFallback,
  isSuccessResponse
};
