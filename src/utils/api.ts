const API_BASE_URL = 'http://localhost:3000/api';

// export const generateTitle = async (content: string): Promise<string> => {
//   const response = await fetch(`${API_BASE_URL}/openai/generate-title`, {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify({ content }),
//   });

//   if (!response.ok) {
//     throw new Error('Failed to generate title');
//   }

//   const data = await response.json();
//   return data.title;
// };

export const generateTags = async (content: string): Promise<string[]> => {
  const response = await fetch(`${API_BASE_URL}/openai/generate-tags`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ content }),
  });

  if (!response.ok) {
    throw new Error('Failed to generate tags');
  }

  const data = await response.json();
  return data.tags;
};

// export const generateTagSummary = async (messages: string[]): Promise<string> => {
//   const response = await fetch(`${API_BASE_URL}/openai/generate-summary`, {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify({ messages }),
//   });

//   if (!response.ok) {
//     throw new Error('Failed to generate summary');
//   }

//   const data = await response.json();
//   return data.summary;
// };
