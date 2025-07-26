// API configuration for different environments
const API_CONFIG = {
  development: {
    baseURL: 'http://localhost:8080',
  },
  production: {
    baseURL: 'https://fctracker.laytonreynolds.com', 
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