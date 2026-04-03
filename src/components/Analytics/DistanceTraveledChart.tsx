import React from 'react';
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { CustomTooltip } from './CustomTooltip';
interface DistanceTraveledChartProps {
  data: any[];
  totalDistance: number;
}
export function DistanceTraveledChart({ data, totalDistance }: DistanceTraveledChartProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-slate-800 font-semibold" style={{ fontSize: 15 }}>Distance Traveled</h3>
          <p className="text-slate-400" style={{ fontSize: 12 }}>Total km by day (all devices)</p>
        </div>
        <div className="text-right">
          <div className="text-slate-800 font-bold" style={{ fontSize: 22 }}>{totalDistance} km</div>
          <div className="text-green-500" style={{ fontSize: 12 }}>↑ This week</div>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
          <XAxis dataKey="day" tick={{ fill: '#94A3B8', fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: '#94A3B8', fontSize: 11 }} axisLine={false} tickLine={false} />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="km" name="Distance (km)" fill="#1E40AF" radius={[6, 6, 0, 0]}>
            {data.map((_: any, i: number) => (
              <Cell key={i} fill={i === 3 ? '#3B82F6' : '#1E40AF'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
