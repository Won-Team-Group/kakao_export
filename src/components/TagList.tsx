import React, { useRef } from 'react';
import { ScrollButton } from './ScrollButton';
import { Tag } from './Tag';

interface TagListProps {
  tags: { name: string; count: number }[];
  selectedTag: string;
  onTagSelect: (tag: string) => void;
}

export const TagList: React.FC<TagListProps> = ({
  tags,
  selectedTag,
  onTagSelect,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 200;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="relative">
      <ScrollButton direction="left" onClick={() => scroll('left')} />

      <div
        ref={scrollRef}
        className="flex gap-2 overflow-x-auto scrollbar-hide py-2 px-8"
        style={{
          whiteSpace: 'nowrap',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}>
        <Tag
          name="all"
          label="ALL"
          isSelected={selectedTag === 'all'}
          onClick={() => onTagSelect('all')}
        />

        {tags.map(({ name, count }) => (
          <Tag
            key={name}
            name={name}
            label={name}
            count={count}
            isSelected={selectedTag === name}
            onClick={() => onTagSelect(name)}
          />
        ))}
      </div>

      <ScrollButton direction="right" onClick={() => scroll('right')} />
    </div>
  );
};
