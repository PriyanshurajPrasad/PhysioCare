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
    <div className={`bg-white rounded-lg shadow border border-gray-200 ${className}`}>
      {(title || Icon || headerAction) && (
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {Icon && (
                <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                  <Icon className="w-4 h-4 text-gray-600" />
                </div>
              )}
              <div>
                {title && <h3 className="text-lg font-semibold text-gray-900">{title}</h3>}
                {subtitle && <p className="text-sm text-gray-600">{subtitle}</p>}
              </div>
            </div>
            {headerAction && headerAction}
          </div>
        </div>
      )}
      <div className="p-6">
        {children}
      </div>
    </div>
  );
};

export default SectionCard;
