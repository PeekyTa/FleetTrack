import React, { useState } from 'react';
import { Search, X, Battery, Signal, ChevronDown } from 'lucide-react';
import { devices, groups, Device } from '../../app/data/mockData';
const STATUS_COLORS: Record<string, string> = {
  online: '#10B981',
  offline: '#94A3B8',
  'low-battery': '#F59E0B',
  warning: '#F97316',
};
interface DeviceSidebarProps {
  showFilterPanel: boolean;
  setShowFilterPanel: (show: boolean) => void;
  filterGroup: string;
  setFilterGroup: (group: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filterStatus: string;
  setFilterStatus: (status: string) => void;
  selectedDevice: Device | null;
  setSelectedDevice: React.Dispatch<React.SetStateAction<Device | null>>;
  online: number;
  offline: number;
  lowBattery: number;
  warnings: number;
  filteredDevices: Device[];
}
export function DeviceSidebar({
  showFilterPanel, setShowFilterPanel, filterGroup, setFilterGroup,
  searchQuery, setSearchQuery, filterStatus, setFilterStatus,
  selectedDevice, setSelectedDevice, online, offline, lowBattery, warnings, filteredDevices
}: DeviceSidebarProps) {
  if (!showFilterPanel) return null;
  return (
    <div className="w-72 bg-white border-r border-slate-200 flex flex-col shrink-0">
      {}
      <div className="p-4 border-b border-slate-100">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-slate-800 font-semibold" style={{ fontSize: 14 }}>Fleet Devices</h3>
          <button onClick={() => setShowFilterPanel(false)} className="text-slate-400 hover:text-slate-600">
            <X size={16} />
          </button>
        </div>
        {}
        <div className="relative mb-3">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search devices..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400/30"
            style={{ fontSize: 13 }}
          />
        </div>
        {}
        <div className="relative">
          <select
            value={filterGroup}
            onChange={e => setFilterGroup(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-600 appearance-none focus:outline-none focus:border-blue-400"
            style={{ fontSize: 13 }}
          >
            {groups.map(g => <option key={g}>{g}</option>)}
          </select>
          <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        </div>
      </div>
      {}
      <div className="px-4 py-2 border-b border-slate-100 flex gap-1">
        {[
          { key: 'all', label: 'All', count: devices.length },
          { key: 'online', label: 'Online', count: online },
          { key: 'offline', label: 'Offline', count: offline },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setFilterStatus(tab.key)}
            className={`flex-1 px-2 py-1.5 rounded-lg transition-colors flex items-center justify-center gap-1 ${filterStatus === tab.key ? 'bg-blue-600 text-white' : 'text-slate-500 hover:bg-slate-50'}`}
            style={{ fontSize: 12 }}
          >
            {tab.label}
            <span className={`px-1 rounded ${filterStatus === tab.key ? 'bg-white/20' : 'bg-slate-100'}`} style={{ fontSize: 10 }}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>
      {}
      <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
        {filteredDevices.map(device => (
          <button
            key={device.id}
            onClick={() => setSelectedDevice(d => d?.id === device.id ? null : device)}
            className={`w-full text-left p-3 rounded-xl border transition-all ${selectedDevice?.id === device.id ? 'border-blue-300 bg-blue-50' : 'border-slate-100 hover:border-slate-200 hover:bg-slate-50'}`}
          >
            <div className="flex items-start gap-2.5">
              <div
                className="w-2 h-2 rounded-full mt-1.5 shrink-0"
                style={{ backgroundColor: STATUS_COLORS[device.status] }}
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <span className="text-slate-800 font-medium truncate" style={{ fontSize: 13 }}>{device.name}</span>
                  <span className="text-slate-400 shrink-0" style={{ fontSize: 11 }}>{device.id}</span>
                </div>
                <div className="text-slate-400 truncate mt-0.5" style={{ fontSize: 11 }}>{device.group}</div>
                <div className="flex items-center gap-3 mt-1.5">
                  <div className="flex items-center gap-1">
                    <Battery size={10} className="text-slate-400" />
                    <span style={{ fontSize: 11, color: device.battery < 20 ? '#EF4444' : '#64748B' }}>{device.battery}%</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Signal size={10} className="text-slate-400" />
                    <span className="text-slate-500" style={{ fontSize: 11 }}>{device.signal}%</span>
                  </div>
                </div>
              </div>
            </div>
          </button>
        ))}
        {filteredDevices.length === 0 && (
          <div className="text-center py-8 text-slate-400" style={{ fontSize: 13 }}>No devices match filters</div>
        )}
      </div>
      {}
      <div className="border-t border-slate-100 p-3 grid grid-cols-2 gap-2">
        {[
          { label: 'Online', count: online, color: '#10B981' },
          { label: 'Offline', count: offline, color: '#94A3B8' },
          { label: 'Low Battery', count: lowBattery, color: '#F59E0B' },
          { label: 'Warning', count: warnings, color: '#F97316' },
        ].map(s => (
          <div key={s.label} className="flex items-center gap-1.5 bg-slate-50 rounded-lg px-2 py-1.5">
            <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: s.color }} />
            <span className="text-slate-500" style={{ fontSize: 11 }}>{s.label}</span>
            <span className="ml-auto font-semibold text-slate-700" style={{ fontSize: 12 }}>{s.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
