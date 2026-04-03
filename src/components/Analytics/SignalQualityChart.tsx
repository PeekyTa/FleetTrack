import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
interface SignalQualityChartProps {
  data: any[];
}
export function SignalQualityChart({ data }: SignalQualityChartProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
      <div className="mb-5">
        <h3 className="text-slate-800 font-semibold" style={{ fontSize: 15 }}>Signal Quality</h3>
        <p className="text-slate-400" style={{ fontSize: 12 }}>Distribution across fleet</p>
      </div>
      <ResponsiveContainer width="100%" height={160}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={42}
            outerRadius={70}
            paddingAngle={3}
            dataKey="value"
          >
            {data.map((entry: any, i: number) => (
              <Cell key={i} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip formatter={(val: any) => [val, 'Devices']} contentStyle={{ fontSize: 12, borderRadius: 10 }} />
        </PieChart>
      </ResponsiveContainer>
      <div className="space-y-2 mt-1">
        {data.map((item: any) => (
          <div key={item.name} className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
            <span className="text-slate-500 flex-1" style={{ fontSize: 12 }}>{item.name}</span>
            <span className="font-semibold text-slate-700" style={{ fontSize: 12 }}>{item.value} devices</span>
          </div>
        ))}
      </div>
    </div>
  );
}
