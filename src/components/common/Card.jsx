import React from 'react';

export const Card = ({
  children,
  className = '',
  title,
  subtitle,
  actions,
  badge,
  noPadding = false,
  footer,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-xl border border-slate-200/90 shadow-sm transition-shadow hover:shadow-md ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      {(title || subtitle || actions || badge) && (
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div>
              {title && <h3 className="text-base font-semibold text-slate-900 tracking-tight">{title}</h3>}
              {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
            </div>
            {badge && <div>{badge}</div>}
          </div>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      )}

      <div className={noPadding ? '' : 'p-6'}>{children}</div>

      {footer && (
        <div className="px-6 py-3.5 bg-slate-50/70 border-t border-slate-100 rounded-b-xl flex items-center justify-between text-xs text-slate-500">
          {footer}
        </div>
      )}
    </div>
  );
};

