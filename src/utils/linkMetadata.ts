import { API_CONFIG } from '../config/api';

interface LinkMetadata {
  title: string;
  description: string;
  thumbnail: string;
}

export const fetchLinkMetadata = async (
  url: string
): Promise<LinkMetadata | null> => {
  try {
    const response = await fetch(
      `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.metadata}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      }
    );

    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.error('Error fetching metadata:', error);
    return null;
  }
};
