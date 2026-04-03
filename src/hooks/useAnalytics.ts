import { useState, useEffect, useCallback } from 'react';
import { analyticsApi } from '../services/api';
import type { AnalyticsDeviceActivity, SignalQuality, CoverageByGroup, DistanceByDay } from '../types/index';
export function useAnalytics(period: string = 'week') {
  const [deviceActivity, setDeviceActivity] = useState<AnalyticsDeviceActivity | null>(null);
  const [signalQuality, setSignalQuality] = useState<SignalQuality[]>([]);
  const [coverage, setCoverage] = useState<CoverageByGroup[]>([]);
  const [distance, setDistance] = useState<DistanceByDay[]>([]);
  const [alertStats, setAlertStats] = useState<{ byType: any[]; bySeverity: any[] } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const fetchAll = useCallback(async () => {
    try {
      setLoading(true);
      const [act, sig, cov, dist, alerts] = await Promise.all([
        analyticsApi.getDeviceActivity(period),
        analyticsApi.getSignalQuality(),
        analyticsApi.getCoverage(),
        analyticsApi.getDistanceStats(),
        analyticsApi.getAlertStats(),
      ]);
      setDeviceActivity(act);
      setSignalQuality(sig);
      setCoverage(cov);
      setDistance(dist);
      setAlertStats(alerts);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors du chargement des analytiques');
    } finally {
      setLoading(false);
    }
  }, [period]);
  useEffect(() => {
    fetchAll();
  }, [fetchAll]);
  const totalDistance = distance.reduce((s, d) => s + d.km, 0);
  const totalAlerts = alertStats?.byType.reduce((s: number, d: any) => s + d.count, 0) ?? 0;
  return {
    deviceActivity, signalQuality, coverage, distance, alertStats,
    totalDistance, totalAlerts, loading, error, fetchAll,
  };
}
