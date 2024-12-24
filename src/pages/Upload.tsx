import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileUpload } from '../components/FileUpload';
import { MessageSquareText } from 'lucide-react';
import { parseKakaoChat } from '../utils/parseKakaoChat';
// import { generateTitle, generateTags } from '../utils/openai';
import { ChatMessage } from '../types';

export const Upload: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const handleFileSelect = async (file: File) => {
    try {
      setLoading(true);
      setError('');

      const content = await file.text();
      const messages = await parseKakaoChat(content);

      if (!messages || messages.length === 0) {
        setError(
          '처리할 수 있는 메시지가 없습니다. 2024년 11~12월 메시지만 처리됩니다.'
        );
        return;
      }

      // Store messages in sessionStorage
      sessionStorage.setItem('chatMessages', JSON.stringify(messages));
      navigate('/analysis');
    } catch (error) {
      console.error('Error processing file:', error);
      setError('파일 처리 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <MessageSquareText className="w-10 h-10 text-blue-500" />
            <h1 className="text-3xl font-bold text-gray-900">
              카카오톡 링크 모아보기
            </h1>
          </div>
          <p className="text-lg text-gray-600">
            카카오톡 나에게 보내기 채팅 내용을 분석하고 태그로 분류해드립니다.
          </p>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-center">{error}</p>
          </div>
        )}

        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">파일을 분석하고 있습니다...</p>
          </div>
        ) : (
          <FileUpload onFileSelect={handleFileSelect} />
        )}

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>카카오톡 채팅방에서 내보내기한 .txt 파일만 지원됩니다.</p>
          <p>2024년 11월~12월 채팅 내용만 분석됩니다.</p>
        </div>
        <div className="flex justify-center items-center p-4 b-white-100">
          <img
            src="/images/screenshot.png" // 실제 이미지 경로
            alt="하단 이미지"
            className="w-120 h-auto" // 적절한 크기로 조정
          />
        </div>
      </div>
    </div>
  );
};
