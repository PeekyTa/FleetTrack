import React from 'react';
import { Trash2 } from 'lucide-react';
import { Device } from '../../app/data/mockData';
interface DeleteDeviceModalProps {
  deviceList: Device[];
  deleteId: string;
  setDeleteId: (id: string | null) => void;
  handleDelete: (id: string) => void;
}
export function DeleteDeviceModal({ deviceList, deleteId, setDeleteId, handleDelete }: DeleteDeviceModalProps) {
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm animate-fade-in-up">
        <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mb-4">
          <Trash2 size={22} className="text-red-500" />
        </div>
        <h3 className="text-slate-800 font-semibold mb-2" style={{ fontSize: 16 }}>Delete Device</h3>
        <p className="text-slate-500 mb-5" style={{ fontSize: 14 }}>
          Are you sure you want to remove <strong>{deviceList.find(d => d.id === deleteId)?.name}</strong>? This action cannot be undone.
        </p>
        <div className="flex gap-3">
          <button onClick={() => setDeleteId(null)} className="flex-1 py-2.5 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50" style={{ fontSize: 14 }}>
            Cancel
          </button>
          <button onClick={() => handleDelete(deleteId)} className="flex-1 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl font-medium" style={{ fontSize: 14 }}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
