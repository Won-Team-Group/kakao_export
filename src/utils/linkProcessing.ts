import { ChatMessage } from '../types';

// 중복 링크 제거 및 최신 데이터 유지
export const removeDuplicateLinks = (
  messages: ChatMessage[]
): ChatMessage[] => {
  const uniqueLinks = new Map<string, ChatMessage>();

  messages.forEach((message) => {
    if (message.url) {
      const existingMessage = uniqueLinks.get(message.url);
      if (!existingMessage || message.createdAt > existingMessage.createdAt) {
        uniqueLinks.set(message.url, message);
      }
    }
  });

  return Array.from(uniqueLinks.values());
};
