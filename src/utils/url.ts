interface UrlInfo {
  url: string;
  source: string;
  title?: string;
}

export const extractUrlInfo = (url: string): UrlInfo | null => {
  try {
    const urlObj = new URL(url);
    const domain = urlObj.hostname;
    const source = domain
      .replace('www.', '')
      .split('.')
      .slice(0, -1)
      .join('.')
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

    // Try to extract a title from the path
    const pathSegments = urlObj.pathname.split('/').filter(Boolean);
    const lastSegment = pathSegments[pathSegments.length - 1];
    const title = lastSegment
      ? decodeURIComponent(lastSegment)
          .replace(/[-_]/g, ' ')
          .replace(/\.\w+$/, '') // Remove file extension
      : undefined;

    return { url, source, title };
  } catch {
    return null;
  }
};

export const fetchMetadata = async (url: string) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/metadata`,
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
