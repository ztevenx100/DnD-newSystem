export const APP_CONFIG = {
  name: 'DnD Game System',
  version: '1.0.0',
  api: {
    baseUrl: process.env.VITE_API_URL || 'http://localhost:3000',
    timeout: 5000,
  },
  features: {
    enableDebug: process.env.NODE_ENV === 'development',
  },
}; 