import React from 'react';
import { Clock, CheckCircle2 } from 'lucide-react';
import { Alert } from '../../app/data/mockData';
const SEVERITY_CONFIG: Record<string, any> = {
  critical: { bg: '#FEF2F2', text: '#DC2626', border: '#FECACA', label: 'Critical', dot: '#EF4444' },
  high: { bg: '#FFF7ED', text: '#C2410C', border: '#FED7AA', label: 'High', dot: '#F97316' },
  medium: { bg: '#FFFBEB', text: '#B45309', border: '#FDE68A', label: 'Medium', dot: '#F59E0B' },
  low: { bg: '#F0FDF4', text: '#15803D', border: '#BBF7D0', label: 'Low', dot: '#10B981' },
};
const ALERT_TYPE_CONFIG: Record<string, any> = {
  'geofence-exit': { icon: '🚧', label: 'Geofence Exit', color: '#F97316' },
  'geofence-enter': { icon: '📍', label: 'Geofence Enter', color: '#3B82F6' },
  'low-battery': { icon: '🪫', label: 'Low Battery', color: '#F59E0B' },
  'signal-lost': { icon: '📵', label: 'Signal Lost', color: '#EF4444' },
  'sos': { icon: '🆘', label: 'SOS Alert', color: '#DC2626' },
};
interface AlertsListProps {
  alertList: Alert[];
  unackAlerts: Alert[];
  acknowledgeAll: () => void;
  acknowledgeAlert: (id: number) => void;
}
export function AlertsList({ alertList, unackAlerts, acknowledgeAll, acknowledgeAlert }: AlertsListProps) {
  return (
    <div className="flex-1 overflow-y-auto">
      {unackAlerts.length > 0 && (
        <div className="px-4 py-2.5 bg-red-50 border-b border-red-100 flex items-center justify-between">
          <span className="text-red-600 font-medium" style={{ fontSize: 13 }}>
            {unackAlerts.length} unacknowledged
          </span>
          <button onClick={acknowledgeAll} className="text-red-500 hover:text-red-700" style={{ fontSize: 12 }}>
            Acknowledge all
          </button>
        </div>
      )}
      <div className="divide-y divide-slate-100">
        {alertList.map(alert => {
          const typeConfig = ALERT_TYPE_CONFIG[alert.type];
          const sevConfig = SEVERITY_CONFIG[alert.severity];
          return (
            <div
              key={alert.id}
              className={`p-4 transition-colors ${alert.acknowledged ? 'opacity-60' : 'hover:bg-slate-50'}`}
            >
              <div className="flex items-start gap-3">
                <div className="text-xl shrink-0 mt-0.5">{typeConfig.icon}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <span className="text-slate-800 font-medium" style={{ fontSize: 13 }}>{alert.message}</span>
                    {!alert.acknowledged && (
                      <div className="w-2 h-2 rounded-full bg-red-500 mt-1 shrink-0" />
                    )}
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-slate-500" style={{ fontSize: 12 }}>{alert.device}</span>
                    <span className="text-slate-300">•</span>
                    <span className="text-slate-400" style={{ fontSize: 12 }}>
                      <Clock size={10} className="inline mr-1" />{alert.time}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className="px-2 py-0.5 rounded-full font-semibold"
                      style={{ backgroundColor: sevConfig.bg, color: sevConfig.text, fontSize: 11 }}
                    >
                      {sevConfig.label}
                    </span>
                    {!alert.acknowledged && (
                      <button
                        onClick={() => acknowledgeAlert(alert.id)}
                        className="flex items-center gap-1 text-blue-600 hover:text-blue-700"
                        style={{ fontSize: 11 }}
                      >
                        <CheckCircle2 size={11} /> Acknowledge
                      </button>
                    )}
                    {alert.acknowledged && (
                      <span className="flex items-center gap-1 text-green-500" style={{ fontSize: 11 }}>
                        <CheckCircle2 size={11} /> Done
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
