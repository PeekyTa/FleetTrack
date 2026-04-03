import React from 'react';
import { Shield, Battery, WifiOff, Zap } from 'lucide-react';
import { GeofenceZone } from '../../app/data/mockData';
interface AlertRulesSummaryProps {
  zones: GeofenceZone[];
}
export function AlertRulesSummary({ zones }: AlertRulesSummaryProps) {
  return (
    <div className="border-t border-slate-100 p-4 shrink-0">
      <div className="text-slate-600 font-semibold mb-3" style={{ fontSize: 13 }}>Alert Rules Active</div>
      <div className="space-y-2">
        {[
          { icon: Shield, label: 'Geofence rules', count: zones.filter(z => z.active).length, color: '#1E40AF' },
          { icon: Battery, label: 'Low battery threshold', count: '< 15%', color: '#F59E0B' },
          { icon: WifiOff, label: 'Signal lost timeout', count: '5 min', color: '#EF4444' },
          { icon: Zap, label: 'SOS monitoring', count: 'Always', color: '#8B5CF6' },
        ].map(({ icon: Icon, label, count, color }) => (
          <div key={label} className="flex items-center gap-2.5 py-1.5">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${color}15` }}>
              <Icon size={13} style={{ color }} />
            </div>
            <span className="text-slate-600 flex-1" style={{ fontSize: 12 }}>{label}</span>
            <span className="font-semibold text-slate-700" style={{ fontSize: 12 }}>{count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
