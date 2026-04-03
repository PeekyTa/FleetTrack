import React from 'react';
import { Plus } from 'lucide-react';
interface GroupPanelProps {
  deviceList: any[];
  groupFilter: string;
  setGroupFilter: (group: string) => void;
  groupCounts: { group: string; count: number; online: number }[];
}
export function GroupPanel({ deviceList, groupFilter, setGroupFilter, groupCounts }: GroupPanelProps) {
  return (
    <div className="w-56 bg-white border-r border-slate-200 p-4 shrink-0 flex flex-col gap-3">
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-slate-700 font-semibold" style={{ fontSize: 14 }}>Groups</h3>
        <button className="text-blue-600 hover:text-blue-700">
          <Plus size={15} />
        </button>
      </div>
      <div className="space-y-1">
        {[
          { name: 'All Groups', count: deviceList.length, online: deviceList.filter(d => d.status === 'online').length },
          ...groupCounts.map(g => ({ name: g.group, count: g.count, online: g.online }))
        ].map(g => (
          <button
            key={g.name}
            onClick={() => setGroupFilter(g.name)}
            className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-left transition-colors ${groupFilter === g.name ? 'bg-blue-50 border border-blue-200' : 'hover:bg-slate-50 border border-transparent'}`}
          >
            <div className={`w-2 h-2 rounded-full ${groupFilter === g.name ? 'bg-blue-600' : 'bg-slate-300'}`} />
            <span className={`flex-1 truncate ${groupFilter === g.name ? 'text-blue-700 font-medium' : 'text-slate-600'}`} style={{ fontSize: 13 }}>
              {g.name}
            </span>
            <span className="text-slate-400" style={{ fontSize: 11 }}>{g.online}/{g.count}</span>
          </button>
        ))}
      </div>
      <div className="mt-auto pt-4 border-t border-slate-100">
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-3">
          <div className="text-blue-700 font-semibold" style={{ fontSize: 20 }}>{deviceList.length}</div>
          <div className="text-blue-500" style={{ fontSize: 12 }}>Total Devices</div>
          <div className="mt-2 h-1.5 bg-blue-100 rounded-full">
            <div className="h-full rounded-full bg-blue-500" style={{ width: `${(deviceList.filter(d => d.status === 'online').length / deviceList.length) * 100}%` }} />
          </div>
          <div className="text-blue-400 mt-1" style={{ fontSize: 11 }}>{deviceList.filter(d => d.status === 'online').length} online</div>
        </div>
      </div>
    </div>
  );
}
