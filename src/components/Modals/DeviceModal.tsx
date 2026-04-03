import React, { useState } from 'react';
import { X } from 'lucide-react';
import { groups, Device } from '../../app/data/mockData';
interface DeviceModalProps {
  device?: Device | null;
  onClose: () => void;
  onSave: (data: Partial<Device>) => void;
}
export function DeviceModal({ device, onClose, onSave }: DeviceModalProps) {
  const [form, setForm] = useState({
    name: device?.name || '',
    group: device?.group || groups[1],
    model: device?.model || 'Motorola SL7550e',
    imei: device?.imei || '',
  });
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md animate-fade-in-up">
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <h3 className="text-slate-800 font-semibold" style={{ fontSize: 16 }}>
            {device ? 'Edit Device' : 'Add New Device'}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 rounded-lg p-1 hover:bg-slate-100">
            <X size={18} />
          </button>
        </div>
        <div className="p-5 space-y-4">
          {[
            { label: 'Device Name', key: 'name', placeholder: 'e.g. Alpha Unit 3' },
            { label: 'IMEI Number', key: 'imei', placeholder: '15-digit IMEI' },
            { label: 'Model', key: 'model', placeholder: 'e.g. Motorola SL7550e' },
          ].map(field => (
            <div key={field.key}>
              <label className="block text-slate-600 mb-1.5" style={{ fontSize: 13, fontWeight: 500 }}>{field.label}</label>
              <input
                type="text"
                value={form[field.key as keyof typeof form]}
                onChange={e => setForm(f => ({ ...f, [field.key]: e.target.value }))}
                placeholder={field.placeholder}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 placeholder-slate-400 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400/30"
                style={{ fontSize: 14 }}
              />
            </div>
          ))}
          <div>
            <label className="block text-slate-600 mb-1.5" style={{ fontSize: 13, fontWeight: 500 }}>Group</label>
            <select
              value={form.group}
              onChange={e => setForm(f => ({ ...f, group: e.target.value }))}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:border-blue-400"
              style={{ fontSize: 14 }}
            >
              {groups.filter(g => g !== 'All Groups').map(g => <option key={g}>{g}</option>)}
            </select>
          </div>
        </div>
        <div className="flex gap-3 p-5 border-t border-slate-100">
          <button onClick={onClose} className="flex-1 py-2.5 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition-colors" style={{ fontSize: 14 }}>
            Cancel
          </button>
          <button
            onClick={() => { onSave(form); onClose(); }}
            className="flex-1 py-2.5 rounded-xl text-white font-semibold transition-colors"
            style={{ background: 'linear-gradient(135deg, #1E40AF, #2563EB)', fontSize: 14 }}
          >
            {device ? 'Save Changes' : 'Add Device'}
          </button>
        </div>
      </div>
    </div>
  );
}
