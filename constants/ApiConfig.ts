import Constants from 'expo-constants';

// Get API base URL from environment variables
export const API_BASE_URL = Constants.expoConfig?.extra?.API_BASE_URL || 'http://localhost:5000';

// API endpoints
export const API_ENDPOINTS = {
  LOGIN: `${API_BASE_URL}/api/auth/login`,
  SIGNUP: `${API_BASE_URL}/api/auth/signup`,
  REFRESH_TOKEN: `${API_BASE_URL}/api/auth/refresh-token`,
  REPORTS: `${API_BASE_URL}/api/reports`,
  REPORTS_DELETE: (id: string) => `${API_BASE_URL}/api/reports/${id}`,
};

// Development helper
export const IS_DEVELOPMENT = __DEV__;

console.log('API Configuration:', {
  API_BASE_URL,
  IS_DEVELOPMENT,
});
