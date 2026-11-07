import React from 'react';

const variantClasses = {
  blue: 'bg-blue-50 text-blue-700 border-blue-200',
  sky: 'bg-sky-50 text-sky-700 border-sky-200',
  emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  green: 'bg-green-50 text-green-700 border-green-200',
  amber: 'bg-amber-50 text-amber-700 border-amber-200',
  purple: 'bg-purple-50 text-purple-700 border-purple-200',
  indigo: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  red: 'bg-red-50 text-red-700 border-red-200',
  slate: 'bg-slate-100 text-slate-700 border-slate-200',
  neutral: 'bg-gray-100 text-gray-700 border-gray-200',
};

export const Badge = ({ children, variant = 'blue', size = 'sm', className = '', dot = false }) => {
  const sizeClasses = size === 'xs' ? 'text-[11px] px-1.5 py-0.5' : size === 'lg' ? 'text-sm px-3 py-1' : 'text-xs px-2.5 py-0.5';
  const colorClass = variantClasses[variant] || variantClasses.blue;

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full border ${colorClass} ${sizeClasses} ${className}`}
    >
      {dot && (
        <span className="w-1.5 h-1.5 rounded-full mr-1.5 bg-current opacity-80" />
      )}
      {children}
    </span>
  );
};

