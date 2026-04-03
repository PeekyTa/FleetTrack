import { useState, useEffect, useCallback } from 'react';
import { geofenceApi } from '../services/api';
import type { GeofenceZone } from '../types/index';
export function useGeofences() {
  const [zones, setZones] = useState<GeofenceZone[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const fetchZones = useCallback(async () => {
    try {
      setLoading(true);
      const data = await geofenceApi.getAll();
      setZones(data);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors du chargement des zones');
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    fetchZones();
  }, [fetchZones]);
  const createZone = useCallback(async (zone: Partial<GeofenceZone>) => {
    const created = await geofenceApi.create(zone);
    setZones((prev) => [created, ...prev]);
    return created;
  }, []);
  const updateZone = useCallback(async (id: number, zone: Partial<GeofenceZone>) => {
    const updated = await geofenceApi.update(id, zone);
    setZones((prev) => prev.map((z) => (z.id === id ? updated : z)));
    return updated;
  }, []);
  const deleteZone = useCallback(async (id: number) => {
    await geofenceApi.delete(id);
    setZones((prev) => prev.filter((z) => z.id !== id));
  }, []);
  const toggleZone = useCallback(async (id: number) => {
    const updated = await geofenceApi.toggleActive(id);
    setZones((prev) => prev.map((z) => (z.id === id ? updated : z)));
  }, []);
  return {
    zones, loading, error,
    fetchZones, createZone, updateZone, deleteZone, toggleZone,
  };
}
