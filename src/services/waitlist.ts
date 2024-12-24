import { API_CONFIG } from '../config/api';

export const submitToWaitlist = async (data: {
  name: string;
  email: string;
}): Promise<void> => {
  const response = await fetch(`${API_CONFIG.baseUrl}/api/waitlist`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  //   console.log('submit response', response);

  if (!response.ok) {
    throw new Error(`Failed to submit to waitlist: ${response.statusText}`);
  }
  return await response.json();
};
