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
  const getResponsiveClasses = () => {
    return {
      card: 'bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-all duration-200 group',
      iconContainer: `w-10 h-10 sm:w-12 sm:h-12 ${color} rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform duration-200`,
      title: 'text-lg sm:text-xl font-bold text-gray-900 text-center sm:text-left',
      value: 'text-2xl sm:text-3xl font-bold text-gray-900 text-center',
      description: 'text-sm text-gray-600 text-center sm:text-left',
      changeContainer: 'flex items-center justify-center mt-2 space-x-2',
      changeText: 'text-xs sm:text-sm font-medium',
      changeValue: 'text-lg sm:text-xl font-bold',
      changeIcon: 'w-4 h-4 sm:w-5 sm:h-5'
    };
  };

  const { card, iconContainer, title, value, description, changeContainer, changeText, changeValue, changeIcon } = getResponsiveClasses();

  return (
    <div className={card}>
      <div className="flex items-center justify-between mb-4">
        <div className={iconContainer}>
          <Icon className="text-white" />
        </div>
        {change && (
          <div className={changeContainer}>
            {changeType === 'positive' ? (
              <TrendingUp className={changeIcon} />
            ) : (
              <TrendingDown className={changeIcon} />
            )}
            <span className={changeText}>
              {change.startsWith('+') ? change : `${change}${Math.abs(Number(change))}%`}
            </span>
          </div>
        )}
      </div>
      
      <div className="text-center sm:text-left flex-1 min-w-0">
        <h3 className={title}>{title}</h3>
        <p className={description}>{value}</p>
      </div>
      
      {loading ? (
        <div className="space-y-2">
          <div className="h-8 bg-gray-200 rounded animate-pulse w-3/4 sm:w-4"></div>
          <div className="h-8 bg-gray-200 rounded animate-pulse w-3/4 sm:w-4"></div>
        </div>
      ) : (
        <div>
          <p className={value}>{value}</p>
          <p className={description}>{title}</p>
        </div>
      )}
    </div>
  );
};

export default StatCard;
