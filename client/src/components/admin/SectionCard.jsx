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
    <div className={`bg-white rounded-lg shadow border border-gray-200 overflow-hidden ${className}`}>
      {(title || subtitle || Icon || headerAction) && (
        <div className="px-4 sm:px-6 py-4 sm:py-5 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              {Icon && (
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                {title && (
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-900 truncate">{title}</h2>
                )}
                {subtitle && (
                  <p className="text-sm text-gray-600 truncate">{subtitle}</p>
                )}
              </div>
            </div>
            
            {headerAction && (
              <div className="flex-shrink-0">
                {headerAction}
              </div>
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
