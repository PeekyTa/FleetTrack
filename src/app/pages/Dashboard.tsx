import React from 'react';
import { Radio, Wifi, WifiOff, BatteryLow, AlertTriangle } from 'lucide-react';
import { LeafletMap } from '../../components/Map/LeafletMap';
import { useDevices } from '../../hooks/useDevices';
import { useLocations } from '../../hooks/useLocations';
import { useAlerts } from '../../hooks/useAlerts';
import type { DeviceLocation } from '../../types/index';
function StatCard({ label, value, icon: Icon, color, bg }: {
  label: string; value: number | string; icon: any; color: string; bg: string;
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm flex items-center gap-4">
      <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: bg }}>
        <Icon size={22} style={{ color }} />
      </div>
      <div>
        <div className="text-slate-800 font-bold" style={{ fontSize: 26 }}>{value}</div>
        <div className="text-slate-500" style={{ fontSize: 12 }}>{label}</div>
      </div>
    </div>
  );
}
function DeviceListPanel({ deviceLocations }: { deviceLocations: DeviceLocation[] }) {
  const STATUS_INFO: Record<string, { color: string; bg: string; label: string }> = {
    ONLINE: { color: '#10B981', bg: '#F0FDF4', label: 'En ligne' },
    OFFLINE: { color: '#94A3B8', bg: '#F8FAFC', label: 'Hors ligne' },
    LOW_BATTERY: { color: '#F59E0B', bg: '#FFFBEB', label: 'Batterie faible' },
    WARNING: { color: '#EF4444', bg: '#FEF2F2', label: 'Alerte' },
  };
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-100">
        <h3 className="text-slate-700 font-semibold" style={{ fontSize: 14 }}>Appareils Actifs</h3>
      </div>
      <div className="max-h-[400px] overflow-y-auto divide-y divide-slate-50">
        {deviceLocations.map((dl) => {
          const si = STATUS_INFO[dl.status] || STATUS_INFO.OFFLINE;
          return (
            <div key={dl.deviceId} className="px-5 py-3 flex items-center gap-3 hover:bg-slate-50 transition-colors">
              <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: si.color }} />
              <div className="flex-1 min-w-0">
                <div className="text-slate-700 font-medium truncate" style={{ fontSize: 13 }}>{dl.deviceName}</div>
                <div className="text-slate-400 truncate" style={{ fontSize: 11 }}>{dl.groupName}</div>
              </div>
              <div className="text-right shrink-0">
                <div className="px-2 py-0.5 rounded-full" style={{ backgroundColor: si.bg, color: si.color, fontSize: 10, fontWeight: 600 }}>
                  {si.label}
                </div>
                <div className="text-slate-400 mt-0.5" style={{ fontSize: 10 }}>{dl.battery}%</div>
              </div>
            </div>
          );
        })}
        {deviceLocations.length === 0 && (
          <div className="p-8 text-center text-slate-400" style={{ fontSize: 13 }}>Aucun appareil disponible</div>
        )}
      </div>
    </div>
  );
}
export function Dashboard() {
  const { stats, loading: devLoading } = useDevices();
  const { deviceLocations, loading: locLoading } = useLocations();
  const { unacknowledgedCount } = useAlerts();
  const statCards = [
    { label: 'Total Appareils', value: stats?.total ?? '—', icon: Radio, color: '#1E40AF', bg: '#EFF6FF' },
    { label: 'En Ligne', value: stats?.online ?? '—', icon: Wifi, color: '#10B981', bg: '#F0FDF4' },
    { label: 'Hors Ligne', value: stats?.offline ?? '—', icon: WifiOff, color: '#94A3B8', bg: '#F8FAFC' },
    { label: 'Alertes Actives', value: unacknowledgedCount, icon: AlertTriangle, color: '#EF4444', bg: '#FEF2F2' },
  ];
  return (
    <div className="p-4 md:p-6 space-y-4 md:space-y-6 animate-fade-in-up flex flex-col">
      {}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>
      {}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden" style={{ height: 480 }}>
            {locLoading ? (
              <div className="h-full flex items-center justify-center text-slate-400">Chargement de la carte...</div>
            ) : (
              <LeafletMap deviceLocations={deviceLocations} height="100%" />
            )}
          </div>
        </div>
        <div>
          <DeviceListPanel deviceLocations={deviceLocations} />
        </div>
      </div>
    </div>
  );
}
