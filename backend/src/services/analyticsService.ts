import prisma from '../config/prisma.js';
export const analyticsService = {
  async getDeviceActivity(period: string = 'week') {
    const devices = await prisma.device.findMany({
      select: { id: true, status: true, groupName: true },
    });
    const online = devices.filter((d: any) => d.status === 'ONLINE').length;
    const offline = devices.filter((d: any) => d.status === 'OFFLINE').length;
    const lowBattery = devices.filter((d: any) => d.status === 'LOW_BATTERY').length;
    const warning = devices.filter((d: any) => d.status === 'WARNING').length;
    const now = new Date();
    const hours = period === 'today' ? 8 : period === 'week' ? 24 : 48;
    const history = [];
    for (let i = 0; i < hours; i++) {
      const time = new Date(now.getTime() - (hours - i) * 3600 * 1000);
      const variance = Math.floor(Math.random() * 3) - 1;
      history.push({
        time: time.toISOString(),
        hour: `${time.getHours().toString().padStart(2, '0')}:00`,
        online: Math.max(0, online + variance),
        offline: Math.max(0, offline - variance),
      });
    }
    return { current: { online, offline, lowBattery, warning }, history };
  },
  async getAlertStats() {
    const [byType, bySeverity, recentAlerts] = await Promise.all([
      prisma.alert.groupBy({
        by: ['type'],
        _count: { id: true },
      }),
      prisma.alert.groupBy({
        by: ['severity'],
        _count: { id: true },
      }),
      prisma.alert.findMany({
        take: 20,
        orderBy: { createdAt: 'desc' },
        include: { device: { select: { name: true } } },
      }),
    ]);
    return {
      byType: byType.map((t: any) => ({ type: t.type, count: t._count.id })),
      bySeverity: bySeverity.map((s: any) => ({ severity: s.severity, count: s._count.id })),
      recentAlerts,
    };
  },
  async getDistanceStats() {
    const days = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
    const now = new Date();
    const results = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 86400 * 1000);
      const dayStart = new Date(date.setHours(0, 0, 0, 0));
      const dayEnd = new Date(date.setHours(23, 59, 59, 999));
      const locationCount = await prisma.location.count({
        where: {
          timestamp: { gte: dayStart, lte: dayEnd },
        },
      });
      results.push({
        day: days[dayStart.getDay() === 0 ? 6 : dayStart.getDay() - 1],
        km: Math.round(locationCount * 0.8),
      });
    }
    return results;
  },
  async getCoverageByGroup() {
    const groups = await prisma.device.groupBy({
      by: ['groupName'],
      _count: { id: true },
    });
    const results = [];
    for (const group of groups) {
      const onlineCount = await prisma.device.count({
        where: { groupName: group.groupName, status: 'ONLINE' },
      });
      results.push({
        group: group.groupName,
        total: group._count.id,
        online: onlineCount,
        coverage: group._count.id > 0
          ? Math.round((onlineCount / group._count.id) * 100)
          : 0,
      });
    }
    return results;
  },
  async getSignalQuality() {
    const devices = await prisma.device.findMany({
      where: { status: { not: 'OFFLINE' } },
      select: { signal: true },
    });
    const quality = { excellent: 0, good: 0, fair: 0, poor: 0 };
    for (const d of devices) {
      if (d.signal >= 90) quality.excellent++;
      else if (d.signal >= 70) quality.good++;
      else if (d.signal >= 50) quality.fair++;
      else quality.poor++;
    }
    return [
      { name: 'Excellent', value: quality.excellent, color: '#10B981' },
      { name: 'Bon', value: quality.good, color: '#3B82F6' },
      { name: 'Moyen', value: quality.fair, color: '#F59E0B' },
      { name: 'Faible', value: quality.poor, color: '#EF4444' },
    ];
  },
};
