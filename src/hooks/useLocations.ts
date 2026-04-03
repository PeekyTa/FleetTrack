import { useState, useEffect, useCallback } from 'react';
import { locationApi } from '../services/api';
import { useSocket } from '../context/SocketContext';
import type { DeviceLocation, Location } from '../types/index';
export function useLocations() {
  const [deviceLocations, setDeviceLocations] = useState<DeviceLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { socket } = useSocket();
  const fetchAllLatest = useCallback(async () => {
    try {
      setLoading(true);
      const data = await locationApi.getAllLatest();
      setDeviceLocations(data);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors du chargement des positions');
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    fetchAllLatest();
  }, [fetchAllLatest]);
  useEffect(() => {
    if (!socket) return;
    const handleLocationUpdate = (data: {
      deviceId: number; latitude: number; longitude: number; speed?: number; timestamp: string;
    }) => {
      setDeviceLocations((prev) =>
        prev.map((dl) =>
          dl.deviceId === data.deviceId
            ? {
                ...dl,
                location: {
                  ...dl.location,
                  latitude: data.latitude,
                  longitude: data.longitude,
                  speed: data.speed ?? dl.location.speed,
                  timestamp: data.timestamp,
                },
              }
            : dl
        )
      );
    };
    socket.on('device:locationUpdate', handleLocationUpdate);
    return () => { socket.off('device:locationUpdate', handleLocationUpdate); };
  }, [socket]);
  return { deviceLocations, loading, error, fetchAllLatest };
}
export function useLocationHistory(deviceId: number | null) {
  const [history, setHistory] = useState<Location[]>([]);
  const [loading, setLoading] = useState(false);
  const fetchHistory = useCallback(async (id: number, limit?: number, from?: string, to?: string) => {
    try {
      setLoading(true);
      const data = await locationApi.getHistory(id, limit, from, to);
      setHistory(data);
    } catch {  }
    finally { setLoading(false); }
  }, []);
  useEffect(() => {
    if (deviceId) fetchHistory(deviceId);
  }, [deviceId, fetchHistory]);
  return { history, loading, fetchHistory };
}
