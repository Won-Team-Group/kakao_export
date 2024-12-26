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
  let currentSender: string | null = null;
  let currentTimestamp: Date | null = null;
  let currentContent: string[] = []; // Buffer to collect multiline content

  const processUrls = async (
    content: string,
    sender: string,
    timestamp: Date
  ) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const urls = content.match(urlRegex);
    if (!urls) return; // Skip if no URLs are found

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
  };

  for (const line of lines) {
    // Skip empty lines and photo messages
    if (!line.trim() || line.includes('사진') || line.includes('삭제된 메시지'))
      continue;

    // 날짜 형식 체크 (구분선이 있는 경우와 없는 경우 모두 처리)
    if (line.includes('---------------') || regexDateLine.test(line)) {
      const dateMatch = line.match(/\d{4}[년.]\s*\d{1,2}[월.]\s*\d{1,2}[일.]/);
      if (dateMatch) {
        const date = parseKakaoDate(dateMatch[0]);
        if (date && isValidDateRange(date)) {
          currentDate = date;
          currentSender = null;
          currentTimestamp = null;
          currentContent = [];
        }
      }
      continue;
    }

    // 첫 번째 형식: [발신자] [시간] 내용
    const firstFormatRegex =
      /^\[(.*?)\]\s+\[(오전|오후)\s*(\d{1,2}):(\d{2})\]\s*(.*)/;

    // 두 번째 형식: 날짜 시간, 발신자 : 내용
    const secondFormatRegex =
      /(\d{4}[년.]\s*\d{1,2}[월.]\s*\d{1,2}[일.]?)\s*(오전|오후)\s*(\d{1,2}):(\d{2}),\s*(.*?)\s*:\s*(.*)/;

    const firstMatch = line.match(firstFormatRegex);
    const secondMatch = line.match(secondFormatRegex);

    if (firstMatch || secondMatch) {
      // 이전 메시지의 내용 처리
      if (currentContent.length > 0 && currentSender && currentTimestamp) {
        await processUrls(
          currentContent.join('\n'),
          currentSender,
          currentTimestamp
        );
        currentContent = [];
      }

      if (firstMatch) {
        const [_, sender, period, hour, minute, content] = firstMatch;
        handleNewMessage(sender, period, hour, minute, content);
      } else if (secondMatch) {
        const [_, dateStr, period, hour, minute, sender, content] = secondMatch;
        const date = parseKakaoDate(dateStr);
        if (date && isValidDateRange(date)) {
          currentDate = date;
          handleNewMessage(sender, period, hour, minute, content);
        }
      }
    } else if (currentSender && currentTimestamp) {
      // 멀티라인 메시지 처리
      currentContent.push(line.trim());
    }
  }

  // 마지막 메시지 처리
  if (currentContent.length > 0 && currentSender && currentTimestamp) {
    await processUrls(
      currentContent.join('\n'),
      currentSender,
      currentTimestamp
    );
  }

  return messages;

  // 헬퍼 함수
  function handleNewMessage(
    sender: string,
    period: string,
    hour: string,
    minute: string,
    content: string
  ) {
    if (currentDate) {
      const timestamp = parseKakaoTime(
        `${period} ${hour}:${minute}`,
        currentDate
      );
      if (timestamp) {
        currentSender = sender;
        currentTimestamp = timestamp;
        currentContent = [content];
      }
    }
  }
};
