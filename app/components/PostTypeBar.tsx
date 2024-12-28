'use client';
import React, { useState } from 'react';

type PostType = {
  label: string;
  count: number;
};

interface PostTypesBarProps {
  postTypes: PostType[];
  defaultActive?: string;
  onPostTypeChange?: (activeType: string) => void;
}

const PostTypesBar = ({
  postTypes,
  defaultActive = 'Active',
  onPostTypeChange,
}: PostTypesBarProps) => {
  const [activeType, setActiveType] = useState<string>(defaultActive);

  const handleClick = (type: string) => {
    setActiveType(type);
    if (onPostTypeChange) {
      onPostTypeChange(type);
    }
  };

  return (
    <div className="flex border border-grey-stroke divide-x divide-grey-stroke rounded-md w-fit overflow-hidden">
      {postTypes.map(({ label, count }) => (
        <button
          key={label}
          className={`p-1 sm:p-2 text-black text-xs sm:text-sm font-medium flex justify-between items-center ${
            activeType === label ? 'bg-primary/20' : 'bg-white'
          }`}
          onClick={() => handleClick(label)}
        >
          <span>{label}</span>
          <span className='hidden sm:block'>({count})</span>
        </button>
      ))}
    </div>
  );
};

export default PostTypesBar;
