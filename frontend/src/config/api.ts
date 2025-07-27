// API configuration using Vite environment variables
const API_CONFIG = {
  development: {
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',
  },
  production: {
    baseURL: import.meta.env.VITE_API_BASE_URL || 'https://fctracker-backend-1055102418750.europe-west1.run.app',
  },
};

// Get current environment
const environment = import.meta.env.MODE || 'development';

// Export the appropriate config
export const API_BASE_URL = API_CONFIG[environment as keyof typeof API_CONFIG]?.baseURL || API_CONFIG.development.baseURL;

// Helper function to build full API URLs
export const buildApiUrl = (endpoint: string): string => {
  return `${API_BASE_URL}${endpoint}`;
};

// App configuration
export const APP_CONFIG = {
  name: import.meta.env.VITE_APP_NAME || 'FC Tracker',
  version: import.meta.env.VITE_APP_VERSION || '1.0.0',
  environment: environment,
};