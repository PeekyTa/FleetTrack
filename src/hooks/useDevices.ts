import { useState, useEffect, useCallback } from 'react';
import { deviceApi } from '../services/api';
import { useSocket } from '../context/SocketContext';
import type { Device, DeviceStats } from '../types/index';
export function useDevices() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [stats, setStats] = useState<DeviceStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { socket } = useSocket();
  const fetchDevices = useCallback(async () => {
    try {
      setLoading(true);
      const data = await deviceApi.getAll();
      setDevices(data);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors du chargement des appareils');
    } finally {
      setLoading(false);
    }
  }, []);
  const fetchStats = useCallback(async () => {
    try {
      const data = await deviceApi.getStats();
      setStats(data);
    } catch {  }
  }, []);
  useEffect(() => {
    fetchDevices();
    fetchStats();
  }, [fetchDevices, fetchStats]);
  useEffect(() => {
    if (!socket) return;
    const handleStatusChange = (data: { deviceId: number; status: string; battery?: number; signal?: number }) => {
      setDevices((prev) =>
        prev.map((d) =>
          d.id === data.deviceId
            ? { ...d, status: data.status as any, battery: data.battery ?? d.battery, signal: data.signal ?? d.signal }
            : d
        )
      );
    };
    socket.on('device:statusChange', handleStatusChange);
    return () => { socket.off('device:statusChange', handleStatusChange); };
  }, [socket]);
  const createDevice = useCallback(async (device: Partial<Device>) => {
    const created = await deviceApi.create(device);
    setDevices((prev) => [created, ...prev]);
    return created;
  }, []);
  const updateDevice = useCallback(async (id: number, device: Partial<Device>) => {
    const updated = await deviceApi.update(id, device);
    setDevices((prev) => prev.map((d) => (d.id === id ? updated : d)));
    return updated;
  }, []);
  const deleteDevice = useCallback(async (id: number) => {
    await deviceApi.delete(id);
    setDevices((prev) => prev.filter((d) => d.id !== id));
  }, []);
  return {
    devices, stats, loading, error,
    fetchDevices, fetchStats, createDevice, updateDevice, deleteDevice,
  };
}
