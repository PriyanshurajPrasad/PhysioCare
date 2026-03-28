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
    <div className="bg-white rounded-lg shadow border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 ${color} rounded-lg flex items-center justify-center`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        {change && (
          <div className="flex items-center text-sm font-medium">
            {changeType === 'positive' ? (
              <TrendingUp className="w-4 h-4 mr-1 text-green-600" />
            ) : (
              <TrendingDown className="w-4 h-4 mr-1 text-red-600" />
            )}
            <span className={changeType === 'positive' ? 'text-green-600' : 'text-red-600'}>
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
