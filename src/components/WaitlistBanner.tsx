import React from 'react';
import { EmailSubscriptionForm } from './EmailSubscriptionForm';

export const WaitlistBanner: React.FC = () => {
  return (
    <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-lg shadow-lg mb-8">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex-1 md:text-left text-center">
          <h3 className="text-xl font-bold mb-2">앱 출시 준비중!</h3>
          <p className="text-white/90 leading-relaxed">
            더 나은 경험을 위한 서비스를 준비하고 있습니다. Waitlist에
            등록하시면 가장 먼저 혜택 받으실 수 있어요.
          </p>
        </div>
        <div className="flex-1">
          <EmailSubscriptionForm />
        </div>
      </div>
    </div>
  );
};
