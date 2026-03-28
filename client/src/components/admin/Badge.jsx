import React from 'react';
import { CheckCircle, Clock, XCircle, AlertCircle } from 'lucide-react';

const Badge = ({ 
  children, 
  variant = 'default', 
  size = 'sm',
  icon = null 
}) => {
  const baseClasses = 'inline-flex items-center font-medium rounded-full';
  
  const variants = {
    default: 'bg-gray-100 text-gray-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    error: 'bg-red-100 text-red-800',
    info: 'bg-blue-100 text-blue-800',
    pending: 'bg-orange-100 text-orange-800',
    confirmed: 'bg-emerald-100 text-emerald-800',
    cancelled: 'bg-red-100 text-red-800'
  };

  const sizes = {
    xs: 'px-1.5 py-0.5 text-xs',
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base'
  };

  const icons = {
    success: CheckCircle,
    warning: AlertCircle,
    error: XCircle,
    info: Clock,
    pending: Clock,
    confirmed: CheckCircle,
    cancelled: XCircle
  };

  const IconComponent = icon || icons[variant];

  return (
    <span className={`${baseClasses} ${variants[variant]} ${sizes[size]}`}>
      {IconComponent && (
        <IconComponent className="w-3 h-3 mr-1" />
      )}
      {children}
    </span>
  );
};

export default Badge;
