import React from 'react';
import { NavLink } from 'react-router';
import { ChevronRight, Radio, MapPin, Battery } from 'lucide-react';
import { devices } from '../../app/data/mockData';
export function DeviceList() {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-slate-800 font-semibold" style={{ fontSize: 15 }}>Active Devices</h3>
        <NavLink to="/map" className="text-blue-600 flex items-center gap-1 hover:text-blue-700" style={{ fontSize: 12 }}>
          View on map <ChevronRight size={14} />
        </NavLink>
      </div>
      <div className="space-y-2">
        {devices.filter((d: any) => d.status === 'online').slice(0, 5).map((device: any) => (
          <div key={device.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors border border-slate-100">
            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
              <Radio size={14} className="text-blue-600" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-slate-700 font-medium" style={{ fontSize: 13 }}>{device.name}</span>
                <span className="text-slate-400 text-xs">{device.id}</span>
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <MapPin size={10} className="text-slate-400 shrink-0" />
                <span className="text-slate-400 truncate" style={{ fontSize: 11 }}>{device.location}</span>
              </div>
            </div>
            <div className="flex flex-col items-end gap-1">
              <div className="flex items-center gap-1">
                <Battery size={11} className="text-green-500" />
                <span className="text-green-600 font-medium" style={{ fontSize: 12 }}>{device.battery}%</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
                <span className="text-slate-400" style={{ fontSize: 11 }}>{device.lastSeen}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
