import React from 'react';

const SkeletonCard: React.FC = () => {
  return (
    <div className="w-full bg-gray-200 animate-pulse rounded-lg h-64">
      <div className="h-40 bg-gray-300 rounded-t-lg"></div>
        <div className="p-4">
         <div className="h-4 bg-gray-300 rounded mb-2"></div>
         <div className="h-4 bg-gray-300 rounded w-1/2"></div>
      </div>
    </div>
  );
};

export default SkeletonCard;