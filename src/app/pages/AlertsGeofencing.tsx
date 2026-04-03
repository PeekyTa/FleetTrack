import { useState, useMemo } from 'react';
import { Bell, Shield, Check, CheckCheck, MapPin, BatteryLow, WifiOff, AlertTriangle } from 'lucide-react';
import { LeafletMap } from '../../components/Map/LeafletMap';
import { useAlerts } from '../../hooks/useAlerts';
import { useGeofences } from '../../hooks/useGeofences';
import { useLocations } from '../../hooks/useLocations';
import { useAuth } from '../../context/AuthContext';
const SEVERITY_CONFIG: Record<string, { color: string; bg: string; label: string }> = {
  CRITICAL: { color: '#DC2626', bg: '#FEF2F2', label: 'Critique' },
  HIGH: { color: '#EA580C', bg: '#FFF7ED', label: 'Élevée' },
  MEDIUM: { color: '#D97706', bg: '#FFFBEB', label: 'Moyenne' },
  LOW: { color: '#059669', bg: '#F0FDF4', label: 'Faible' },
};
const TYPE_ICONS: Record<string, any> = {
  GEOFENCE_EXIT: MapPin,
  GEOFENCE_ENTER: MapPin,
  LOW_BATTERY: BatteryLow,
  SIGNAL_LOST: WifiOff,
  SOS: AlertTriangle,
};
const TYPE_LABELS: Record<string, string> = {
  GEOFENCE_EXIT: 'Sortie de zone',
  GEOFENCE_ENTER: 'Entrée de zone',
  LOW_BATTERY: 'Batterie faible',
  SIGNAL_LOST: 'Signal perdu',
  SOS: 'SOS',
};
export function AlertsGeofencing() {
  const { alerts, loading, acknowledgeAlert, acknowledgeAll, unacknowledgedCount } = useAlerts();
  const { zones, loading: zonesLoading, toggleZone} = useGeofences();
  const { deviceLocations } = useLocations();
  const { hasPermission } = useAuth();
  const [tab, setTab] = useState<'alerts' | 'zones'>('alerts');
  const [filterSeverity, setFilterSeverity] = useState('all');
  const [filterAck, setFilterAck] = useState('all');
  const filteredAlerts = useMemo(() => {
    return alerts.filter((a) => {
      const sevMatch = filterSeverity === 'all' || a.severity === filterSeverity;
      const ackMatch = filterAck === 'all' ||
        (filterAck === 'unack' && !a.acknowledged) ||
        (filterAck === 'ack' && a.acknowledged);
      return sevMatch && ackMatch;
    });
  }, [alerts, filterSeverity, filterAck]);
  return (
    <div className="flex h-full overflow-hidden">
      {}
      <div className="w-80 bg-white border-r border-slate-200 flex flex-col shrink-0">
        {}
        <div className="flex border-b border-slate-200">
          <button
            onClick={() => setTab('alerts')}
            className={`flex-1 py-3 text-center flex items-center justify-center gap-2 ${
              tab === 'alerts' ? 'text-blue-600 border-b-2 border-blue-600 font-semibold' : 'text-slate-500'
            }`}
            style={{ fontSize: 13 }}
          >
            <Bell size={14} />
            Alertes
            {unacknowledgedCount > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-red-500 text-white font-bold" style={{ fontSize: 10 }}>
                {unacknowledgedCount}
              </span>
            )}
          </button>
          {hasPermission('viewGeofences') && (
            <button
              onClick={() => setTab('zones')}
              className={`flex-1 py-3 text-center flex items-center justify-center gap-2 ${
                tab === 'zones' ? 'text-blue-600 border-b-2 border-blue-600 font-semibold' : 'text-slate-500'
              }`}
              style={{ fontSize: 13 }}
            >
              <Shield size={14} />
              Zones ({zones.length})
            </button>
          )}
        </div>
        {tab === 'alerts' ? (
          <>
            {}
            <div className="p-3 border-b border-slate-100 space-y-2">
              <div className="flex gap-1 flex-wrap">
                {['all', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].map((s) => (
                  <button
                    key={s}
                    onClick={() => setFilterSeverity(s)}
                    className={`px-2 py-1 rounded-md ${filterSeverity === s ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'}`}
                    style={{ fontSize: 10 }}
                  >
                    {s === 'all' ? 'Toutes' : SEVERITY_CONFIG[s]?.label}
                  </button>
                ))}
              </div>
              <div className="flex gap-1">
                {[
                  { value: 'all', label: 'Toutes' },
                  { value: 'unack', label: 'Non acquittées' },
                  { value: 'ack', label: 'Acquittées' },
                ].map((f) => (
                  <button
                    key={f.value}
                    onClick={() => setFilterAck(f.value)}
                    className={`px-2 py-1 rounded-md flex-1 ${filterAck === f.value ? 'bg-slate-700 text-white' : 'bg-slate-100 text-slate-500'}`}
                    style={{ fontSize: 10 }}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
              {hasPermission('acknowledgeAlerts') && unacknowledgedCount > 0 && (
                <button
                  onClick={() => acknowledgeAll()}
                  className="w-full py-1.5 bg-green-50 text-green-700 rounded-lg flex items-center justify-center gap-1.5 hover:bg-green-100"
                  style={{ fontSize: 11 }}
                >
                  <CheckCheck size={12} /> Tout acquitter
                </button>
              )}
            </div>
            {}
            <div className="flex-1 overflow-y-auto">
              {loading ? (
                <div className="p-8 text-center text-slate-400" style={{ fontSize: 13 }}>Chargement...</div>
              ) : filteredAlerts.length === 0 ? (
                <div className="p-8 text-center text-slate-400" style={{ fontSize: 13 }}>Aucune alerte</div>
              ) : (
                filteredAlerts.map((alert) => {
                  const sev = SEVERITY_CONFIG[alert.severity] || SEVERITY_CONFIG.LOW;
                  const Icon = TYPE_ICONS[alert.type] || Bell;
                  return (
                    <div key={alert.id} className={`px-4 py-3 border-b border-slate-50 hover:bg-slate-50 ${alert.acknowledged ? 'opacity-60' : ''}`}>
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: sev.bg }}>
                          <Icon size={14} style={{ color: sev.color }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-slate-700 font-medium truncate" style={{ fontSize: 12 }}>
                              {TYPE_LABELS[alert.type] || alert.type}
                            </span>
                            <span className="px-1.5 py-0.5 rounded-full font-medium shrink-0" style={{ fontSize: 9, backgroundColor: sev.bg, color: sev.color }}>
                              {sev.label}
                            </span>
                          </div>
                          <div className="text-slate-500 mt-0.5" style={{ fontSize: 11 }}>{alert.message}</div>
                          <div className="text-slate-400 mt-1 flex items-center gap-2" style={{ fontSize: 10 }}>
                            <span>{alert.device.name}</span>
                            <span>•</span>
                            <span>{new Date(alert.createdAt).toLocaleString('fr-FR', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' })}</span>
                          </div>
                        </div>
                        {!alert.acknowledged && hasPermission('acknowledgeAlerts') && (
                          <button
                            onClick={() => acknowledgeAlert(alert.id)}
                            className="p-1.5 rounded-lg text-green-500 hover:bg-green-50 shrink-0"
                            title="Acquitter"
                          >
                            <Check size={14} />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </>
        ) : (
          <div className="flex-1 overflow-y-auto">
            {zonesLoading ? (
              <div className="p-8 text-center text-slate-400">Chargement...</div>
            ) : (
              zones.map((zone) => (
                <div key={zone.id} className="px-4 py-3 border-b border-slate-50 hover:bg-slate-50">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-sm shrink-0" style={{ backgroundColor: zone.color }} />
                    <div className="flex-1 min-w-0">
                      <div className="text-slate-700 font-medium truncate" style={{ fontSize: 13 }}>{zone.name}</div>
                      <div className="text-slate-400" style={{ fontSize: 11 }}>
                        {zone.type} • {zone.active ? 'Active' : 'Inactive'}
                      </div>
                    </div>
                    {hasPermission('manageGeofences') && (
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => toggleZone(zone.id)}
                          className={`px-2 py-1 rounded-md ${zone.active ? 'bg-green-50 text-green-600' : 'bg-slate-100 text-slate-400'}`}
                          style={{ fontSize: 10 }}
                        >
                          {zone.active ? 'Active' : 'Inactive'}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
      {}
      <div className="flex-1">
        <LeafletMap
          deviceLocations={deviceLocations}
          geofenceZones={zones}
          showGeofences={true}
          height="100%"
        />
      </div>
    </div>
  );
}
