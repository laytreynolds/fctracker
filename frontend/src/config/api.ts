// API configuration using Vite environment variables
const API_CONFIG = {
  development: {
    baseURL: import.meta.env.VITE_API_BASE_URL,
  },
  production: {
    baseURL: import.meta.env.VITE_API_BASE_URL,
  },
};

// Get current environment
const environment = import.meta.env.MODE;

// Export the appropriate config
export const API_BASE_URL = API_CONFIG[environment as keyof typeof API_CONFIG]?.baseURL || API_CONFIG.development.baseURL;

// Helper function to build full API URLs
export const buildApiUrl = (endpoint: string): string => {
  return `${API_BASE_URL}${endpoint}`;
};

// Authenticated fetch wrapper — attaches the JWT token from localStorage
export const authFetch = (endpoint: string, options: RequestInit = {}): Promise<Response> => {
  const token = localStorage.getItem('fctracker_token');
  const headers = new Headers(options.headers);
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  return fetch(buildApiUrl(endpoint), { ...options, headers });
};

// App configuration
export const APP_CONFIG = {
  name: import.meta.env.VITE_APP_NAME,
  version: import.meta.env.VITE_APP_VERSION,
  environment: environment,
};