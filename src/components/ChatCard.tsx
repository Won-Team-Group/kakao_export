import React from 'react';
import { ExternalLink, Tag } from 'lucide-react';
// import { format } from 'date-fns';
// import { ko } from 'date-fns/locale';
import { ChatMessage } from '../types';

interface ChatCardProps {
  message: ChatMessage;
}

export const ChatCard: React.FC<ChatCardProps> = ({ message }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="flex p-4 gap-4">
        {/* Thumbnail */}
        <div className="w-48 h-32 flex-shrink-0">
          {message.thumbnail ? (
            <img
              src={message.thumbnail}
              alt={message.title}
              className="w-full h-full object-cover rounded-lg"
            />
          ) : (
            <div className="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center">
              <ExternalLink className="w-8 h-8 text-gray-400" />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
              {message.title}
            </h3>
            <a
              href={message.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:text-blue-600 flex-shrink-0">
              <ExternalLink className="w-5 h-5" />
            </a>
          </div>

          <div className="mt-1 flex items-center gap-2 text-sm text-gray-600">
            {/* <time dateTime={message.createdAt.toISOString()}>
              {format(message.createdAt, 'PPP', { locale: ko })}
            </time> */}
            {message.source && (
              <>
                <span>•</span>
                <span>{message.source}</span>
              </>
            )}
          </div>

          {message.description && (
            <p className="mt-2 text-sm text-gray-700 line-clamp-2">
              {message.description}
            </p>
          )}

          <div className="mt-3 flex flex-wrap gap-2">
            {message.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs
                         bg-blue-100 text-blue-700">
                <Tag className="w-3 h-3" />
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
