import React from 'react';

const SkeletonLoader = ({ 
  type = 'card', 
  count = 1, 
  className = '' 
}) => {
  const getResponsiveClasses = () => {
    return {
      card: 'bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6',
      stat: 'bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6',
      table: 'bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6'
    };
  };

  const renderSkeleton = () => {
    switch (type) {
      case 'card':
        return (
          <div className={`bg-white rounded-xl shadow-sm border border-gray-200 p-6 ${className}`}>
            <div className="animate-pulse space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                <div className="h-4 bg-gray-200 rounded w-16"></div>
              </div>
              <div className="space-y-2">
                <div className="h-8 bg-gray-200 rounded w-24"></div>
              </div>
              <div className="space-y-2">
                <div className="h-8 bg-gray-200 rounded w-20 sm:w-24 animate-pulse"></div>
                <div className="h-8 bg-gray-200 rounded w-32 sm:w-40 animate-pulse"></div>
              </div>
            </div>
          </div>
        );
      case 'stat':
        return (
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 sm:w-16 sm:h-12 bg-gray-200 rounded-lg animate-pulse"></div>
            <div className="h-12 sm:h-12 bg-gray-200 rounded w-12 sm:w-16 animate-pulse"></div>
          </div>
        );
      case 'table':
        return (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-12 bg-gray-200 rounded-lg"></div>
              </div>
            ))}
          </div>
        );
      case 'text':
        return (
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded w-3/4 sm:w-1/2 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 sm:w-8 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-8 sm:w-12 animate-pulse"></div>
          </div>
        );
      default:
        return (
          <div className="animate-pulse">
            <div className="h-12 bg-gray-200 rounded"></div>
          </div>
        );
    }
  };

  return (
    <div className={`space-y-3 ${getResponsiveClasses()[type]} ${className}`}>
      {[...Array(count)].map((_, index) => (
        <div key={index}>
          {renderSkeleton()}
        </div>
      ))}
    </div>
  );
};

export default SkeletonLoader;
