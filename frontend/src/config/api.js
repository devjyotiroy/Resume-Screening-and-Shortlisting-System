// API Configuration
// Centralized API URL management

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
const ML_SERVICE_URL = process.env.REACT_APP_ML_SERVICE_URL || 'http://localhost:5001';

// API Endpoints
export const API_ENDPOINTS = {
  // Resume endpoints
  UPLOAD_RESUME: `${API_BASE_URL}/api/resume/upload`,
  GET_ALL_RESUMES: `${API_BASE_URL}/api/resume/all`,
  GET_RESUME: (id) => `${API_BASE_URL}/api/resume/${id}`,
  DELETE_RESUME: (id) => `${API_BASE_URL}/api/resume/${id}`,
  GET_STATS: `${API_BASE_URL}/api/resume/stats/summary`,
  
  // Health check
  HEALTH: `${API_BASE_URL}/health`,
};

// Export base URLs
export const BASE_URL = API_BASE_URL;
export const ML_URL = ML_SERVICE_URL;

// Helper function to check if API is available
export const checkAPIHealth = async () => {
  try {
    const response = await fetch(API_ENDPOINTS.HEALTH);
    const data = await response.json();
    return data.status === 'ok';
  } catch (error) {
    console.error('API Health Check Failed:', error);
    return false;
  }
};

// Log current configuration (only in development)
if (process.env.NODE_ENV === 'development') {
  console.log('🔧 API Configuration:');
  console.log('   Backend URL:', API_BASE_URL);
  console.log('   ML Service URL:', ML_SERVICE_URL);
  console.log('   Environment:', process.env.NODE_ENV);
}

export default API_ENDPOINTS;
