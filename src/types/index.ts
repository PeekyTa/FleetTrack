export type UserRole = 'ADMIN' | 'SUPERVISOR' | 'OPERATOR' | 'VIEWER';
export type UserStatus = 'active' | 'inactive';
export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  lastLogin: string | null;
  createdAt: string;
  _count?: { assignedDevices: number };
}
export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  token: string;
}
export type DeviceStatus = 'ONLINE' | 'OFFLINE' | 'LOW_BATTERY' | 'WARNING';
export interface Device {
  id: number;
  deviceIdentifier: string;
  name: string;
  groupName: string;
  model: string | null;
  imei: string | null;
  status: DeviceStatus;
  battery: number;
  signal: number;
  lastSeen: string | null;
  createdAt: string;
  _count?: { locations: number; alerts: number };
}
export interface DeviceStats {
  total: number;
  online: number;
  offline: number;
  lowBattery: number;
  warning: number;
  groups: { groupName: string; _count: { id: number } }[];
}
export interface Location {
  id: number;
  deviceId: number;
  latitude: number;
  longitude: number;
  speed: number | null;
  altitude: number | null;
  heading: number | null;
  timestamp: string;
}
export interface DeviceLocation {
  deviceId: number;
  deviceName: string;
  deviceIdentifier: string;
  groupName: string;
  status: DeviceStatus;
  battery: number;
  signal: number;
  location: Location;
}
export type AlertType = 'GEOFENCE_EXIT' | 'GEOFENCE_ENTER' | 'LOW_BATTERY' | 'SIGNAL_LOST' | 'SOS';
export type AlertSeverity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
export interface Alert {
  id: number;
  type: AlertType;
  severity: AlertSeverity;
  deviceId: number;
  message: string;
  acknowledged: boolean;
  acknowledgedBy: number | null;
  acknowledgedAt: string | null;
  createdAt: string;
  device: { id: number; name: string; deviceIdentifier: string };
}
export interface GeofenceCoordinates {
  type: 'polygon' | 'circle';
  points?: { lat: number; lng: number }[];
  center?: { lat: number; lng: number };
  radius?: number;
}
export interface GeofenceZone {
  id: number;
  name: string;
  type: string;
  color: string;
  active: boolean;
  alertOnEnter: boolean;
  alertOnExit: boolean;
  coordinates: GeofenceCoordinates;
  createdAt: string;
}
export interface AnalyticsDeviceActivity {
  current: { online: number; offline: number; lowBattery: number; warning: number };
  history: { time: string; hour: string; online: number; offline: number }[];
}
export interface AnalyticsAlertStats {
  byType: { type: string; count: number }[];
  bySeverity: { severity: string; count: number }[];
  recentAlerts: Alert[];
}
export interface SignalQuality {
  name: string;
  value: number;
  color: string;
}
export interface CoverageByGroup {
  group: string;
  total: number;
  online: number;
  coverage: number;
}
export interface DistanceByDay {
  day: string;
  km: number;
}
export const ROLE_PERMISSIONS: Record<UserRole, {
  viewDashboard: boolean;
  viewMap: boolean;
  viewDevices: boolean;
  manageDevices: boolean;
  viewHistory: boolean;
  viewAlerts: boolean;
  acknowledgeAlerts: boolean;
  viewGeofences: boolean;
  manageGeofences: boolean;
  viewAnalytics: boolean;
  viewUsers: boolean;
  manageUsers: boolean;
  viewSettings: boolean;
}> = {
  ADMIN: {
    viewDashboard: true, viewMap: true, viewDevices: true, manageDevices: true,
    viewHistory: true, viewAlerts: true, acknowledgeAlerts: true, viewGeofences: true,
    manageGeofences: true, viewAnalytics: true, viewUsers: true, manageUsers: true, viewSettings: true,
  },
  SUPERVISOR: {
    viewDashboard: true, viewMap: true, viewDevices: true, manageDevices: false,
    viewHistory: true, viewAlerts: true, acknowledgeAlerts: true, viewGeofences: true,
    manageGeofences: true, viewAnalytics: true, viewUsers: false, manageUsers: false, viewSettings: false,
  },
  OPERATOR: {
    viewDashboard: true, viewMap: true, viewDevices: false, manageDevices: false,
    viewHistory: true, viewAlerts: true, acknowledgeAlerts: true, viewGeofences: false,
    manageGeofences: false, viewAnalytics: false, viewUsers: false, manageUsers: false, viewSettings: false,
  },
  VIEWER: {
    viewDashboard: true, viewMap: true, viewDevices: false, manageDevices: false,
    viewHistory: true, viewAlerts: true, acknowledgeAlerts: false, viewGeofences: false,
    manageGeofences: false, viewAnalytics: false, viewUsers: false, manageUsers: false, viewSettings: false,
  },
};
