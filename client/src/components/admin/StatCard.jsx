import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

const StatCard = ({ 
  title, 
  value, 
  icon: Icon, 
  color, 
  change, 
  changeType = 'positive',
  loading = false 
}) => {
  return (
    <div className="bg-white rounded-lg shadow border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-all duration-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3 sm:space-x-4">
          <div className={`
            w-10 h-10 sm:w-12 sm:h-12 
            ${color} 
            rounded-lg flex items-center justify-center
            flex-shrink-0
          `}>
            <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm sm:text-base font-semibold text-gray-900 break-words">{title}</p>
            <p className="text-xs sm:text-sm text-gray-500">Last 30 days</p>
          </div>
        </div>
        
        {change && (
          <div className="flex items-center space-x-1">
            {changeType === 'positive' ? (
              <TrendingUp className="w-4 h-4 text-green-500 flex-shrink-0" />
            ) : (
              <TrendingDown className="w-4 h-4 text-red-500 flex-shrink-0" />
            )}
            <span className={`
              text-sm font-medium
              ${changeType === 'positive' ? 'text-green-600' : 'text-red-600'}
              whitespace-nowrap
            `}>
              {change}
            </span>
          </div>
        )}
      </div>
      
      {loading ? (
        <div className="space-y-2">
          <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
        </div>
      ) : (
        <div>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          <p className="text-sm text-gray-600">{title}</p>
        </div>
      )}
    </div>
  );
};

export default StatCard;
