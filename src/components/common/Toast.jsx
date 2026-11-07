import React from 'react';
import { CheckCircle2, AlertTriangle, Info, XCircle } from 'lucide-react';
import { useProject } from '../../context/ProjectContext';

export const Toast = () => {
  const { toastMessage } = useProject();

  if (!toastMessage) return null;

  const iconMap = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />,
    info: <Info className="w-5 h-5 text-blue-500 shrink-0" />,
    error: <XCircle className="w-5 h-5 text-red-500 shrink-0" />
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 transition-all duration-300 transform translate-y-0 opacity-100">
      <div className="flex items-center gap-3 px-4 py-3 bg-slate-900 text-white rounded-xl shadow-xl border border-slate-700/80 max-w-md">
        {iconMap[toastMessage.type] || iconMap.info}
        <span className="text-sm font-medium">{toastMessage.message}</span>
      </div>
    </div>
  );
};

