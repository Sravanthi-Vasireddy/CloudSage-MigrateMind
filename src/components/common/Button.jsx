import React from 'react';

const variantClasses = {
  primary: 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm border border-transparent focus:ring-blue-500',
  secondary: 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 shadow-sm focus:ring-slate-400',
  outline: 'bg-transparent hover:bg-blue-50 text-blue-600 border border-blue-300 focus:ring-blue-400',
  danger: 'bg-red-600 hover:bg-red-700 text-white shadow-sm border border-transparent focus:ring-red-500',
  ghost: 'bg-transparent hover:bg-slate-100 text-slate-600 border border-transparent focus:ring-slate-300',
  dark: 'bg-slate-900 hover:bg-slate-800 text-white shadow-sm border border-transparent focus:ring-slate-700'
};

const sizeClasses = {
  xs: 'text-xs px-2.5 py-1 gap-1.5',
  sm: 'text-xs px-3 py-1.5 gap-1.5 font-medium',
  md: 'text-sm px-4 py-2 gap-2 font-medium',
  lg: 'text-base px-5 py-2.5 gap-2.5 font-medium'
};

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconPosition = 'left',
  className = '',
  disabled = false,
  onClick,
  type = 'button',
  ...props
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center rounded-lg transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed ${variantClasses[variant] || variantClasses.primary} ${sizeClasses[size] || sizeClasses.md} ${className}`}
      {...props}
    >
      {Icon && iconPosition === 'left' && <Icon className="w-4 h-4 shrink-0" />}
      {children}
      {Icon && iconPosition === 'right' && <Icon className="w-4 h-4 shrink-0" />}
    </button>
  );
};

