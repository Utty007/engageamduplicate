const TableSkeleton = () => (
  <div className="w-full rounded-lg overflow-x-auto">
    <div className="w-full border-grey-stroke border rounded-md">
      <div className="border-b">
        <div className="grid grid-cols-4 p-3">
          {/* Header skeleton */}
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-6 bg-gray-200 rounded animate-pulse" />
          ))}
        </div>
      </div>
      <div>
        {/* Row skeletons */}
        {[1, 2, 3, 4].map((row) => (
          <div key={row} className="grid grid-cols-4 p-3 border-b">
            {/* Username cell */}
            <div className="h-5 w-24 bg-gray-200 rounded animate-pulse" />
            {/* Type cell */}
            <div className="h-5 w-20 bg-gray-200 rounded animate-pulse" />
            {/* Status cell */}
            <div className="h-5 w-16 bg-gray-200 rounded animate-pulse" />
            {/* Action cell */}
            <div className="h-8 w-20 bg-gray-200 rounded animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default TableSkeleton;