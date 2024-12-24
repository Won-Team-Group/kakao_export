import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

export const generateTitle = async (content: string): Promise<string> => {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content:
            'Generate a concise title (max 50 characters) in Korean for the given content. Focus on the main topic or theme.',
        },
        {
          role: 'user',
          content: `Content to summarize: ${content}`,
        },
      ],
      temperature: 0.7,
      max_tokens: 50,
    });

    return response.choices[0].message.content?.trim() || '제목 없음';
  } catch (error) {
    console.error('Error generating title:', error);
    return '제목 없음';
  }
};

export const generateTags = async (content: string): Promise<string[]> => {
  console.log('OPENAI KEY', openai.apiKey);
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content:
            'Analyze the title, description, and content(html "body" or "article" tag) of the link to create 2-3 suitable tags. The generated tags should be written in the same language as the content language as much as possible. Examples: "프로그래밍", "AI", "디자인", etc. Return only the tags separated by commas, without any additional text.',
        },
        {
          role: 'user',
          content: `Please analyze the following content to generate tags: ${content}`,
        },
      ],
      temperature: 0.7,
      max_tokens: 50,
    });
    console.log('태그원', response);

    const tags =
      response.choices[0].message.content
        ?.split(',')
        .map((tag) => tag.trim()) || [];
    console.log('태그', tags);
    return tags.length > 0 ? tags : ['기타'];
  } catch (error) {
    console.error('Error generating tags:', error);
    return ['기타'];
  }
};

export const generateTagSummary = async (
  messages: string[]
): Promise<string> => {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content:
            'Analyze the given messages and provide a 2-3 sentence summary in Korean focusing on common themes and insights.',
        },
        {
          role: 'user',
          content: `Analyze these messages:\n${messages.join('\n\n')}`,
        },
      ],
      temperature: 0.7,
      max_tokens: 150,
    });

    return response.choices[0].message.content?.trim() || '';
  } catch (error) {
    console.error('Error generating summary:', error);
    return '요약을 생성할 수 없습니다.';
  }
};
