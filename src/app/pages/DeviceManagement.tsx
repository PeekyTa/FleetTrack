import React, { useState, useMemo } from 'react';
import { Plus, Search, Edit2, Trash2, X, Radio, Wifi, WifiOff, BatteryLow, AlertTriangle } from 'lucide-react';
import { useDevices } from '../../hooks/useDevices';
import { useAuth } from '../../context/AuthContext';
import { RoleGuard } from '../../guards/RoleGuard';
import type { Device } from '../../types/index';
const STATUS_INFO: Record<string, { color: string; bg: string; label: string }> = {
  ONLINE: { color: '#10B981', bg: '#F0FDF4', label: 'En ligne' },
  OFFLINE: { color: '#94A3B8', bg: '#F8FAFC', label: 'Hors ligne' },
  LOW_BATTERY: { color: '#F59E0B', bg: '#FFFBEB', label: 'Batterie faible' },
  WARNING: { color: '#EF4444', bg: '#FEF2F2', label: 'Alerte' },
};
export function DeviceManagement() {
  const { devices, loading, createDevice, updateDevice, deleteDevice } = useDevices();
  const { hasPermission } = useAuth();
  const [search, setSearch] = useState('');
  const [groupFilter, setGroupFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [editDevice, setEditDevice] = useState<Device | null | undefined>(undefined);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const groups = useMemo(() => {
    const gs = new Set(devices.map((d) => d.groupName));
    return ['all', ...Array.from(gs)];
  }, [devices]);
  const filtered = useMemo(() => {
    return devices.filter((d) => {
      const groupMatch = groupFilter === 'all' || d.groupName === groupFilter;
      const statusMatch = statusFilter === 'all' || d.status === statusFilter;
      const searchMatch = !search ||
        d.name.toLowerCase().includes(search.toLowerCase()) ||
        d.deviceIdentifier.toLowerCase().includes(search.toLowerCase());
      return groupMatch && statusMatch && searchMatch;
    });
  }, [devices, groupFilter, statusFilter, search]);
  const groupCounts = useMemo(() => {
    return groups.filter((g) => g !== 'all').map((g) => ({
      group: g,
      count: devices.filter((d) => d.groupName === g).length,
      online: devices.filter((d) => d.groupName === g && d.status === 'ONLINE').length,
    }));
  }, [devices, groups]);
  const handleSave = async (data: Partial<Device>) => {
    try {
      if (editDevice) {
        await updateDevice(editDevice.id, data);
      } else {
        await createDevice(data);
      }
      setEditDevice(undefined);
    } catch (err) {
      console.error('Error saving device:', err);
    }
  };
  const handleDelete = async (id: number) => {
    try {
      await deleteDevice(id);
      setDeleteId(null);
    } catch (err) {
      console.error('Error deleting device:', err);
    }
  };
  return (
    <RoleGuard allowedRoles={['ADMIN', 'SUPERVISOR']}>
      <div className="flex h-full overflow-hidden">
        {}
        <div className="w-56 bg-white border-r border-slate-200 flex flex-col shrink-0">
          <div className="p-4 border-b border-slate-100">
            <h3 className="text-slate-700 font-semibold" style={{ fontSize: 14 }}>Groupes</h3>
            <div className="text-slate-400" style={{ fontSize: 12 }}>{devices.length} appareils</div>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            <button
              onClick={() => setGroupFilter('all')}
              className={`w-full text-left px-3 py-2.5 rounded-xl transition-colors ${
                groupFilter === 'all' ? 'bg-blue-50 text-blue-700' : 'text-slate-500 hover:bg-slate-50'
              }`}
              style={{ fontSize: 13 }}
            >
              Tous les groupes
            </button>
            {groupCounts.map((gc) => (
              <button
                key={gc.group}
                onClick={() => setGroupFilter(gc.group)}
                className={`w-full text-left px-3 py-2.5 rounded-xl transition-colors ${
                  groupFilter === gc.group ? 'bg-blue-50 text-blue-700' : 'text-slate-500 hover:bg-slate-50'
                }`}
                style={{ fontSize: 13 }}
              >
                <div className="flex justify-between items-center">
                  <span className="truncate">{gc.group}</span>
                  <span className="text-xs text-slate-400">{gc.online}/{gc.count}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
        {}
        <div className="flex-1 flex flex-col overflow-hidden">
          {}
          <div className="px-6 py-4 bg-white border-b border-slate-200 flex items-center gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Rechercher un appareil..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 placeholder-slate-400 focus:outline-none focus:border-blue-400"
                style={{ fontSize: 13 }}
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-600"
              style={{ fontSize: 13 }}
            >
              <option value="all">Tous les statuts</option>
              <option value="ONLINE">En ligne</option>
              <option value="OFFLINE">Hors ligne</option>
              <option value="LOW_BATTERY">Batterie faible</option>
              <option value="WARNING">Alerte</option>
            </select>
            {hasPermission('manageDevices') && (
              <button
                onClick={() => setEditDevice(null)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-white font-medium ml-auto"
                style={{ background: 'linear-gradient(135deg, #1E40AF, #2563EB)', fontSize: 13 }}
              >
                <Plus size={14} /> Ajouter
              </button>
            )}
          </div>
          {}
          <div className="flex-1 overflow-auto">
            {loading ? (
              <div className="flex items-center justify-center h-48 text-slate-400">Chargement...</div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/50 sticky top-0">
                    {['Appareil', 'Groupe', 'Statut', 'Batterie', 'Signal', 'Modèle', 'Actions'].map((h) => (
                      <th key={h} className="py-3 px-5 text-left text-slate-500 font-semibold" style={{ fontSize: 12 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filtered.map((device) => {
                    const si = STATUS_INFO[device.status] || STATUS_INFO.OFFLINE;
                    return (
                      <tr key={device.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3.5 px-5">
                          <div className="text-slate-700 font-medium" style={{ fontSize: 13 }}>{device.name}</div>
                          <div className="text-slate-400" style={{ fontSize: 11 }}>{device.deviceIdentifier}</div>
                        </td>
                        <td className="py-3.5 px-5 text-slate-500" style={{ fontSize: 12 }}>{device.groupName}</td>
                        <td className="py-3.5 px-5">
                          <span className="px-2.5 py-1 rounded-full font-medium" style={{ backgroundColor: si.bg, color: si.color, fontSize: 11 }}>
                            {si.label}
                          </span>
                        </td>
                        <td className="py-3.5 px-5">
                          <div className="flex items-center gap-2">
                            <div className="w-16 h-1.5 bg-slate-100 rounded-full">
                              <div className="h-full rounded-full" style={{
                                width: `${device.battery}%`,
                                background: device.battery > 50 ? '#10B981' : device.battery > 20 ? '#F59E0B' : '#EF4444',
                              }} />
                            </div>
                            <span className="text-slate-500" style={{ fontSize: 11 }}>{device.battery}%</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-5 text-slate-500" style={{ fontSize: 12 }}>{device.signal}%</td>
                        <td className="py-3.5 px-5 text-slate-400" style={{ fontSize: 12 }}>{device.model || '—'}</td>
                        <td className="py-3.5 px-5">
                          {hasPermission('manageDevices') && (
                            <div className="flex items-center gap-1">
                              <button onClick={() => setEditDevice(device)} className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50">
                                <Edit2 size={14} />
                              </button>
                              <button onClick={() => setDeleteId(device.id)} className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50">
                                <Trash2 size={14} />
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
            {!loading && filtered.length === 0 && (
              <div className="text-center py-12 text-slate-400" style={{ fontSize: 14 }}>Aucun appareil trouvé</div>
            )}
          </div>
        </div>
        {}
        {editDevice !== undefined && (
          <DeviceFormModal
            device={editDevice}
            onClose={() => setEditDevice(undefined)}
            onSave={handleSave}
          />
        )}
        {}
        {deleteId !== null && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm animate-fade-in-up">
              <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mb-4">
                <Trash2 size={22} className="text-red-500" />
              </div>
              <h3 className="text-slate-800 font-semibold mb-2" style={{ fontSize: 16 }}>Supprimer l'appareil</h3>
              <p className="text-slate-500 mb-5" style={{ fontSize: 14 }}>
                Supprimer <strong>{devices.find((d) => d.id === deleteId)?.name}</strong> ? Toutes les données associées seront perdues.
              </p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteId(null)} className="flex-1 py-2.5 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50" style={{ fontSize: 14 }}>
                  Annuler
                </button>
                <button onClick={() => handleDelete(deleteId)} className="flex-1 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl font-medium" style={{ fontSize: 14 }}>
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </RoleGuard>
  );
}
function DeviceFormModal({ device, onClose, onSave }: {
  device: Device | null;
  onClose: () => void;
  onSave: (data: Partial<Device>) => void;
}) {
  const [form, setForm] = useState({
    name: device?.name || '',
    deviceIdentifier: device?.deviceIdentifier || '',
    groupName: device?.groupName || '',
    model: device?.model || '',
    imei: device?.imei || '',
  });
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md animate-fade-in-up">
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <h3 className="text-slate-800 font-semibold" style={{ fontSize: 16 }}>
            {device ? 'Modifier l\'appareil' : 'Ajouter un appareil'}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 rounded-lg p-1 hover:bg-slate-100">
            <X size={18} />
          </button>
        </div>
        <div className="p-5 space-y-4">
          {[
            { key: 'name', label: 'Nom', placeholder: 'Alpha Unit 1' },
            { key: 'deviceIdentifier', label: 'Identifiant', placeholder: 'RD-011' },
            { key: 'groupName', label: 'Groupe', placeholder: 'Équipe Terrain A' },
            { key: 'model', label: 'Modèle', placeholder: 'Motorola SL7550e' },
            { key: 'imei', label: 'IMEI', placeholder: '354800121234567' },
          ].map(({ key, label, placeholder }) => (
            <div key={key}>
              <label className="block text-slate-600 mb-1.5" style={{ fontSize: 13, fontWeight: 500 }}>{label}</label>
              <input
                type="text"
                value={(form as any)[key]}
                onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                placeholder={placeholder}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 placeholder-slate-400 focus:outline-none focus:border-blue-400"
                style={{ fontSize: 14 }}
              />
            </div>
          ))}
        </div>
        <div className="flex gap-3 p-5 border-t border-slate-100">
          <button onClick={onClose} className="flex-1 py-2.5 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50" style={{ fontSize: 14 }}>
            Annuler
          </button>
          <button
            onClick={() => onSave(form)}
            className="flex-1 py-2.5 rounded-xl text-white font-semibold"
            style={{ background: 'linear-gradient(135deg, #1E40AF, #2563EB)', fontSize: 14 }}
          >
            {device ? 'Enregistrer' : 'Créer'}
          </button>
        </div>
      </div>
    </div>
  );
}
