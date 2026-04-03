import prisma from '../config/prisma.js';
import { AlertType, AlertSeverity } from '@prisma/client';
export const alertService = {
  async findAll(filters?: { acknowledged?: boolean; deviceId?: number; severity?: AlertSeverity }) {
    return prisma.alert.findMany({
      where: {
        ...(filters?.acknowledged !== undefined ? { acknowledged: filters.acknowledged } : {}),
        ...(filters?.deviceId ? { deviceId: filters.deviceId } : {}),
        ...(filters?.severity ? { severity: filters.severity } : {}),
      },
      include: {
        device: { select: { id: true, name: true, deviceIdentifier: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  },
  async findForUserDevices(userId: number) {
    const assignments = await prisma.deviceAssignment.findMany({
      where: { userId },
      select: { deviceId: true },
    });
    const deviceIds = assignments.map((a) => a.deviceId);
    return prisma.alert.findMany({
      where: { deviceId: { in: deviceIds } },
      include: {
        device: { select: { id: true, name: true, deviceIdentifier: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  },
  async create(data: {
    type: AlertType;
    severity: AlertSeverity;
    deviceId: number;
    message: string;
  }) {
    return prisma.alert.create({
      data,
      include: {
        device: { select: { id: true, name: true, deviceIdentifier: true } },
      },
    });
  },
  async acknowledge(id: number, userId: number) {
    return prisma.alert.update({
      where: { id },
      data: {
        acknowledged: true,
        acknowledgedBy: userId,
        acknowledgedAt: new Date(),
      },
    });
  },
  async acknowledgeAll(userId: number) {
    return prisma.alert.updateMany({
      where: { acknowledged: false },
      data: {
        acknowledged: true,
        acknowledgedBy: userId,
        acknowledgedAt: new Date(),
      },
    });
  },
  async getStats() {
    const [total, unacknowledged, bySeverity, byType] = await Promise.all([
      prisma.alert.count(),
      prisma.alert.count({ where: { acknowledged: false } }),
      prisma.alert.groupBy({ by: ['severity'], _count: { id: true } }),
      prisma.alert.groupBy({ by: ['type'], _count: { id: true } }),
    ]);
    return { total, unacknowledged, bySeverity, byType };
  },
};
