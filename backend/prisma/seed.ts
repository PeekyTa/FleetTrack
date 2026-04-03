import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
const prisma = new PrismaClient();
async function main() {
  console.log('🌱 Début du semis de données...');
  await prisma.auditLog.deleteMany();
  await prisma.deviceAssignment.deleteMany();
  await prisma.location.deleteMany();
  await prisma.alert.deleteMany();
  await prisma.geofenceZone.deleteMany();
  await prisma.device.deleteMany();
  await prisma.user.deleteMany();
  await prisma.setting.deleteMany();
  const salt = await bcrypt.genSalt(10);
  const defaultPass = await bcrypt.hash('password123', salt);
  const users = await Promise.all([
    prisma.user.create({
      data: { name: 'Marcus Johnson', email: 'admin@fleettrack.io', password: await bcrypt.hash('admin123', salt), role: 'ADMIN', status: 'active', lastLogin: new Date() },
    }),
    prisma.user.create({
      data: { name: 'Sarah Chen', email: 'schen@fleettrack.io', password: defaultPass, role: 'SUPERVISOR', status: 'active', lastLogin: new Date(Date.now() - 3600000) },
    }),
    prisma.user.create({
      data: { name: 'David Rodriguez', email: 'drodriguez@fleettrack.io', password: defaultPass, role: 'OPERATOR', status: 'active', lastLogin: new Date(Date.now() - 10800000) },
    }),
    prisma.user.create({
      data: { name: 'Emily Watson', email: 'ewatson@fleettrack.io', password: defaultPass, role: 'SUPERVISOR', status: 'inactive', lastLogin: new Date(Date.now() - 172800000) },
    }),
    prisma.user.create({
      data: { name: 'James Park', email: 'jpark@fleettrack.io', password: defaultPass, role: 'VIEWER', status: 'active', lastLogin: new Date(Date.now() - 1800000) },
    }),
    prisma.user.create({
      data: { name: 'Lisa Thompson', email: 'lthompson@fleettrack.io', password: defaultPass, role: 'OPERATOR', status: 'active', lastLogin: new Date() },
    }),
  ]);
  console.log(`✅ ${users.length} utilisateurs créés`);
  const devices = await Promise.all([
    prisma.device.create({
      data: { deviceIdentifier: 'RD-001', name: 'Alpha Unit 1', groupName: 'Équipe Terrain A', model: 'Motorola SL7550e', imei: '354800121234567', status: 'ONLINE', battery: 92, signal: 95, lastSeen: new Date() },
    }),
    prisma.device.create({
      data: { deviceIdentifier: 'RD-002', name: 'Alpha Unit 2', groupName: 'Équipe Terrain A', model: 'Motorola SL7550e', imei: '354800121234568', status: 'ONLINE', battery: 78, signal: 88, lastSeen: new Date(Date.now() - 120000) },
    }),
    prisma.device.create({
      data: { deviceIdentifier: 'RD-003', name: 'Beta Unit 1', groupName: 'Équipe Terrain B', model: 'Hytera PD785G', imei: '354900231234567', status: 'LOW_BATTERY', battery: 12, signal: 72, lastSeen: new Date(Date.now() - 180000) },
    }),
    prisma.device.create({
      data: { deviceIdentifier: 'RD-004', name: 'Beta Unit 2', groupName: 'Équipe Terrain B', model: 'Hytera PD785G', imei: '354900231234568', status: 'OFFLINE', battery: 0, signal: 0, lastSeen: new Date(Date.now() - 7200000) },
    }),
    prisma.device.create({
      data: { deviceIdentifier: 'RD-005', name: 'Gamma Unit 1', groupName: 'Sécurité', model: 'Kenwood TK-3601D', imei: '353200341234567', status: 'ONLINE', battery: 65, signal: 81, lastSeen: new Date() },
    }),
    prisma.device.create({
      data: { deviceIdentifier: 'RD-006', name: 'Gamma Unit 2', groupName: 'Sécurité', model: 'Kenwood TK-3601D', imei: '353200341234568', status: 'ONLINE', battery: 45, signal: 76, lastSeen: new Date(Date.now() - 300000) },
    }),
    prisma.device.create({
      data: { deviceIdentifier: 'RD-007', name: 'Delta Unit 1', groupName: 'Logistique', model: 'Icom IC-F1000D', imei: '350300451234567', status: 'WARNING', battery: 34, signal: 60, lastSeen: new Date(Date.now() - 480000) },
    }),
    prisma.device.create({
      data: { deviceIdentifier: 'RD-008', name: 'Delta Unit 2', groupName: 'Logistique', model: 'Icom IC-F1000D', imei: '350300451234568', status: 'ONLINE', battery: 88, signal: 93, lastSeen: new Date(Date.now() - 60000) },
    }),
    prisma.device.create({
      data: { deviceIdentifier: 'RD-009', name: 'Echo Unit 1', groupName: 'Maintenance', model: 'Sepura STP8200', imei: '356700561234567', status: 'OFFLINE', battery: 0, signal: 0, lastSeen: new Date(Date.now() - 86400000) },
    }),
    prisma.device.create({
      data: { deviceIdentifier: 'RD-010', name: 'Echo Unit 2', groupName: 'Maintenance', model: 'Sepura STP8200', imei: '356700561234568', status: 'ONLINE', battery: 71, signal: 99, lastSeen: new Date() },
    }),
  ]);
  console.log(`✅ ${devices.length} appareils créés`);
  await prisma.deviceAssignment.createMany({
    data: [
      { userId: users[2].id, deviceId: devices[0].id },
      { userId: users[2].id, deviceId: devices[1].id },
      { userId: users[2].id, deviceId: devices[4].id },
      { userId: users[2].id, deviceId: devices[5].id },
      { userId: users[2].id, deviceId: devices[7].id },
      { userId: users[4].id, deviceId: devices[0].id },
      { userId: users[4].id, deviceId: devices[2].id },
      { userId: users[4].id, deviceId: devices[9].id },
      { userId: users[5].id, deviceId: devices[2].id },
      { userId: users[5].id, deviceId: devices[3].id },
      { userId: users[5].id, deviceId: devices[6].id },
      { userId: users[5].id, deviceId: devices[8].id },
    ],
  });
  console.log('✅ Assignations d\'appareils créées');
  const baseLocations: { lat: number; lng: number }[] = [
    { lat: 36.8065, lng: 10.1815 },
    { lat: 36.8121, lng: 10.1691 },
    { lat: 36.8529, lng: 10.3217 },
    { lat: 36.8837, lng: 10.3303 },
    { lat: 36.8286, lng: 10.1772 },
    { lat: 36.7915, lng: 10.1555 },
    { lat: 36.7667, lng: 10.2333 },
    { lat: 36.8546, lng: 10.1983 },
    { lat: 36.8378, lng: 10.2974 },
    { lat: 36.8665, lng: 10.2524 },
  ];
  const locationData = [];
  for (let i = 0; i < devices.length; i++) {
    const base = baseLocations[i];
    for (let j = 0; j < 20; j++) {
      locationData.push({
        deviceId: devices[i].id,
        latitude: base.lat + (Math.random() - 0.5) * 0.01,
        longitude: base.lng + (Math.random() - 0.5) * 0.01,
        speed: 5 + Math.random() * 30,
        altitude: 35 + Math.random() * 10,
        heading: Math.random() * 360,
        timestamp: new Date(Date.now() - (20 - j) * 360000), 
      });
    }
  }
  await prisma.location.createMany({ data: locationData });
  console.log(`✅ ${locationData.length} positions GPS créées`);
  const alerts = await Promise.all([
    prisma.alert.create({
      data: { type: 'GEOFENCE_EXIT', severity: 'HIGH', deviceId: devices[3].id, message: 'Sortie du périmètre Zone Alpha', acknowledged: false },
    }),
    prisma.alert.create({
      data: { type: 'LOW_BATTERY', severity: 'MEDIUM', deviceId: devices[2].id, message: 'Niveau de batterie inférieur à 15%', acknowledged: false },
    }),
    prisma.alert.create({
      data: { type: 'SIGNAL_LOST', severity: 'HIGH', deviceId: devices[8].id, message: 'Signal de communication perdu', acknowledged: true, acknowledgedBy: users[0].id, acknowledgedAt: new Date() },
    }),
    prisma.alert.create({
      data: { type: 'GEOFENCE_ENTER', severity: 'LOW', deviceId: devices[4].id, message: 'Entrée dans la zone restreinte Beta', acknowledged: true, acknowledgedBy: users[1].id, acknowledgedAt: new Date() },
    }),
    prisma.alert.create({
      data: { type: 'SOS', severity: 'CRITICAL', deviceId: devices[6].id, message: 'Signal SOS d\'urgence activé', acknowledged: false },
    }),
    prisma.alert.create({
      data: { type: 'LOW_BATTERY', severity: 'MEDIUM', deviceId: devices[6].id, message: 'Niveau de batterie inférieur à 35%', acknowledged: true, acknowledgedBy: users[0].id, acknowledgedAt: new Date() },
    }),
  ]);
  console.log(`✅ ${alerts.length} alertes créées`);
  const zones = await Promise.all([
    prisma.geofenceZone.create({
      data: {
        name: 'Zone Alpha — Centre-ville',
        type: 'polygon',
        color: '#3B82F6',
        active: true,
        alertOnEnter: false,
        alertOnExit: true,
        coordinates: {
          type: 'polygon',
          points: [
            { lat: 36.805, lng: 10.175 },
            { lat: 36.815, lng: 10.175 },
            { lat: 36.815, lng: 10.185 },
            { lat: 36.805, lng: 10.185 },
          ],
        },
      },
    }),
    prisma.geofenceZone.create({
      data: {
        name: 'Zone Beta — Quartier Est',
        type: 'polygon',
        color: '#EF4444',
        active: true,
        alertOnEnter: true,
        alertOnExit: true,
        coordinates: {
          type: 'polygon',
          points: [
            { lat: 36.850, lng: 10.315 },
            { lat: 36.860, lng: 10.315 },
            { lat: 36.860, lng: 10.330 },
            { lat: 36.850, lng: 10.330 },
          ],
        },
      },
    }),
    prisma.geofenceZone.create({
      data: {
        name: 'Zone Gamma — Port Ouest',
        type: 'circle',
        color: '#10B981',
        active: false,
        alertOnEnter: true,
        alertOnExit: false,
        coordinates: {
          type: 'circle',
          center: { lat: 36.828, lng: 10.177 },
          radius: 500,
        },
      },
    }),
  ]);
  console.log(`✅ ${zones.length} zones de géorepérage créées`);
  await prisma.setting.createMany({
    data: [
      { key: 'company_name', value: JSON.parse('"FleetTrack Operations"') },
      { key: 'timezone', value: JSON.parse('"UTC+1 (CET)"') },
      { key: 'language', value: JSON.parse('"Français"') },
      { key: 'gps_update_interval', value: JSON.parse('10') },
      { key: 'map_default_style', value: JSON.parse('"map"') },
      { key: 'theme', value: JSON.parse('"light"') },
      { key: 'battery_warning_threshold', value: JSON.parse('15') },
      { key: 'signal_timeout_minutes', value: JSON.parse('5') },
    ],
  });
  console.log('✅ Paramètres par défaut créés');
  console.log('\n🎉 Semis terminé avec succès !');
  console.log(`
📊 Résumé :
   - ${users.length} utilisateurs (admin@fleettrack.io / admin123)
   - ${devices.length} appareils
   - ${locationData.length} positions GPS
   - ${alerts.length} alertes
   - ${zones.length} zones de géorepérage
  `);
}
main()
  .catch((e) => {
    console.error('❌ Erreur lors du semis:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
