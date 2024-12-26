import { ChatMessage } from '../types';
import {
  parseKakaoDate,
  parseKakaoTime,
  isValidDateRange,
  shouldSkipDate,
} from './date';
import { extractUrlInfo } from './url';
import { processLinkMessage } from '../services/linkService';

export const parseKakaoChat = async (
  fileContent: string
): Promise<ChatMessage[]> => {
  const lines = fileContent.split('\n');
  const messages: ChatMessage[] = [];
  // let currentMessage: Partial<ChatMessage> | null = null;
  // let currentDate: Date | null = null;
  let currentDate: Date | null = null;

  const processUrls = async (
    content: string,
    sender: string,
    timestamp: Date
  ) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const urls = content.match(urlRegex);
    if (urls) {
      for (const url of urls) {
        const urlInfo = extractUrlInfo(url);
        const source = urlInfo?.source || sender;

        try {
          const message = await processLinkMessage(
            content,
            url,
            source,
            timestamp
          );
          messages.push(message);
        } catch (error) {
          console.error('Error processing link message:', error);
        }
      }
    }
  };

  for (const line of lines) {
    // Skip empty lines and photo messages
    if (!line.trim() || line.includes('사진')) continue;

    // Check for date headers
    if (line.includes('---------------')) {
      const date = parseKakaoDate(line);
      console.log('First Format Date:', date);
      if (date) {
        // 2024년 9월 이전 데이터면 스킵
        if (shouldSkipDate(date)) {
          currentDate = null;
          continue;
        }

        if (isValidDateRange(date)) {
          currentDate = date;
        } else {
          currentDate = null;
        }
      }
      continue;
    }

    const firstFormatRegex =
      /^\[(.*?)\]\s+\[(오전|오후)\s*(\d{1,2}):(\d{2})\]\s+(.*)/;
    const firstMatch = line.match(firstFormatRegex);
    if (firstMatch) {
      const [_, sender, period, hour, minute, content] = firstMatch;
      if (!currentDate) continue;
      const timestamp = parseKakaoTime(
        `${period} ${hour}:${minute}`,
        currentDate
      );
      if (timestamp) {
        await processUrls(content, sender, timestamp);
      }
      continue;
    }

    const secondFormatRegex =
      /(\d{4}[년.\s]+\d{1,2}[월.\s]+\d{1,2}[일.]?)\s+(오전|오후)\s*(\d{1,2}):(\d{2}),\s*(.*?):\s+(.*)/;
    const secondMatch = line.match(secondFormatRegex);
    console.log('secondMatch ', secondMatch);
    if (secondMatch) {
      const [_, dateStr, period, hour, minute, sender, content] = secondMatch;
      const date = parseKakaoDate(dateStr);
      console.log('seconddate', date);
      if (date && isValidDateRange(date)) {
        const timestamp = parseKakaoTime(`${period} ${hour}:${minute}`, date);
        if (timestamp) {
          await processUrls(content, sender, timestamp);
        }
      }
      continue;
    }
  }
  return messages;
};
