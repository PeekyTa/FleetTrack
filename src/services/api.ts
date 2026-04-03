import axios from 'axios';
import type {
  AuthUser, User, Device, DeviceStats, Location, DeviceLocation,
  Alert, GeofenceZone, AnalyticsDeviceActivity, AnalyticsAlertStats,
  SignalQuality, CoverageByGroup, DistanceByDay,
} from '../types/index';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});
api.interceptors.request.use((config) => {
  const stored = localStorage.getItem('userInfo');
  if (stored) {
    try {
      const { token } = JSON.parse(stored) as AuthUser;
      if (token) config.headers.Authorization = `Bearer ${token}`;
    } catch {  }
  }
  return config;
});
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('userInfo');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
export const authApi = {
  login: async (email: string, password: string): Promise<AuthUser> => {
    const { data } = await api.post('/auth/login', { email, password });
    localStorage.setItem('userInfo', JSON.stringify(data));
    return data;
  },
  register: async (name: string, email: string, password: string, role: string): Promise<AuthUser> => {
    const { data } = await api.post('/auth/register', { name, email, password, role });
    return data;
  },
  getProfile: async (): Promise<User> => {
    const { data } = await api.get('/auth/me');
    return data;
  },
  logout: () => {
    localStorage.removeItem('userInfo');
  },
};
export const deviceApi = {
  getAll: async (): Promise<Device[]> => {
    const { data } = await api.get('/devices');
    return data;
  },
  getById: async (id: number): Promise<Device> => {
    const { data } = await api.get(`/devices/${id}`);
    return data;
  },
  create: async (device: Partial<Device>): Promise<Device> => {
    const { data } = await api.post('/devices', device);
    return data;
  },
  update: async (id: number, device: Partial<Device>): Promise<Device> => {
    const { data } = await api.put(`/devices/${id}`, device);
    return data;
  },
  delete: async (id: number): Promise<void> => {
    await api.delete(`/devices/${id}`);
  },
  getStats: async (): Promise<DeviceStats> => {
    const { data } = await api.get('/devices/stats');
    return data;
  },
  assign: async (userId: number, deviceId: number): Promise<void> => {
    await api.post('/devices/assign', { userId, deviceId });
  },
};
export const locationApi = {
  getAllLatest: async (): Promise<DeviceLocation[]> => {
    const { data } = await api.get('/locations/all/latest');
    return data;
  },
  getHistory: async (deviceId: number, limit?: number, from?: string, to?: string): Promise<Location[]> => {
    const params = new URLSearchParams();
    if (limit) params.set('limit', String(limit));
    if (from) params.set('from', from);
    if (to) params.set('to', to);
    const { data } = await api.get(`/locations/${deviceId}?${params}`);
    return data;
  },
  getLatest: async (deviceId: number): Promise<Location> => {
    const { data } = await api.get(`/locations/latest/${deviceId}`);
    return data;
  },
  addLocation: async (loc: { deviceId: number; latitude: number; longitude: number; speed?: number }): Promise<Location> => {
    const { data } = await api.post('/locations', loc);
    return data;
  },
};
export const alertApi = {
  getAll: async (acknowledged?: boolean): Promise<Alert[]> => {
    const params = acknowledged !== undefined ? `?acknowledged=${acknowledged}` : '';
    const { data } = await api.get(`/alerts${params}`);
    return data;
  },
  acknowledge: async (id: number): Promise<Alert> => {
    const { data } = await api.put(`/alerts/${id}/acknowledge`);
    return data;
  },
  acknowledgeAll: async (): Promise<{ count: number }> => {
    const { data } = await api.put('/alerts/acknowledge-all');
    return data;
  },
  getStats: async (): Promise<{ total: number; unacknowledged: number }> => {
    const { data } = await api.get('/alerts/stats');
    return data;
  },
};
export const geofenceApi = {
  getAll: async (): Promise<GeofenceZone[]> => {
    const { data } = await api.get('/geofences');
    return data;
  },
  create: async (zone: Partial<GeofenceZone>): Promise<GeofenceZone> => {
    const { data } = await api.post('/geofences', zone);
    return data;
  },
  update: async (id: number, zone: Partial<GeofenceZone>): Promise<GeofenceZone> => {
    const { data } = await api.put(`/geofences/${id}`, zone);
    return data;
  },
  delete: async (id: number): Promise<void> => {
    await api.delete(`/geofences/${id}`);
  },
  toggleActive: async (id: number): Promise<GeofenceZone> => {
    const { data } = await api.put(`/geofences/${id}/toggle`);
    return data;
  },
};
export const userApi = {
  getAll: async (): Promise<User[]> => {
    const { data } = await api.get('/users');
    return data;
  },
  create: async (user: { name: string; email: string; password: string; role?: string }): Promise<User> => {
    const { data } = await api.post('/users', user);
    return data;
  },
  update: async (id: number, user: Partial<User>): Promise<User> => {
    const { data } = await api.put(`/users/${id}`, user);
    return data;
  },
  delete: async (id: number): Promise<void> => {
    await api.delete(`/users/${id}`);
  },
  getStats: async (): Promise<{ total: number; active: number; byRole: any[] }> => {
    const { data } = await api.get('/users/stats');
    return data;
  },
};
export const analyticsApi = {
  getDashboard: async (): Promise<any> => {
    const { data } = await api.get('/analytics/dashboard');
    return data;
  },
  getDeviceActivity: async (period?: string): Promise<AnalyticsDeviceActivity> => {
    const { data } = await api.get(`/analytics/devices${period ? `?period=${period}` : ''}`);
    return data;
  },
  getAlertStats: async (): Promise<AnalyticsAlertStats> => {
    const { data } = await api.get('/analytics/alerts');
    return data;
  },
  getDistanceStats: async (): Promise<DistanceByDay[]> => {
    const { data } = await api.get('/analytics/distance');
    return data;
  },
  getCoverage: async (): Promise<CoverageByGroup[]> => {
    const { data } = await api.get('/analytics/coverage');
    return data;
  },
  getSignalQuality: async (): Promise<SignalQuality[]> => {
    const { data } = await api.get('/analytics/signal');
    return data;
  },
};
export default api;
