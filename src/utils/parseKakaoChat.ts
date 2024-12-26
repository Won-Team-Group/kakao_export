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
    if (!line.trim() || line.includes('사진')) continue;
    const regexDateLine = /\d{4}[년.]\s?\d{1,2}[월.]\s?\d{1,2}[일.]/;
    // Check for date headers
    if (line.includes('---------------')) {
      const date = parseKakaoDate(line);
      // console.log('First Format Date:', date);
      if (date && isValidDateRange(date)) {
        currentDate = date;
        currentSender = null; // Reset sender
        currentTimestamp = null; // Reset timestamp
        currentContent = []; // Clear content buffer
      } else {
        currentDate = null;
      }
      continue;
    } else if (regexDateLine.test(line)) {
      const dateMatch = line.match(regexDateLine);
      console.log('secodn', dateMatch);
      if (dateMatch) {
        const date = parseKakaoDate(dateMatch[0]);
        console.log('seconddate', date);
        if (date && isValidDateRange(date)) {
          console.log('currentDate', currentDate);
          currentDate = date;
          currentSender = null; // Reset sender
          currentTimestamp = null; // Reset timestamp
          currentContent = []; // Clear content buffer
        } else {
          currentDate = null;
        }
      }
      continue;
    }
    if (!currentDate || !isValidDateRange(currentDate))
      // Skip if no valid date is set
      continue;
    const firstFormatRegex =
      /^\[(.*?)\]\s+\[(오전|오후)\s*(\d{1,2}):(\d{2})\]\s+(.*)/;
    const firstMatch = line.match(firstFormatRegex);
    if (firstMatch) {
      const [_, sender, period, hour, minute, content] = firstMatch;

      const timestamp = parseKakaoTime(
        `${period} ${hour}:${minute}`,
        currentDate
      );
      if (timestamp) {
        // Process buffered content if exists
        if (currentContent.length > 0 && currentSender && currentTimestamp) {
          await processUrls(
            currentContent.join('\n'),
            currentSender,
            currentTimestamp
          );
        }
        // Update sender, timestamp, and reset content buffer
        currentSender = sender;
        currentTimestamp = timestamp;
        currentContent = [content];
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
          // Process buffered content if exists
          if (currentContent.length > 0 && currentSender && currentTimestamp) {
            await processUrls(
              currentContent.join('\n'),
              currentSender,
              currentTimestamp
            );
          }
          // Update sender, timestamp, and reset content buffer
          currentSender = sender;
          currentTimestamp = timestamp;
          currentContent = [content];
        }
      }
      continue;
    }
    // Process standalone or multiline URLs
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const urls = line.match(urlRegex);
    if (urls && currentSender && currentTimestamp) {
      currentContent.push(line.trim());
    }
  }
  // Process remaining buffered content
  if (currentContent.length > 0 && currentSender && currentTimestamp) {
    await processUrls(
      currentContent.join('\n'),
      currentSender,
      currentTimestamp
    );
  }
  return messages;
};
