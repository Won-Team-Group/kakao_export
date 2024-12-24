import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ScrollButtonProps {
  direction: 'left' | 'right';
  onClick: () => void;
}

export const ScrollButton: React.FC<ScrollButtonProps> = ({
  direction,
  onClick,
}) => {
  const Icon = direction === 'left' ? ChevronLeft : ChevronRight;
  const position = direction === 'left' ? 'left-0' : 'right-0';

  return (
    <button
      onClick={onClick}
      className={`absolute ${position} top-1/2 -translate-y-1/2 z-10 
                  bg-white/80 p-1.5 rounded-full shadow-sm hover:bg-white 
                  transition-colors`}>
      <Icon className="w-4 h-4 text-gray-600" />
    </button>
  );
};
