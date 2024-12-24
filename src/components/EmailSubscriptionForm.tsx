import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { submitToWaitlist } from '../services/waitlist';

export const EmailSubscriptionForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await submitToWaitlist({ name, email });
      setName('');
      setEmail('');
      alert('Waitlist 등록이 완료되었습니다!');
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('등록 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="이름"
        required
        className="px-4 py-2 rounded-lg text-gray-900 placeholder-gray-500 
                   border border-transparent focus:border-blue-300 focus:ring-2 
                   focus:ring-blue-300 focus:outline-none transition-colors"
      />
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="이메일 주소"
        required
        className="px-4 py-2 rounded-lg text-gray-900 placeholder-gray-500 
                   border border-transparent focus:border-blue-300 focus:ring-2 
                   focus:ring-blue-300 focus:outline-none transition-colors"
      />

      <button
        type="submit"
        disabled={submitting}
        className="px-6 py-2 bg-white text-blue-600 rounded-lg font-medium 
                   hover:bg-blue-50 transition-colors flex items-center justify-center gap-2 
                   disabled:opacity-50 disabled:cursor-not-allowed">
        <Send className="w-4 h-4" />
        {submitting ? '등록중...' : '등록하기'}
      </button>
    </form>
  );
};
