import React from 'react';

const SectionCard = ({ 
  title, 
  subtitle, 
  icon: Icon, 
  children, 
  className = '',
  headerAction = null 
}) => {
  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-all duration-200 ${className}`}>
      {(title || Icon || headerAction) && (
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {Icon && (
                <div className="w-8 h-8 sm:w-12 sm:h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                </div>
              )}
              <div className="hidden sm:block">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 text-center sm:text-left">{title}</h3>
                <p className="text-sm text-gray-600 text-center sm:text-left">{subtitle}</p>
              </div>
            </div>
            {headerAction && (
              <button className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center group">
                {headerAction}
              </button>
            )}
          </div>
        </div>
      )}
      
      <div className="p-4 sm:p-6">
        {children}
      </div>
    </div>
  );
};

export default SectionCard;
