import React from 'react';
interface StatsRowProps {
  stats: { icon: any; label: string; value: string; color: string }[];
}
export function StatsRow({ stats }: StatsRowProps) {
  return (
    <div className="bg-white border-b border-slate-200 px-6 py-3 grid grid-cols-4 gap-4 shrink-0">
      {stats.map(({ icon: Icon, label, value, color }) => (
        <div key={label} className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${color}15` }}>
            <Icon size={16} style={{ color }} />
          </div>
          <div>
            <div className="text-slate-800 font-semibold" style={{ fontSize: 14 }}>{value}</div>
            <div className="text-slate-400" style={{ fontSize: 11 }}>{label}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
