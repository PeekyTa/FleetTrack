import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
interface KpiCardProps {
  label: string;
  value: string | number;
  unit?: string;
  trend?: string;
  trendUp?: boolean | null;
  icon: React.ElementType;
  color: string;
  bg: string;
  sub?: string;
}
export function KpiCard({ label, value, unit, trend, trendUp, icon: Icon, color, bg, sub }: KpiCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
      <div className="flex items-start justify-between mb-3">
        <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ backgroundColor: bg }}>
          <Icon size={20} style={{ color }} />
        </div>
        {trend && (
          <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${trendUp === true ? 'bg-green-50 text-green-600' : trendUp === false ? 'bg-red-50 text-red-500' : 'bg-slate-100 text-slate-500'}`}>
            {trendUp === true && <TrendingUp size={11} />}
            {trendUp === false && <TrendingDown size={11} />}
            {trend}
          </div>
        )}
      </div>
      <div className="flex items-baseline gap-1 mb-1">
        <span className="text-slate-800" style={{ fontSize: 28, fontWeight: 700, lineHeight: 1 }}>{value}</span>
        {unit && <span className="text-slate-400" style={{ fontSize: 14 }}>{unit}</span>}
      </div>
      <div className="text-slate-500" style={{ fontSize: 13 }}>{label}</div>
      {sub && <div className="text-slate-400 mt-1" style={{ fontSize: 11 }}>{sub}</div>}
    </div>
  );
}
