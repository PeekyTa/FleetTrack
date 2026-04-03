import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { CustomTooltip } from './CustomTooltip';
interface DeviceActivityChartProps {
  data: any[];
}
export function DeviceActivityChart({ data }: DeviceActivityChartProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm xl:col-span-2">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-slate-800 font-semibold" style={{ fontSize: 15 }}>Device Activity Trend</h3>
          <p className="text-slate-400" style={{ fontSize: 12 }}>Online vs offline devices by hour</p>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5 text-slate-500">
            <div className="w-3 h-3 rounded-full bg-blue-600" />
            Online
          </div>
          <div className="flex items-center gap-1.5 text-slate-500">
            <div className="w-3 h-3 rounded-full bg-slate-300" />
            Offline
          </div>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={data} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
          <defs>
            <linearGradient id="onlineGrad2" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#1E40AF" stopOpacity={0.18} />
              <stop offset="95%" stopColor="#1E40AF" stopOpacity={0.01} />
            </linearGradient>
            <linearGradient id="offlineGrad2" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#94A3B8" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#94A3B8" stopOpacity={0.01} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
          <XAxis dataKey="time" tick={{ fill: '#94A3B8', fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis domain={[0, 10]} tick={{ fill: '#94A3B8', fontSize: 11 }} axisLine={false} tickLine={false} />
          <Tooltip content={<CustomTooltip />} />
          <Area type="monotone" dataKey="online" name="Online" stroke="#1E40AF" strokeWidth={2.5} fill="url(#onlineGrad2)" />
          <Area type="monotone" dataKey="offline" name="Offline" stroke="#94A3B8" strokeWidth={2} fill="url(#offlineGrad2)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
