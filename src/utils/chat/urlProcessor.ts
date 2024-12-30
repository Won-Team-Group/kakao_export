// import { ChatMessage } from '../../types';
// import { extractUrlInfo } from '../url';
// import { processLinkMessage } from '../../services/linkService';

// export async function processUrls(
//   content: string,
//   sender: string,
//   timestamp: Date
// ): Promise<ChatMessage[]> {
//   const messages: ChatMessage[] = [];
//   const urlRegex = /(https?:\/\/[^\s]+)/g;
//   const urls = content.match(urlRegex);

//   if (!urls) return messages;

//   for (const url of urls) {
//     const urlInfo = extractUrlInfo(url);
//     const source = urlInfo?.source || sender;

//     try {
//       const message = await processLinkMessage(content, url, source, timestamp);
//       messages.push(message);
//     } catch (error) {
//       console.error('Error processing link message:', error);
//     }
//   }

//   return messages;
// }
