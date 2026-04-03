import React from 'react';
import { Trash2, Radio, MapPin, Clock, Edit2, AlertCircle, AlertTriangle, CheckCircle2, XCircle } from 'lucide-react';
import { Device, DeviceStatus } from '../../app/data/mockData';
const STATUS_COLORS: Record<DeviceStatus, string> = {
  online: '#10B981',
  offline: '#94A3B8',
  'low-battery': '#F59E0B',
  warning: '#F97316',
};
const STATUS_BG: Record<DeviceStatus, string> = {
  online: '#F0FDF4',
  offline: '#F8FAFC',
  'low-battery': '#FFFBEB',
  warning: '#FFF7ED',
};
const STATUS_LABELS: Record<DeviceStatus, string> = {
  online: 'Online',
  offline: 'Offline',
  'low-battery': 'Low Battery',
  warning: 'Warning',
};
const STATUS_ICONS: Record<DeviceStatus, React.ReactNode> = {
  online: <CheckCircle2 size={13} color="#10B981" />,
  offline: <XCircle size={13} color="#94A3B8" />,
  'low-battery': <AlertCircle size={13} color="#F59E0B" />,
  warning: <AlertTriangle size={13} color="#F97316" />,
};
function StatusBadge({ status }: { status: DeviceStatus }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-medium" style={{ backgroundColor: STATUS_BG[status], color: STATUS_COLORS[status], fontSize: 12 }}>
      {STATUS_ICONS[status]}
      {STATUS_LABELS[status]}
    </span>
  );
}
function BatteryBar({ value }: { value: number }) {
  const color = value < 20 ? '#EF4444' : value < 40 ? '#F59E0B' : '#10B981';
  return (
    <div className="flex items-center gap-2">
      <div className="w-14 h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all" style={{ width: `${value}%`, backgroundColor: color }} />
      </div>
      <span style={{ fontSize: 12, color }}>{value}%</span>
    </div>
  );
}
interface DeviceTableProps {
  filtered: Device[];
  deviceList: Device[];
  selected: Set<string>;
  toggleSelect: (id: string) => void;
  toggleAll: () => void;
  setEditDevice: (device: Device) => void;
  setDeleteId: (id: string) => void;
}
export function DeviceTable({ filtered, deviceList, selected, toggleSelect, toggleAll, setEditDevice, setDeleteId }: DeviceTableProps) {
  return (
    <div className="flex-1 overflow-auto p-6">
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        {selected.size > 0 && (
          <div className="bg-blue-50 border-b border-blue-100 px-5 py-2.5 flex items-center gap-3">
            <span className="text-blue-700 font-medium" style={{ fontSize: 13 }}>{selected.size} selected</span>
            <button className="text-red-500 hover:text-red-600 flex items-center gap-1" style={{ fontSize: 13 }}>
              <Trash2 size={13} /> Delete selected
            </button>
          </div>
        )}
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50">
              <th className="py-3 px-4 text-left">
                <input
                  type="checkbox"
                  checked={selected.size === filtered.length && filtered.length > 0}
                  onChange={toggleAll}
                  className="accent-blue-600 rounded"
                />
              </th>
              {['Device', 'Group', 'Status', 'Battery', 'Signal', 'Last Location', 'Last Seen', 'Actions'].map(h => (
                <th key={h} className="py-3 px-4 text-left text-slate-500 font-semibold" style={{ fontSize: 12 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filtered.map(device => (
              <tr key={device.id} className={`hover:bg-slate-50 transition-colors ${selected.has(device.id) ? 'bg-blue-50/50' : ''}`}>
                <td className="py-3.5 px-4">
                  <input
                    type="checkbox"
                    checked={selected.has(device.id)}
                    onChange={() => toggleSelect(device.id)}
                    className="accent-blue-600 rounded"
                  />
                </td>
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                      <Radio size={14} className="text-slate-500" />
                    </div>
                    <div>
                      <div className="text-slate-800 font-medium" style={{ fontSize: 13 }}>{device.name}</div>
                      <div className="text-slate-400" style={{ fontSize: 11 }}>{device.id} • {device.model}</div>
                    </div>
                  </div>
                </td>
                <td className="py-3.5 px-4">
                  <span className="text-slate-600" style={{ fontSize: 13 }}>{device.group}</span>
                </td>
                <td className="py-3.5 px-4">
                  <StatusBadge status={device.status} />
                </td>
                <td className="py-3.5 px-4">
                  <BatteryBar value={device.battery} />
                </td>
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-2">
                    <div className="w-12 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full rounded-full bg-blue-400" style={{ width: `${device.signal}%` }} />
                    </div>
                    <span className="text-slate-500" style={{ fontSize: 12 }}>{device.signal}%</span>
                  </div>
                </td>
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-1 text-slate-500" style={{ fontSize: 12 }}>
                    <MapPin size={11} className="text-slate-400" />
                    <span className="truncate max-w-[120px]">{device.location}</span>
                  </div>
                </td>
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-1 text-slate-400" style={{ fontSize: 12 }}>
                    <Clock size={11} />
                    {device.lastSeen}
                  </div>
                </td>
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setEditDevice(device)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      onClick={() => setDeleteId(device.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="text-center py-12 text-slate-400" style={{ fontSize: 14 }}>
            No devices found matching your filters
          </div>
        )}
        <div className="border-t border-slate-100 px-5 py-3 flex items-center justify-between bg-slate-50/50">
          <span className="text-slate-400" style={{ fontSize: 12 }}>
            Showing {filtered.length} of {deviceList.length} devices
          </span>
          <div className="flex items-center gap-1">
            {[1, 2, 3].map(p => (
              <button key={p} className={`w-7 h-7 rounded-lg text-xs ${p === 1 ? 'bg-blue-600 text-white' : 'text-slate-500 hover:bg-slate-100'}`}>{p}</button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
