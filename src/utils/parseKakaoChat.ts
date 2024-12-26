import { ChatMessage } from '../types';
import {
  parseKakaoDate,
  // parseKakaoTime,
  // isValidDateRange,
  // shouldSkipDate,
} from './date';
// import { extractUrlInfo } from './url';
import { processLinkMessage } from '../services/linkService';

export const parseKakaoChat = async (
  fileContent: string
): Promise<ChatMessage[]> => {
  const lines = fileContent.split('\n');
  const messages: ChatMessage[] = [];
  const processedUrls = new Set<string>(); // URL 중복 제거를 위한 Set
  let shouldProcessMessages = false; // 2024년 10월 이후 메시지 처리 여부

  for (const line of lines) {
    if (!line.trim() || line.includes('사진') || line.includes('삭제된 메시지'))
      continue;

    // 날짜 체크
    const dateMatch = line.match(/\d{4}[년.]\s*\d{1,2}[월.]\s*\d{1,2}[일.]/);
    if (dateMatch) {
      const date = parseKakaoDate(dateMatch[0]);
      if (date) {
        // 2024년 10월 이후 메시지 체크
        if (date.getFullYear() === 2024 && date.getMonth() >= 9) {
          // 10월은 index가 9
          shouldProcessMessages = true;
        } else if (shouldProcessMessages) {
          // 이미 2024년 10월 이후 메시지를 찾았는데 이전 날짜가 나오면 처리 중단
          break;
        }
      }
      continue;
    }

    if (!shouldProcessMessages) continue;

    // URL 추출
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const urls = line.match(urlRegex);
    if (urls) {
      for (const url of urls) {
        if (!processedUrls.has(url)) {
          processedUrls.add(url);
          try {
            const message = await processLinkMessage(
              line,
              url,
              'URL', // 기본 소스값
              new Date() // 현재 시간으로 대체
            );
            messages.push(message);
          } catch (error) {
            console.error('Error processing link message:', error);
          }
        }
      }
    }
  }

  return messages;
};
