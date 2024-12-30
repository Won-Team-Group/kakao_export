// API configuration
export const API_CONFIG = {
  baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  endpoints: {
    metadata: '/api/metadata',
    openai: {
      generateTags: '/api/openai/generate-tags',
      // generateTitle: '/api/openai/generate-title',
      // generateSummary: '/api/openai/generate-summary',
    },
  },
};
