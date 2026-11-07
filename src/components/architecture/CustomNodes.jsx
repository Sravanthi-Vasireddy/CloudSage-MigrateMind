import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';
import {
  Users,
  Building2,
  Network,
  ShieldCheck,
  Boxes,
  Database,
  Cpu,
  HardDrive,
  Lock,
  Cloud,
  Zap
} from 'lucide-react';

const iconMap = {
  Users,
  Building2,
  Network,
  ShieldCheck,
  Boxes,
  Database,
  Cpu,
  HardDrive,
  Lock,
  Cloud,
  Zap
};

export const CloudArchitectureNode = memo(({ data, selected }) => {
  const Icon = iconMap[data.icon] || Cloud;
  const provider = data.provider || 'AWS';

  const providerTagColor = {
    AWS: 'bg-amber-100 text-amber-800 border-amber-200',
    AZURE: 'bg-blue-100 text-blue-800 border-blue-200',
    GCP: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  }[provider] || 'bg-slate-100 text-slate-800 border-slate-200';

  return (
    <div
      className={`relative rounded-xl border bg-white p-3.5 shadow-sm transition-all min-w-[215px] max-w-[245px] text-left ${
        selected
          ? 'border-blue-600 ring-2 ring-blue-500/30 shadow-md'
          : 'border-slate-300/90 hover:border-slate-400'
      }`}
    >
      {/* Connection Handles */}
      <Handle
        type="target"
        position={Position.Left}
        id="left"
        className="w-2.5 h-2.5 bg-blue-600 border-2 border-white rounded-full"
      />
      <Handle
        type="target"
        position={Position.Top}
        id="top"
        className="w-2.5 h-2.5 bg-blue-600 border-2 border-white rounded-full"
      />

      <div className="flex items-start gap-2.5">
        <div
          className="p-2 rounded-lg shrink-0 text-white shadow-xs"
          style={{ backgroundColor: data.color || '#2563eb' }}
        >
          <Icon className="w-4 h-4" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-1 mb-0.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block truncate">
              {data.category}
            </span>
            <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded border uppercase font-mono ${providerTagColor}`}>
              {provider}
            </span>
          </div>
          <h4 className="text-xs font-bold text-slate-900 leading-tight truncate">
            {data.title}
          </h4>
          <p className="text-[11px] text-slate-500 truncate mt-0.5">
            {data.subtitle}
          </p>
        </div>
      </div>

      <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px]">
        <span className="font-semibold text-emerald-600 flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          Active
        </span>
        <span className="text-slate-400 font-mono">
          {data.details?.service || data.details?.protocol || 'Managed Service'}
        </span>
      </div>

      <Handle
        type="source"
        position={Position.Right}
        id="right"
        className="w-2.5 h-2.5 bg-blue-600 border-2 border-white rounded-full"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="bottom"
        className="w-2.5 h-2.5 bg-blue-600 border-2 border-white rounded-full"
      />
    </div>
  );
});
