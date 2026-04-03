import React from 'react';
import { Search, ChevronDown, RefreshCw, Download, Plus } from 'lucide-react';
interface DeviceToolbarProps {
  search: string;
  setSearch: (search: string) => void;
  statusFilter: string;
  setStatusFilter: (filter: string) => void;
  onAddDevice: () => void;
}
export function DeviceToolbar({ search, setSearch, statusFilter, setStatusFilter, onAddDevice }: DeviceToolbarProps) {
  return (
    <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center gap-3">
      <div className="relative flex-1 max-w-sm">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Search by name, ID, model..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 placeholder-slate-400 focus:outline-none focus:border-blue-400"
          style={{ fontSize: 13 }}
        />
      </div>
      <div className="relative">
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="pl-3 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-600 appearance-none focus:outline-none focus:border-blue-400"
          style={{ fontSize: 13 }}
        >
          <option value="all">All Status</option>
          <option value="online">Online</option>
          <option value="offline">Offline</option>
          <option value="low-battery">Low Battery</option>
          <option value="warning">Warning</option>
        </select>
        <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
      </div>
      <button className="flex items-center gap-2 px-3 py-2 border border-slate-200 rounded-lg text-slate-500 hover:bg-slate-50 transition-colors" style={{ fontSize: 13 }}>
        <RefreshCw size={13} /> Refresh
      </button>
      <button className="flex items-center gap-2 px-3 py-2 border border-slate-200 rounded-lg text-slate-500 hover:bg-slate-50 transition-colors" style={{ fontSize: 13 }}>
        <Download size={13} /> Export
      </button>
      <button
        onClick={onAddDevice}
        className="flex items-center gap-2 px-4 py-2 rounded-lg text-white font-medium ml-auto transition-colors"
        style={{ background: 'linear-gradient(135deg, #1E40AF, #2563EB)', fontSize: 13 }}
      >
        <Plus size={14} /> Add Device
      </button>
    </div>
  );
}
