import React from 'react';
import { BarChart, Bar, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { CustomTooltip } from './CustomTooltip';
interface AlertsCoverageChartsProps {
  alertsData: any[];
  coverageData: any[];
  totalAlerts: number;
}
export function AlertsCoverageCharts({ alertsData, coverageData, totalAlerts }: AlertsCoverageChartsProps) {
  return (
    <div className="grid grid-rows-2 gap-6">
      <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-slate-800 font-semibold" style={{ fontSize: 15 }}>Alerts by Category</h3>
          <span className="text-slate-400" style={{ fontSize: 12 }}>{totalAlerts} total</span>
        </div>
        <ResponsiveContainer width="100%" height={80}>
          <BarChart data={alertsData} layout="vertical" margin={{ top: 0, right: 5, bottom: 0, left: 0 }}>
            <XAxis type="number" hide />
            <YAxis dataKey="type" type="category" tick={{ fill: '#64748B', fontSize: 11 }} axisLine={false} tickLine={false} width={80} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="count" name="Alerts" fill="#F97316" radius={[0, 4, 4, 0]}>
              {alertsData.map((_: any, i: number) => (
                <Cell key={i} fill={['#EF4444', '#F97316', '#F59E0B', '#DC2626', '#94A3B8'][i]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
        <h3 className="text-slate-800 font-semibold mb-3" style={{ fontSize: 15 }}>Coverage by Group</h3>
        <div className="space-y-2.5">
          {coverageData.map(({ group, coverage }: any) => (
            <div key={group} className="flex items-center gap-3">
              <span className="text-slate-500 w-28 shrink-0 truncate" style={{ fontSize: 12 }}>{group}</span>
              <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${coverage}%`,
                    background: coverage >= 80 ? '#10B981' : coverage >= 60 ? '#1E40AF' : '#F59E0B',
                  }}
                />
              </div>
              <span className="text-slate-700 font-medium w-8 text-right" style={{ fontSize: 12 }}>{coverage}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
