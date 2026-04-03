import React from 'react';
import { Activity, WifiOff, AlertTriangle, MapPin } from 'lucide-react';
import { devices, alerts } from '../../app/data/mockData';
export function DashboardStats() {
  const online = devices.filter((d: any) => d.status === 'online').length;
  const offline = devices.filter((d: any) => d.status === 'offline').length;
  const totalDevices = devices.length;
  const unacknowledged = alerts.filter((a: any) => !a.acknowledged).length;
  const kpis = [
    {
      label: 'Online Devices',
      value: online,
      total: totalDevices,
      icon: Activity,
      color: '#10B981',
      bg: '#F0FDF4',
      trend: '+2 from yesterday',
      trendUp: true,
    },
    {
      label: 'Offline Devices',
      value: offline,
      total: totalDevices,
      icon: WifiOff,
      color: '#EF4444',
      bg: '#FEF2F2',
      trend: 'Same as yesterday',
      trendUp: null,
    },
    {
      label: 'Active Alerts',
      value: unacknowledged,
      total: alerts.length,
      icon: AlertTriangle,
      color: '#F97316',
      bg: '#FFF7ED',
      trend: '1 critical pending',
      trendUp: false,
    },
    {
      label: 'Coverage Area',
      value: '48.2',
      unit: 'km²',
      icon: MapPin,
      color: '#1E40AF',
      bg: '#EFF6FF',
      trend: '↑ 3.1 km² today',
      trendUp: true,
    },
  ];
  return (
    <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
      {kpis.map((kpi, i) => {
        const Icon = kpi.icon;
        return (
          <div key={i} className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-slate-500 mb-1" style={{ fontSize: 13 }}>{kpi.label}</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-slate-800" style={{ fontSize: 30, fontWeight: 700, lineHeight: 1 }}>
                    {kpi.value}
                  </span>
                  {kpi.unit && <span className="text-slate-500" style={{ fontSize: 14 }}>{kpi.unit}</span>}
                  {kpi.total && <span className="text-slate-400" style={{ fontSize: 13 }}>/ {kpi.total}</span>}
                </div>
              </div>
              <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ backgroundColor: kpi.bg }}>
                <Icon size={20} style={{ color: kpi.color }} />
              </div>
            </div>
            {}
            {kpi.total && (
              <div className="mb-3">
                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${(Number(kpi.value) / kpi.total) * 100}%`,
                      backgroundColor: kpi.color,
                    }}
                  />
                </div>
              </div>
            )}
            <p className="text-slate-400" style={{ fontSize: 12 }}>
              {kpi.trendUp === true && <span className="text-green-500">↑ </span>}
              {kpi.trendUp === false && <span className="text-red-400">↓ </span>}
              {kpi.trend}
            </p>
          </div>
        );
      })}
    </div>
  );
}
