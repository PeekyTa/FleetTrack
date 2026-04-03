import React, { useState, useEffect, useRef } from 'react';
import { Clock, MapPin, Gauge, Route, Play, Pause, SkipBack, SkipForward } from 'lucide-react';
import { HistoryMap } from '../../components/Map/HistoryMap';
import { useDevices } from '../../hooks/useDevices';
import { useLocationHistory } from '../../hooks/useLocations';
export function HistoryPlayback() {
  const { devices } = useDevices();
  const [selectedDeviceId, setSelectedDeviceId] = useState<number | null>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [speed, setSpeed] = useState(1);
  const [dateFrom, setDateFrom] = useState('2026-03-01');
  const [dateTo, setDateTo] = useState('2026-04-03');
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const { history, loading: historyLoading, fetchHistory } = useLocationHistory(selectedDeviceId);
  useEffect(() => {
    if (devices.length > 0 && !selectedDeviceId) {
      setSelectedDeviceId(devices[0].id);
    }
  }, [devices, selectedDeviceId]);
  useEffect(() => {
    if (playing) {
      intervalRef.current = setInterval(() => {
        setProgress((p) => {
          if (p >= 100) {
            setPlaying(false);
            return 100;
          }
          return p + 1.5 * speed;
        });
      }, 100);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [playing, speed]);
  const handleDeviceChange = (id: number) => {
    setSelectedDeviceId(id);
    setProgress(0);
    setPlaying(false);
  };
  const handleLoadHistory = () => {
    if (selectedDeviceId) {
      fetchHistory(selectedDeviceId, 200, dateFrom ? new Date(dateFrom).toISOString() : undefined, dateTo ? new Date(dateTo).toISOString() : undefined);
      setProgress(0);
      setPlaying(false);
    }
  };
  const selectedDevice = devices.find((d) => d.id === selectedDeviceId);
  const totalDistance = history.length > 0 ? (history.length * 0.4).toFixed(1) : '0';
  const avgSpeed = history.length > 0
    ? (history.reduce((s, l) => s + (l.speed || 0), 0) / history.length).toFixed(1)
    : '0';
  const stats = [
    { icon: Route, label: 'Distance Parcourue', value: `${totalDistance} km`, color: '#1E40AF' },
    { icon: Gauge, label: 'Vitesse Moyenne', value: `${avgSpeed} km/h`, color: '#0D9488' },
    { icon: Clock, label: 'Durée', value: `${Math.floor(progress / 100 * history.length * 6)} min`, color: '#F59E0B' },
    { icon: MapPin, label: 'Points GPS', value: `${history.length}`, color: '#EF4444' },
  ];
  return (
    <div className="flex h-full overflow-hidden">
      {}
      <div className="w-72 bg-white border-r border-slate-200 flex flex-col shrink-0">
        <div className="p-4 border-b border-slate-100">
          <h3 className="text-slate-700 font-semibold mb-3" style={{ fontSize: 14 }}>Lecture d'Historique</h3>
          {}
          <label className="block text-slate-600 mb-1" style={{ fontSize: 12, fontWeight: 500 }}>Appareil</label>
          <select
            value={selectedDeviceId || ''}
            onChange={(e) => handleDeviceChange(parseInt(e.target.value))}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 mb-3"
            style={{ fontSize: 13 }}
          >
            <option value="">Sélectionner un appareil</option>
            {devices.map((d) => (
              <option key={d.id} value={d.id}>{d.name} ({d.deviceIdentifier})</option>
            ))}
          </select>
          {/* Date range */}
          <div className="grid grid-cols-2 gap-2 mb-3">
            <div>
              <label className="block text-slate-500 mb-1" style={{ fontSize: 11 }}>Du</label>
              <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)}
                className="w-full px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700" style={{ fontSize: 12 }} />
            </div>
            <div>
              <label className="block text-slate-500 mb-1" style={{ fontSize: 11 }}>Au</label>
              <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)}
                className="w-full px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700" style={{ fontSize: 12 }} />
            </div>
          </div>
          <button
            onClick={handleLoadHistory}
            className="w-full py-2 rounded-lg text-white font-medium"
            style={{ background: 'linear-gradient(135deg, #1E40AF, #2563EB)', fontSize: 13 }}
          >
            Charger l'historique
          </button>
        </div>
        {}
        {selectedDevice && (
          <div className="p-4 border-b border-slate-100">
            <div className="text-slate-700 font-semibold" style={{ fontSize: 14 }}>{selectedDevice.name}</div>
            <div className="text-slate-400" style={{ fontSize: 12 }}>{selectedDevice.deviceIdentifier}</div>
            <div className="text-slate-400 mt-1" style={{ fontSize: 11 }}>{selectedDevice.groupName} • {selectedDevice.model}</div>
          </div>
        )}
        {}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="text-slate-600 font-medium mb-2" style={{ fontSize: 12 }}>Points de passage ({history.length})</div>
          <div className="space-y-1">
            {history.slice(0, 30).map((loc, i) => (
              <div key={loc.id} className="flex items-center gap-2 py-1 text-slate-500" style={{ fontSize: 11 }}>
                <div className="w-4 h-4 rounded-full border-2 border-blue-300 flex items-center justify-center shrink-0">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                </div>
                <span className="truncate">
                  {new Date(loc.timestamp).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })} — {loc.speed?.toFixed(0) || 0} km/h
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
      {}
      <div className="flex-1 flex flex-col overflow-hidden">
        {}
        <div className="grid grid-cols-4 gap-3 p-4 bg-white border-b border-slate-200">
          {stats.map((s) => (
            <div key={s.label} className="flex items-center gap-3 bg-slate-50 rounded-xl p-3">
              <s.icon size={18} style={{ color: s.color }} />
              <div>
                <div className="text-slate-800 font-bold" style={{ fontSize: 16 }}>{s.value}</div>
                <div className="text-slate-400" style={{ fontSize: 10 }}>{s.label}</div>
              </div>
            </div>
          ))}
        </div>
        {}
        <div className="flex-1 relative">
          {historyLoading ? (
            <div className="h-full flex items-center justify-center bg-slate-100 text-slate-400">Chargement de l'historique...</div>
          ) : (
            <HistoryMap history={history} progressPercent={Math.min(progress, 100)} height="100%" />
          )}
        </div>
        {}
        <div className="bg-white border-t border-slate-200 px-6 py-4">
          <div className="flex items-center gap-4">
            <button onClick={() => { setProgress(0); setPlaying(false); }} className="p-2 rounded-lg text-slate-400 hover:bg-slate-100">
              <SkipBack size={16} />
            </button>
            <button
              onClick={() => setPlaying(!playing)}
              className="w-10 h-10 rounded-full flex items-center justify-center text-white shadow-md"
              style={{ background: 'linear-gradient(135deg, #1E40AF, #2563EB)' }}
            >
              {playing ? <Pause size={18} /> : <Play size={18} className="ml-0.5" />}
            </button>
            <button onClick={() => { setProgress(100); setPlaying(false); }} className="p-2 rounded-lg text-slate-400 hover:bg-slate-100">
              <SkipForward size={16} />
            </button>
            {}
            <div className="flex-1 mx-4">
              <input
                type="range" min={0} max={100} step={0.5}
                value={Math.min(progress, 100)}
                onChange={(e) => { setProgress(parseFloat(e.target.value)); setPlaying(false); }}
                className="w-full accent-blue-600"
              />
            </div>
            {}
            <div className="flex items-center gap-1.5">
              {[0.5, 1, 2, 4].map((s) => (
                <button
                  key={s}
                  onClick={() => setSpeed(s)}
                  className={`px-2 py-1 rounded ${speed === s ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'}`}
                  style={{ fontSize: 11, fontWeight: 600 }}
                >
                  {s}x
                </button>
              ))}
            </div>
            <div className="text-slate-500 font-medium" style={{ fontSize: 13 }}>
              {Math.round(Math.min(progress, 100))}%
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
