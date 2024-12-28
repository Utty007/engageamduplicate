import React from 'react';

const SingleCardSkeleton = () => (
  <div className="border w-full min-w-[330px] border-[#E4E4E7] shadow shadow-[#0000000D] rounded-lg flex flex-col gap-6 p-6">
    <div className="flex gap-2 items-center">
      <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse" />
      <div className="flex flex-col gap-1">
        <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
        <div className="h-3 w-20 bg-gray-200 rounded animate-pulse" />
      </div>
    </div>

    <div className="flex flex-col gap-2">
      <div className="h-5 w-3/4 bg-gray-200 rounded animate-pulse" />
      <div className="h-4 w-1/2 bg-gray-200 rounded animate-pulse" />
      <div className="h-4 w-2/3 bg-gray-200 rounded animate-pulse" />
    </div>

    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
          <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
        </div>
        <div className="h-2 w-full bg-gray-200 rounded animate-pulse" />
      </div>
    </div>

    <div className="h-10 w-[280px] bg-gray-200 rounded animate-pulse" />
  </div>
);

const EngagementCardSkeleton = ({ count = 6, }) => {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6 lg:gap-4 2xl:gap-6">
      {Array(count)
        .fill(0)
        .map((_, index) => (
          <SingleCardSkeleton key={index} />
        ))}
    </div>
  );
};

export default EngagementCardSkeleton;
