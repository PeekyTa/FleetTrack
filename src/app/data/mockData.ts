export type DeviceStatus = 'online' | 'offline' | 'low-battery' | 'warning';
export type AlertSeverity = 'critical' | 'high' | 'medium' | 'low';
export type UserRole = 'Admin' | 'Supervisor' | 'Viewer';
export type UserStatus = 'active' | 'inactive';
export interface Device {
  id: string;
  name: string;
  group: string;
  status: DeviceStatus;
  battery: number;
  lastSeen: string;
  location: string;
  signal: number;
  model: string;
  imei: string;
  mapX: number;
  mapY: number;
}
export interface Alert {
  id: number;
  type: 'geofence-exit' | 'geofence-enter' | 'low-battery' | 'signal-lost' | 'sos';
  device: string;
  deviceId: string;
  message: string;
  time: string;
  severity: AlertSeverity;
  acknowledged: boolean;
}
export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  lastLogin: string;
  devicesAccess: number;
  avatar: string;
}
export interface GeofenceZone {
  id: string;
  name: string;
  type: 'polygon' | 'circle';
  color: string;
  active: boolean;
  alertOnEnter: boolean;
  alertOnExit: boolean;
  points?: { x: number; y: number }[];
  center?: { x: number; y: number };
  radius?: number;
}
export const devices: Device[] = [
  {
    id: 'RD-001', name: 'Alpha Unit 1', group: 'Field Team A',
    status: 'online', battery: 92, lastSeen: '1 min ago',
    location: 'Downtown — Sector 4', signal: 95,
    model: 'Motorola SL7550e', imei: '354800121234567',
    mapX: 600, mapY: 210,
  },
  {
    id: 'RD-002', name: 'Alpha Unit 2', group: 'Field Team A',
    status: 'online', battery: 78, lastSeen: '2 min ago',
    location: 'Midtown — Block 22', signal: 88,
    model: 'Motorola SL7550e', imei: '354800121234568',
    mapX: 480, mapY: 310,
  },
  {
    id: 'RD-003', name: 'Beta Unit 1', group: 'Field Team B',
    status: 'low-battery', battery: 12, lastSeen: '3 min ago',
    location: 'Upper East — Sector 2', signal: 72,
    model: 'Hytera PD785G', imei: '354900231234567',
    mapX: 740, mapY: 145,
  },
  {
    id: 'RD-004', name: 'Beta Unit 2', group: 'Field Team B',
    status: 'offline', battery: 0, lastSeen: '2 hrs ago',
    location: 'Brooklyn — Zone 7', signal: 0,
    model: 'Hytera PD785G', imei: '354900231234568',
    mapX: 280, mapY: 500,
  },
  {
    id: 'RD-005', name: 'Gamma Unit 1', group: 'Security',
    status: 'online', battery: 65, lastSeen: 'just now',
    location: 'West Harbor', signal: 81,
    model: 'Kenwood TK-3601D', imei: '353200341234567',
    mapX: 160, mapY: 570,
  },
  {
    id: 'RD-006', name: 'Gamma Unit 2', group: 'Security',
    status: 'online', battery: 45, lastSeen: '5 min ago',
    location: 'East District — Sector 1', signal: 76,
    model: 'Kenwood TK-3601D', imei: '353200341234568',
    mapX: 840, mapY: 340,
  },
  {
    id: 'RD-007', name: 'Delta Unit 1', group: 'Logistics',
    status: 'warning', battery: 34, lastSeen: '8 min ago',
    location: 'North District — Block 5', signal: 60,
    model: 'Icom IC-F1000D', imei: '350300451234567',
    mapX: 570, mapY: 90,
  },
  {
    id: 'RD-008', name: 'Delta Unit 2', group: 'Logistics',
    status: 'online', battery: 88, lastSeen: '1 min ago',
    location: 'Financial District', signal: 93,
    model: 'Icom IC-F1000D', imei: '350300451234568',
    mapX: 420, mapY: 610,
  },
  {
    id: 'RD-009', name: 'Echo Unit 1', group: 'Maintenance',
    status: 'offline', battery: 0, lastSeen: '1 day ago',
    location: 'Far East Zone', signal: 0,
    model: 'Sepura STP8200', imei: '356700561234567',
    mapX: 980, mapY: 410,
  },
  {
    id: 'RD-010', name: 'Echo Unit 2', group: 'Maintenance',
    status: 'online', battery: 71, lastSeen: 'just now',
    location: 'Central Square', signal: 99,
    model: 'Sepura STP8200', imei: '356700561234568',
    mapX: 660, mapY: 265,
  },
];
export const groups = ['All Groups', 'Field Team A', 'Field Team B', 'Security', 'Logistics', 'Maintenance'];
export const alerts: Alert[] = [
  { id: 1, type: 'geofence-exit', device: 'Beta Unit 2', deviceId: 'RD-004', message: 'Exited Zone Alpha perimeter', time: '14:32', severity: 'high', acknowledged: false },
  { id: 2, type: 'low-battery', device: 'Beta Unit 1', deviceId: 'RD-003', message: 'Battery level below 15%', time: '14:28', severity: 'medium', acknowledged: false },
  { id: 3, type: 'signal-lost', device: 'Echo Unit 1', deviceId: 'RD-009', message: 'Communication signal lost', time: '08:15', severity: 'high', acknowledged: true },
  { id: 4, type: 'geofence-enter', device: 'Gamma Unit 1', deviceId: 'RD-005', message: 'Entered Restricted Zone Beta', time: '13:55', severity: 'low', acknowledged: true },
  { id: 5, type: 'sos', device: 'Delta Unit 1', deviceId: 'RD-007', message: 'Emergency SOS signal activated', time: '14:45', severity: 'critical', acknowledged: false },
  { id: 6, type: 'low-battery', device: 'Delta Unit 1', deviceId: 'RD-007', message: 'Battery level below 35%', time: '13:12', severity: 'medium', acknowledged: true },
];
export const users: User[] = [
  { id: 1, name: 'Marcus Johnson', email: 'mjohnson@fleet.com', role: 'Admin', status: 'active', lastLogin: '2 min ago', devicesAccess: 10, avatar: 'MJ' },
  { id: 2, name: 'Sarah Chen', email: 'schen@fleet.com', role: 'Supervisor', status: 'active', lastLogin: '1 hr ago', devicesAccess: 6, avatar: 'SC' },
  { id: 3, name: 'David Rodriguez', email: 'drodriguez@fleet.com', role: 'Viewer', status: 'active', lastLogin: '3 hrs ago', devicesAccess: 4, avatar: 'DR' },
  { id: 4, name: 'Emily Watson', email: 'ewatson@fleet.com', role: 'Supervisor', status: 'inactive', lastLogin: '2 days ago', devicesAccess: 8, avatar: 'EW' },
  { id: 5, name: 'James Park', email: 'jpark@fleet.com', role: 'Viewer', status: 'active', lastLogin: '30 min ago', devicesAccess: 3, avatar: 'JP' },
  { id: 6, name: 'Lisa Thompson', email: 'lthompson@fleet.com', role: 'Admin', status: 'active', lastLogin: 'just now', devicesAccess: 10, avatar: 'LT' },
];
export const geofenceZones: GeofenceZone[] = [
  {
    id: 'zone-alpha',
    name: 'Zone Alpha — Downtown',
    type: 'polygon',
    color: '#3B82F6',
    active: true,
    alertOnEnter: false,
    alertOnExit: true,
    points: [{ x: 420, y: 160 }, { x: 680, y: 160 }, { x: 680, y: 380 }, { x: 420, y: 380 }],
  },
  {
    id: 'zone-beta',
    name: 'Zone Beta — East District',
    type: 'polygon',
    color: '#EF4444',
    active: true,
    alertOnEnter: true,
    alertOnExit: true,
    points: [{ x: 720, y: 270 }, { x: 1000, y: 270 }, { x: 1000, y: 500 }, { x: 720, y: 500 }],
  },
  {
    id: 'zone-gamma',
    name: 'Zone Gamma — Harbor',
    type: 'circle',
    color: '#10B981',
    active: false,
    alertOnEnter: true,
    alertOnExit: false,
    center: { x: 180, y: 560 },
    radius: 90,
  },
];
export const historyPath = [
  { x: 250, y: 560, time: '08:00', speed: 0 },
  { x: 300, y: 490, time: '08:15', speed: 12 },
  { x: 370, y: 440, time: '08:30', speed: 18 },
  { x: 430, y: 390, time: '08:45', speed: 22 },
  { x: 490, y: 340, time: '09:00', speed: 25 },
  { x: 530, y: 290, time: '09:15', speed: 20 },
  { x: 570, y: 240, time: '09:30', speed: 15 },
  { x: 600, y: 210, time: '09:45', speed: 10 },
  { x: 660, y: 265, time: '10:00', speed: 8 },
];
export const analyticsData = {
  activeDevicesHistory: [
    { time: '08:00', online: 6, offline: 4 },
    { time: '09:00', online: 7, offline: 3 },
    { time: '10:00', online: 8, offline: 2 },
    { time: '11:00', online: 9, offline: 1 },
    { time: '12:00', online: 7, offline: 3 },
    { time: '13:00', online: 8, offline: 2 },
    { time: '14:00', online: 8, offline: 2 },
    { time: '15:00', online: 9, offline: 1 },
  ],
  signalQuality: [
    { name: 'Excellent', value: 3, color: '#10B981' },
    { name: 'Good', value: 4, color: '#3B82F6' },
    { name: 'Fair', value: 2, color: '#F59E0B' },
    { name: 'Poor', value: 1, color: '#EF4444' },
  ],
  distanceTraveled: [
    { day: 'Mon', km: 42 },
    { day: 'Tue', km: 58 },
    { day: 'Wed', km: 35 },
    { day: 'Thu', km: 71 },
    { day: 'Fri', km: 64 },
    { day: 'Sat', km: 28 },
    { day: 'Sun', km: 19 },
  ],
  alertsByType: [
    { type: 'Geofence', count: 12 },
    { type: 'Low Battery', count: 8 },
    { type: 'Signal Lost', count: 5 },
    { type: 'SOS', count: 2 },
    { type: 'Other', count: 6 },
  ],
  coverageByGroup: [
    { group: 'Field Team A', coverage: 87 },
    { group: 'Field Team B', coverage: 62 },
    { group: 'Security', coverage: 94 },
    { group: 'Logistics', coverage: 78 },
    { group: 'Maintenance', coverage: 45 },
  ],
};
