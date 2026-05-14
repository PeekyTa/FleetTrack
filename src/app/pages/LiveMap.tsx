import { useState, useMemo } from 'react';
import { Search, Filter, Wifi, WifiOff, BatteryLow, AlertTriangle } from 'lucide-react';
import { LeafletMap } from '../../components/Map/LeafletMap';
import { useLocations } from '../../hooks/useLocations';
import { useGeofences } from '../../hooks/useGeofences';
import { useAuth } from '../../context/AuthContext';

const STATUS_FILTERS = [
  { value: 'all', label: 'Tous' },
  { value: 'ONLINE', label: 'En ligne' },
  { value: 'OFFLINE', label: 'Hors ligne' },
  { value: 'LOW_BATTERY', label: 'Batterie faible' },
  { value: 'WARNING', label: 'Alerte' },
];
export function LiveMap() {
  const { deviceLocations, loading } = useLocations();
  const { zones } = useGeofences();
  const { hasPermission } = useAuth();
  const [selectedDeviceId, setSelectedDeviceId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showPanel, setShowPanel] = useState(true);
  const filtered = useMemo(() => {
    return deviceLocations.filter((dl) => {
      const statusMatch = filterStatus === 'all' || dl.status === filterStatus;
      const searchMatch = !searchQuery ||
        dl.deviceName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dl.deviceIdentifier.toLowerCase().includes(searchQuery.toLowerCase());
      return statusMatch && searchMatch;
    });
  }, [deviceLocations, filterStatus, searchQuery]);
  const counts = useMemo(() => ({
    total: deviceLocations.length,
    online: deviceLocations.filter((d) => d.status === 'ONLINE').length,
    offline: deviceLocations.filter((d) => d.status === 'OFFLINE').length,
    lowBattery: deviceLocations.filter((d) => d.status === 'LOW_BATTERY').length,
    warning: deviceLocations.filter((d) => d.status === 'WARNING').length,
  }), [deviceLocations]);

  return (
    <div className="flex h-full overflow-hidden relative">
      {}
      {showPanel && (
        <div className="absolute inset-y-0 left-0 z-[1001] w-full sm:w-80 sm:relative sm:z-10 bg-white border-r border-slate-200 flex flex-col shrink-0 shadow-2xl sm:shadow-none">
          {}
          <div className="grid grid-cols-4 gap-1 p-3 border-b border-slate-100 relative">
            <button 
              onClick={() => setShowPanel(false)} 
              className="sm:hidden absolute top-2 right-2 p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-lg"
            >
              Fermer
            </button>
            {[
              { value: counts.online, color: '#10B981', icon: Wifi },
              { value: counts.offline, color: '#94A3B8', icon: WifiOff },
              { value: counts.lowBattery, color: '#F59E0B', icon: BatteryLow },
              { value: counts.warning, color: '#EF4444', icon: AlertTriangle },
            ].map((s, i) => (
              <div key={i} className="text-center py-2 rounded-lg" style={{ background: `${s.color}10` }}>
                <s.icon size={14} style={{ color: s.color, margin: '0 auto 2px' }} />
                <div style={{ fontSize: 16, fontWeight: 700, color: s.color }}>{s.value}</div>
              </div>
            ))}
          </div>
          {}
          <div className="p-3 border-b border-slate-100">
            <div className="relative">
              <label htmlFor="livemap-device-search" className="sr-only">Rechercher un appareil</label>
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                id="livemap-device-search"
                name="search"
                type="text"
                placeholder="Rechercher un appareil..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 placeholder-slate-400 focus:outline-none focus:border-blue-400"
                style={{ fontSize: 12 }}
              />
            </div>
            <div className="flex gap-1 mt-2 flex-wrap">
              {STATUS_FILTERS.map((f) => (
                <button
                  key={f.value}
                  onClick={() => setFilterStatus(f.value)}
                  className={`px-2.5 py-1 rounded-md transition-colors ${
                    filterStatus === f.value ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                  }`}
                  style={{ fontSize: 11 }}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
          {}
          <div className="flex-1 overflow-y-auto">
            {filtered.map((dl) => (
              <button
                key={dl.deviceId}
                onClick={() => setSelectedDeviceId(dl.deviceId)}
                className={`w-full text-left px-4 py-3 border-b border-slate-50 hover:bg-slate-50 transition-colors ${
                  selectedDeviceId === dl.deviceId ? 'bg-blue-50 border-l-2 border-l-blue-500' : ''
                }`}
              >
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{
                    backgroundColor:
                      dl.status === 'ONLINE' ? '#10B981' :
                      dl.status === 'OFFLINE' ? '#94A3B8' :
                      dl.status === 'LOW_BATTERY' ? '#F59E0B' : '#EF4444'
                  }} />
                  <div className="flex-1 min-w-0">
                    <div className="text-slate-700 font-medium truncate" style={{ fontSize: 13 }}>{dl.deviceName}</div>
                    <div className="text-slate-400 truncate" style={{ fontSize: 11 }}>
                      {dl.deviceIdentifier} • {dl.groupName}
                    </div>
                  </div>
                  <div className="text-slate-400 shrink-0" style={{ fontSize: 11 }}>{dl.battery}%</div>
                </div>
              </button>
            ))}
            {filtered.length === 0 && (
              <div className="p-8 text-center text-slate-400" style={{ fontSize: 13 }}>
                Aucun appareil trouvé
              </div>
            )}
          </div>
        </div>
      )}
      {}
      <div className="flex-1 relative">
        <button
          onClick={() => setShowPanel(!showPanel)}
          className="absolute top-3 left-3 z-[1000] bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-slate-500 hover:bg-slate-50 shadow-sm"
          style={{ fontSize: 12 }}
        >
          <Filter size={14} />
        </button>
        {loading ? (
          <div className="h-full flex items-center justify-center bg-slate-100">
            <span className="text-slate-400">Chargement de la carte...</span>
          </div>
        ) : (
          <LeafletMap
            deviceLocations={filtered}
            selectedDeviceId={selectedDeviceId}
            onDeviceClick={setSelectedDeviceId}
            geofenceZones={zones}
            showGeofences={hasPermission('viewGeofences')}
            height="100%"
          />
        )}
      </div>
    </div>
  );
}
