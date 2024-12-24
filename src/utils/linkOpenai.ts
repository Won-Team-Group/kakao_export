import { API_CONFIG } from '../config/api';

export const generateTitle = async (content: string): Promise<string> => {
  try {
    const response = await fetch(
      `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.openai.generateTitle}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content }),
      }
    );

    if (!response.ok) {
      throw new Error('Failed to generate title');
    }

    const data = await response.json();
    return data.title || '';
  } catch (error) {
    console.error('Error generating title:', error);
    return '';
  }
};

export const generateTags = async (content: string): Promise<string[]> => {
  try {
    const response = await fetch(
      `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.openai.generateTags}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content }),
      }
    );

    if (!response.ok) {
      throw new Error('Failed to generate tags');
    }

    const data = await response.json();
    return data.tags || ['기타'];
  } catch (error) {
    console.error('Error generating tags:', error);
    return ['기타'];
  }
};
