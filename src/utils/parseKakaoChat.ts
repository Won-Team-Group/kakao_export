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
  let currentMessage: Partial<ChatMessage> | null = null;
  let currentDate: Date | null = null;

  for (const line of lines) {
    // Skip empty lines and photo messages
    if (!line.trim() || line.includes('사진')) continue;

    // Check for date headers
    const dateRegex =
      /(\d{4}[년.]\s?\d{1,2}[월.]\s?\d{1,2}[일.]?(?:\s(월요일|화요일|수요일|목요일|금요일|토요일|일요일))?)/;
    if (line.includes('---------------') || dateRegex.test(line)) {
      const dateMatch = line.match(dateRegex);
      console.log('dateMatch', dateMatch);
      if (dateMatch) {
        const date = parseKakaoDate(dateMatch[0]); // Extract the full date string
        console.log('date', date);
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
    }

    // Skip if no valid date is set
    if (!currentDate || !isValidDateRange(currentDate)) continue;

    // Check for message with timestamp
    const timeMatch = line.match(/(오전|오후)\s*\d{1,2}:\d{2}/);
    if (timeMatch) {
      // Save previous message if exists
      if (currentMessage?.content) {
        messages.push(currentMessage as ChatMessage);
      }

      const timestamp = parseKakaoTime(line, currentDate);
      if (!timestamp) continue;

      // Extract content after timestamp
      const content = line
        .substring(line.indexOf(timeMatch[0]) + timeMatch[0].length)
        .trim();
      const urlMatch = content.match(/(https?:\/\/[^\s]+)/);

      if (urlMatch) {
        const urlInfo = extractUrlInfo(urlMatch[1]);
        if (urlInfo) {
          currentMessage = await processLinkMessage(
            content,
            urlInfo.url,
            urlInfo.source,
            timestamp
          );
        }
      }
    } else if (currentMessage) {
      // Append content for multiline messages
      currentMessage.content += '\n' + line.trim();
    }
  }

  // Add the last message if exists
  if (currentMessage?.content) {
    messages.push(currentMessage as ChatMessage);
  }

  console.log('Total messages found:', messages.length); // Debug log
  return messages.filter((message) => message.type === 'link');
};
