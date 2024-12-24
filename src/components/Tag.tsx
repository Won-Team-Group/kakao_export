import React from 'react';
import { Tag as TagIcon } from 'lucide-react';

interface TagProps {
  name: string;
  label: string;
  count?: number;
  isSelected: boolean;
  onClick: () => void;
}

export const Tag: React.FC<TagProps> = ({
  name,
  label,
  count,
  isSelected,
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
        isSelected
          ? 'bg-blue-500 text-white'
          : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
      }`}>
      {label}
      {count !== undefined && (
        <span className={`${isSelected ? 'text-white' : 'text-gray-500'}`}>
          ({count})
        </span>
      )}
    </button>
  );
};
