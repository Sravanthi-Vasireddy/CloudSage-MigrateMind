import React from 'react';

export const StatCard = ({
  title,
  value,
  subtext,
  icon: Icon,
  trend,
  trendDirection = 'up',
  color = 'blue',
  className = '',
}) => {
  const colorMap = {
    blue: {
      bg: 'bg-blue-50 text-blue-600 border-blue-100',
      accent: 'text-blue-600',
    },
    purple: {
      bg: 'bg-purple-50 text-purple-600 border-purple-100',
      accent: 'text-purple-600',
    },
    emerald: {
      bg: 'bg-emerald-50 text-emerald-600 border-emerald-100',
      accent: 'text-emerald-600',
    },
    amber: {
      bg: 'bg-amber-50 text-amber-600 border-amber-100',
      accent: 'text-amber-600',
    },
    sky: {
      bg: 'bg-sky-50 text-sky-600 border-sky-100',
      accent: 'text-sky-600',
    },
    slate: {
      bg: 'bg-slate-100 text-slate-700 border-slate-200',
      accent: 'text-slate-700',
    }
  };

  const scheme = colorMap[color] || colorMap.blue;

  return (
    <div className={`bg-white rounded-xl border border-slate-200/90 shadow-sm p-5 hover:border-slate-300 transition-all ${className}`}>
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{title}</p>
          <div className="text-3xl font-extrabold text-slate-900 tracking-tight">{value}</div>
        </div>
        {Icon && (
          <div className={`p-2.5 rounded-lg border shrink-0 ${scheme.bg}`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      {(subtext || trend) && (
        <div className="mt-3 flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
          {subtext && <span className="truncate">{subtext}</span>}
          {trend && (
            <span
              className={`font-semibold shrink-0 ${
                trendDirection === 'up'
                  ? 'text-emerald-600'
                  : trendDirection === 'down'
                  ? 'text-red-600'
                  : 'text-slate-600'
              }`}
            >
              {trend}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

