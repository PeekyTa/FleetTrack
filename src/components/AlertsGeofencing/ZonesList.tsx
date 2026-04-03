import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { GeofenceZone, Alert } from '../../app/data/mockData';
const ZONE_COLORS = ['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899'];
interface ZonesListProps {
  zones: GeofenceZone[];
  showAddZone: boolean;
  setShowAddZone: React.Dispatch<React.SetStateAction<boolean>>;
  newZoneName: string;
  setNewZoneName: (name: string) => void;
  newZoneColor: string;
  setNewZoneColor: (color: string) => void;
  addZone: () => void;
  selectedZoneId: string | null;
  setSelectedZoneId: React.Dispatch<React.SetStateAction<string | null>>;
  deleteZone: (id: string) => void;
  toggleZone: (id: string) => void;
}
export function ZonesList({
  zones, showAddZone, setShowAddZone, newZoneName, setNewZoneName,
  newZoneColor, setNewZoneColor, addZone, selectedZoneId, setSelectedZoneId,
  deleteZone, toggleZone
}: ZonesListProps) {
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="p-4 border-b border-slate-100">
        <button
          onClick={() => setShowAddZone(s => !s)}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 border-dashed border-slate-300 text-slate-500 hover:border-blue-400 hover:text-blue-600 transition-colors"
          style={{ fontSize: 13 }}
        >
          <Plus size={14} /> Add New Zone
        </button>
        {showAddZone && (
          <div className="mt-3 p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-3 animate-fade-in-up">
            <input
              type="text"
              placeholder="Zone name..."
              value={newZoneName}
              onChange={e => setNewZoneName(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-700 placeholder-slate-400 focus:outline-none focus:border-blue-400"
              style={{ fontSize: 13 }}
            />
            <div className="flex gap-2">
              {ZONE_COLORS.map(c => (
                <button
                  key={c}
                  onClick={() => setNewZoneColor(c)}
                  className="w-7 h-7 rounded-full border-2 transition-all"
                  style={{ backgroundColor: c, borderColor: newZoneColor === c ? '#0F172A' : 'transparent' }}
                />
              ))}
            </div>
            <div className="flex gap-2">
              <button onClick={() => setShowAddZone(false)} className="flex-1 py-2 border border-slate-200 rounded-lg text-slate-500" style={{ fontSize: 12 }}>
                Cancel
              </button>
              <button onClick={addZone} className="flex-1 py-2 bg-blue-600 text-white rounded-lg font-medium" style={{ fontSize: 12 }}>
                Create
              </button>
            </div>
          </div>
        )}
      </div>
      <div className="divide-y divide-slate-100">
        {zones.map(zone => (
          <div
            key={zone.id}
            onClick={() => setSelectedZoneId(id => id === zone.id ? null : zone.id)}
            className={`p-4 cursor-pointer transition-colors ${selectedZoneId === zone.id ? 'bg-slate-50 border-l-4' : 'hover:bg-slate-50 border-l-4 border-l-transparent'}`}
            style={selectedZoneId === zone.id ? { borderLeftColor: zone.color } : {}}
          >
            <div className="flex items-start gap-3">
              <div className="w-3 h-3 rounded mt-0.5 shrink-0" style={{ backgroundColor: zone.color }} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-slate-800 font-medium truncate" style={{ fontSize: 13 }}>{zone.name}</span>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={e => { e.stopPropagation(); deleteZone(zone.id); }}
                      className="p-1 text-slate-400 hover:text-red-500 rounded"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  <span className="px-2 py-0.5 rounded text-xs" style={{ backgroundColor: `${zone.color}15`, color: zone.color }}>
                    {zone.type}
                  </span>
                  {zone.alertOnEnter && (
                    <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-600 text-xs">Enter alert</span>
                  )}
                  {zone.alertOnExit && (
                    <span className="px-2 py-0.5 rounded bg-orange-50 text-orange-600 text-xs">Exit alert</span>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-medium ${zone.active ? 'text-green-600' : 'text-slate-400'}`}>
                    {zone.active ? '● Active' : '○ Inactive'}
                  </span>
                  <button
                    onClick={e => { e.stopPropagation(); toggleZone(zone.id); }}
                    className={`text-xs px-2.5 py-1 rounded-full font-medium transition-colors ${zone.active ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                  >
                    {zone.active ? 'Disable' : 'Enable'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
