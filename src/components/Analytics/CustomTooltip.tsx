import React from 'react';
export const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-lg p-3">
      <div className="text-slate-600 font-medium mb-2" style={{ fontSize: 12 }}>{label}</div>
      {payload.map((p: any) => (
        <div key={p.name} className="flex items-center gap-2" style={{ fontSize: 12 }}>
          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: p.color }} />
          <span className="text-slate-500">{p.name}:</span>
          <span className="text-slate-800 font-semibold">{p.value}</span>
        </div>
      ))}
    </div>
  );
};
