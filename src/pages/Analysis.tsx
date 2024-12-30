import React, { useState, useEffect, useMemo } from 'react';
import { MessageSquareText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { WaitlistBanner } from '../components/WaitlistBanner';
import { TagList } from '../components/TagList';
import { ChatCard } from '../components/ChatCard';
import { ChatMessage } from '../types';
// import { generateTagSummary } from '../utils/openai';
import { removeDuplicateLinks } from '../utils/linkProcessing';

export const Analysis: React.FC = () => {
  const navigate = useNavigate();
  const [selectedTag, setSelectedTag] = useState('all');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isSample, setSample] = useState(false);
  // const [tagSummary, setTagSummary] = useState<string>('');
  // const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    try {
      const storedMessages = sessionStorage.getItem('chatMessages');
      const sampleMessages = sessionStorage.getItem('sampleMessages');
      if (!storedMessages) {
        if (sampleMessages) {
          setMessages(JSON.parse(sampleMessages));
          setSample(true);
          setError('');
          return;
        }
        navigate('/');
        return;
      }

      const parsedMessages = JSON.parse(storedMessages);
      if (!Array.isArray(parsedMessages) || parsedMessages.length === 0) {
        setError('메시지를 찾을 수 없습니다.');
        return;
      }

      // Convert stored date strings back to Date objects
      const processedMessages = removeDuplicateLinks(
        parsedMessages.map((message) => ({
          ...message,
          createdAt: new Date(message.createdAt),
        }))
      ).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

      setMessages(processedMessages);
      setError('');
    } catch (err) {
      console.error('Error loading messages:', err);
      setError('메시지를 불러오는 중 오류가 발생했습니다.');
    }
  }, [navigate]);

  // Calculate tag counts and sort by frequency
  const tagStats = useMemo(() => {
    const stats = new Map<string, number>();
    messages.forEach((message) => {
      message.tags.forEach((tag: string) => {
        stats.set(tag, (stats.get(tag) || 0) + 1);
      });
    });
    return Array.from(stats.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([name, count]) => ({ name, count }));
  }, [messages]);

  const filteredMessages = useMemo(() => {
    return selectedTag === 'all'
      ? messages
      : messages.filter((message) => message.tags.includes(selectedTag));
  }, [messages, selectedTag]);

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            처음으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <MessageSquareText className="w-10 h-10 text-blue-500" />
            {isSample ? (
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  샘플 데이터 분석
                </h1>
                <p className="text-gray-600">
                  처리할 데이터가 없어서 샘플로 보여드려요!
                </p>
              </div>
            ) : (
              <h1 className="text-3xl font-bold text-gray-900">
                채팅 내용 분석
              </h1>
            )}
          </div>
        </div>

        <WaitlistBanner />

        <TagList
          tags={tagStats}
          selectedTag={selectedTag}
          onTagSelect={setSelectedTag}
        />

        {/* {loading ? (
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center justify-center gap-3">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
              <p className="text-blue-800">태그 내용을 요약하고 있습니다...</p>
            </div>
          </div>
        ) : (
          tagSummary && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">
                {selectedTag} 태그 요약
              </h3>
              <p className="text-blue-800">{tagSummary}</p>
            </div>
          )
        )} */}

        <div className="mt-8 space-y-4">
          {' '}
          {/* grid 대신 space-y 사용 */}
          {filteredMessages.length > 0 ? (
            filteredMessages.map((message) => (
              <ChatCard key={message.id} message={message} />
            ))
          ) : (
            <div className="text-center py-12 text-gray-500">
              해당 태그의 메시지가 없습니다.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
