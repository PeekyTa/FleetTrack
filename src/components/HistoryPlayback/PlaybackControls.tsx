import React from 'react';
import { ChevronDown, Calendar, Radio } from 'lucide-react';
import { Device } from '../../app/data/mockData';
interface PlaybackControlsProps {
  devices: Device[];
  selectedDeviceId: string;
  setSelectedDeviceId: (id: string) => void;
  dateFrom: string;
  setDateFrom: (date: string) => void;
  dateTo: string;
  setDateTo: (date: string) => void;
  setProgress: (val: number | ((prev: number) => number)) => void;
  setPlaying: (val: boolean) => void;
  selectedDevice: Device | undefined;
  historyPath: any[];
  progressIndex: number;
}
export function PlaybackControls({
  devices, selectedDeviceId, setSelectedDeviceId,
  dateFrom, setDateFrom, dateTo, setDateTo,
  setProgress, setPlaying, selectedDevice,
  historyPath, progressIndex
}: PlaybackControlsProps) {
  return (
    <div className="w-72 bg-white border-r border-slate-200 flex flex-col shrink-0 overflow-y-auto">
      <div className="p-5 border-b border-slate-100">
        <h3 className="text-slate-800 font-semibold mb-4" style={{ fontSize: 14 }}>Playback Controls</h3>
        {}
        <div className="mb-4">
          <label className="block text-slate-500 mb-1.5" style={{ fontSize: 12, fontWeight: 500 }}>Select Device</label>
          <div className="relative">
            <select
              value={selectedDeviceId}
              onChange={e => { setSelectedDeviceId(e.target.value); setProgress(0); setPlaying(false); }}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 appearance-none focus:outline-none focus:border-blue-400"
              style={{ fontSize: 13 }}
            >
              {devices.map(d => (
                <option key={d.id} value={d.id}>{d.name} ({d.id})</option>
              ))}
            </select>
            <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
        </div>
        {}
        <div className="space-y-3">
          <div>
            <label className="block text-slate-500 mb-1.5" style={{ fontSize: 12, fontWeight: 500 }}>From</label>
            <div className="relative">
              <Calendar size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="date"
                value={dateFrom}
                onChange={e => setDateFrom(e.target.value)}
                className="w-full pl-8 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:border-blue-400"
                style={{ fontSize: 13 }}
              />
            </div>
          </div>
          <div>
            <label className="block text-slate-500 mb-1.5" style={{ fontSize: 12, fontWeight: 500 }}>To</label>
            <div className="relative">
              <Calendar size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="date"
                value={dateTo}
                onChange={e => setDateTo(e.target.value)}
                className="w-full pl-8 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:border-blue-400"
                style={{ fontSize: 13 }}
              />
            </div>
          </div>
        </div>
        <button
          onClick={() => { setProgress(0); setPlaying(true); }}
          className="w-full mt-4 py-2.5 rounded-xl text-white font-medium"
          style={{ background: 'linear-gradient(135deg, #1E40AF, #2563EB)', fontSize: 14 }}
        >
          Load History
        </button>
      </div>
      {}
      {selectedDevice && (
        <div className="p-5 border-b border-slate-100">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center">
              <Radio size={16} className="text-blue-600" />
            </div>
            <div>
              <div className="text-slate-800 font-semibold" style={{ fontSize: 13 }}>{selectedDevice.name}</div>
              <div className="text-slate-400" style={{ fontSize: 11 }}>{selectedDevice.model}</div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-slate-50 rounded-xl p-2.5 text-center">
              <div className="text-slate-800 font-semibold" style={{ fontSize: 16 }}>8.4 km</div>
              <div className="text-slate-400" style={{ fontSize: 11 }}>Total route</div>
            </div>
            <div className="bg-slate-50 rounded-xl p-2.5 text-center">
              <div className="text-slate-800 font-semibold" style={{ fontSize: 16 }}>2h 00m</div>
              <div className="text-slate-400" style={{ fontSize: 11 }}>Duration</div>
            </div>
          </div>
        </div>
      )}
      {}
      <div className="p-5 flex-1">
        <h4 className="text-slate-600 font-semibold mb-3" style={{ fontSize: 13 }}>Route Waypoints</h4>
        <div className="relative">
          <div className="absolute left-[7px] top-3 bottom-3 w-0.5 bg-slate-200" />
          <div className="space-y-3">
            {historyPath.map((point, i) => {
              const isVisited = i <= progressIndex;
              const isCurrent = i === progressIndex;
              return (
                <div key={i} className="flex items-center gap-3 pl-1">
                  <div className={`w-3.5 h-3.5 rounded-full shrink-0 border-2 transition-colors z-10 ${isCurrent ? 'border-blue-600 bg-blue-600' : isVisited ? 'border-blue-400 bg-blue-400' : 'border-slate-300 bg-white'}`} />
                  <div className={`flex-1 ${isVisited ? 'text-slate-700' : 'text-slate-400'}`}>
                    <div className="flex justify-between items-center">
                      <span style={{ fontSize: 12, fontWeight: isCurrent ? 600 : 400 }}>Stop {i + 1}</span>
                      <span style={{ fontSize: 11, color: isCurrent ? '#1E40AF' : undefined }}>{point.time}</span>
                    </div>
                    {isCurrent && (
                      <div className="text-blue-500" style={{ fontSize: 10 }}>← Current position</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
