import { useState, useEffect, useCallback } from 'react';
import { alertApi } from '../services/api';
import { useSocket } from '../context/SocketContext';
import type { Alert } from '../types/index';
export function useAlerts() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { socket } = useSocket();
  const fetchAlerts = useCallback(async () => {
    try {
      setLoading(true);
      const data = await alertApi.getAll();
      setAlerts(data);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors du chargement des alertes');
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    fetchAlerts();
  }, [fetchAlerts]);
  useEffect(() => {
    if (!socket) return;
    const handleNewAlert = (data: Alert) => {
      setAlerts((prev) => [data, ...prev]);
    };
    const handleAcknowledged = (data: { id: number }) => {
      setAlerts((prev) =>
        prev.map((a) => (a.id === data.id ? { ...a, acknowledged: true } : a))
      );
    };
    socket.on('alert:new', handleNewAlert);
    socket.on('alert:acknowledged', handleAcknowledged);
    return () => {
      socket.off('alert:new', handleNewAlert);
      socket.off('alert:acknowledged', handleAcknowledged);
    };
  }, [socket]);
  const acknowledgeAlert = useCallback(async (id: number) => {
    await alertApi.acknowledge(id);
    setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, acknowledged: true } : a)));
  }, []);
  const acknowledgeAll = useCallback(async () => {
    await alertApi.acknowledgeAll();
    setAlerts((prev) => prev.map((a) => ({ ...a, acknowledged: true })));
  }, []);
  const unacknowledgedCount = alerts.filter((a) => !a.acknowledged).length;
  return {
    alerts, loading, error, unacknowledgedCount,
    fetchAlerts, acknowledgeAlert, acknowledgeAll,
  };
}
