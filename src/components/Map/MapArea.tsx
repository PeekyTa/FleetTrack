import React from 'react';
import { Filter, Radio, Battery, Signal, MapPin, Clock, X } from 'lucide-react';
import { CityMap } from '../../app/components/CityMap';
import { Device } from '../../app/data/mockData';
const STATUS_COLORS: Record<string, string> = {
  online: '#10B981',
  offline: '#94A3B8',
  'low-battery': '#F59E0B',
  warning: '#F97316',
};
const STATUS_LABELS: Record<string, string> = {
  online: 'Online',
  offline: 'Offline',
  'low-battery': 'Low Battery',
  warning: 'Warning',
};
function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-white font-medium"
      style={{ backgroundColor: STATUS_COLORS[status], fontSize: 11 }}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-white/70" />
      {STATUS_LABELS[status]}
    </span>
  );
}
interface MapAreaProps {
  showFilterPanel: boolean;
  setShowFilterPanel: (show: boolean) => void;
  online: number;
  offline: number;
  lowBattery: number;
  warnings: number;
  selectedDevice: Device | null;
  setSelectedDevice: React.Dispatch<React.SetStateAction<Device | null>>;
  filterGroup: string;
}
export function MapArea({
  showFilterPanel, setShowFilterPanel, online, offline, lowBattery, warnings,
  selectedDevice, setSelectedDevice, filterGroup
}: MapAreaProps) {
  return (
    <div className="flex-1 relative">
      {!showFilterPanel && (
        <button
          onClick={() => setShowFilterPanel(true)}
          className="absolute top-3 left-3 z-10 bg-white border border-slate-200 rounded-lg shadow-md px-3 py-2 flex items-center gap-2 text-slate-600 hover:bg-slate-50 transition-colors"
          style={{ fontSize: 13 }}
        >
          <Filter size={14} />
          Devices
        </button>
      )}
      {}
      <div className="absolute top-3 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2 bg-white/95 backdrop-blur-sm rounded-xl shadow-lg border border-slate-200 px-4 py-2.5">
        {[
          { label: 'Online', count: online, color: '#10B981' },
          { label: 'Offline', count: offline, color: '#94A3B8' },
          { label: 'Low Bat.', count: lowBattery, color: '#F59E0B' },
          { label: 'Warning', count: warnings, color: '#F97316' },
        ].map((s, i) => (
          <React.Fragment key={s.label}>
            {i > 0 && <div className="w-px h-4 bg-slate-200" />}
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: s.color }} />
              <span className="text-slate-500" style={{ fontSize: 12 }}>{s.label}</span>
              <span className="font-semibold text-slate-800" style={{ fontSize: 12 }}>{s.count}</span>
            </div>
          </React.Fragment>
        ))}
      </div>
      <CityMap
        mode="live"
        selectedDeviceId={selectedDevice?.id}
        onDeviceClick={(d: any) => setSelectedDevice((prev: any) => prev?.id === d.id ? null : d)}
        filterGroup={filterGroup}
      />
      {}
      {selectedDevice && (
        <div className="absolute bottom-4 left-4 z-10 bg-white rounded-2xl shadow-xl border border-slate-200 p-4 w-72 animate-fade-in-up">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center">
                <Radio size={16} className="text-blue-600" />
              </div>
              <div>
                <div className="text-slate-800 font-semibold" style={{ fontSize: 14 }}>{selectedDevice.name}</div>
                <div className="text-slate-400" style={{ fontSize: 12 }}>{selectedDevice.id} • {selectedDevice.model}</div>
              </div>
            </div>
            <button onClick={() => setSelectedDevice(null)} className="text-slate-400 hover:text-slate-600 mt-0.5">
              <X size={16} />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2 mb-3">
            {[
              { icon: Battery, label: 'Battery', value: `${selectedDevice.battery}%`, color: selectedDevice.battery < 20 ? '#EF4444' : '#10B981' },
              { icon: Signal, label: 'Signal', value: `${selectedDevice.signal}%`, color: '#1E40AF' },
              { icon: MapPin, label: 'Location', value: selectedDevice.location, color: '#64748B' },
              { icon: Clock, label: 'Last Seen', value: selectedDevice.lastSeen, color: '#64748B' },
            ].map(({ icon: Icon, label, value, color }) => (
              <div key={label} className="bg-slate-50 rounded-xl p-2.5">
                <div className="flex items-center gap-1.5 mb-1">
                  <Icon size={11} style={{ color }} />
                  <span className="text-slate-400" style={{ fontSize: 11 }}>{label}</span>
                </div>
                <div className="text-slate-700 font-medium truncate" style={{ fontSize: 12, color }}>{value}</div>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <StatusBadge status={selectedDevice.status} />
            <span className="text-slate-400 flex items-center gap-1" style={{ fontSize: 12 }}>
              Group: {selectedDevice.group}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
