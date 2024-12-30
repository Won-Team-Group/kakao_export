import { ChatMessage } from '../types';
import { fetchLinkMetadata } from '../utils/linkMetadata';
import { generateTags } from '../utils/linkOpenai';
import { extractUrlInfo } from '../utils/url';

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const fetchMetadataWithRetry = async (
  url: string,
  retries = MAX_RETRIES
): Promise<any> => {
  try {
    return await fetchLinkMetadata(url);
  } catch (error) {
    console.log(error);
    if (retries > 0) {
      await sleep(RETRY_DELAY);
      return fetchMetadataWithRetry(url, retries - 1);
    }
    return null;
  }
};

export const processLinkMessage = async (
  content: string,
  url: string,
  source: string,
  timestamp: Date
): Promise<ChatMessage> => {
  try {
    const metadata = await fetchMetadataWithRetry(url);
    const urlInfo = extractUrlInfo(url);

    // Fallback chain for title
    const title = metadata?.title || urlInfo?.title || source || '제목 없음';
    const finalSource = urlInfo?.source || source || new URL(url).hostname;
    // const finalSource = urlInfo?.source || source || new URL(url).hostname;
    // title = generateTitle(title);
    // Generate tags from available content
    const contentForTags = [
      title,
      metadata?.description,
      metadata?.keywords?.join(' '),
      content,
    ]
      .filter(Boolean)
      .join(' ');

    const tags = await generateTags(contentForTags);

    return {
      id: crypto.randomUUID(),
      type: 'link',
      createdAt: timestamp,
      content,
      url,
      source: finalSource,
      title: metadata?.title || '제목 없음',
      description: metadata?.description || '',
      thumbnail: metadata?.thumbnail || '',
      tags: tags.length > 0 ? tags : ['기타'],
    };
  } catch (error) {
    console.error('error processing link message:', error);
    return {
      id: crypto.randomUUID(),
      type: 'link',
      createdAt: timestamp,
      content,
      url,
      source,
      title: source || '제목 없음',
      tags: ['기타'],
    };
  }
};
