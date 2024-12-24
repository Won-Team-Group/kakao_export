export interface ChatMessage {
  id: string;
  type: 'link' | 'memo';
  thumbnail?: string;
  title: string;
  createdAt: Date;
  tags: string[];
  source?: string;
  content: string;
  description?: string;
  url?: string;
}

export interface WaitlistFormData {
  email: string;
}
