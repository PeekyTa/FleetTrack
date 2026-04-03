import prisma from '../config/prisma.js';
import { DeviceStatus } from '@prisma/client';
export const deviceService = {
  async findAll() {
    return prisma.device.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        _count: { select: { locations: true, alerts: true } },
      },
    });
  },
  async findAssignedToUser(userId: number) {
    const assignments = await prisma.deviceAssignment.findMany({
      where: { userId },
      include: {
        device: {
          include: {
            _count: { select: { locations: true, alerts: true } },
          },
        },
      },
    });
    return assignments.map((a) => a.device);
  },
  async findById(id: number) {
    return prisma.device.findUnique({
      where: { id },
      include: {
        _count: { select: { locations: true, alerts: true } },
        assignments: { include: { user: { select: { id: true, name: true, email: true } } } },
      },
    });
  },
  async create(data: {
    name: string;
    deviceIdentifier: string;
    groupName: string;
    model?: string;
    imei?: string;
    status?: DeviceStatus;
  }) {
    return prisma.device.create({ data });
  },
  async update(id: number, data: {
    name?: string;
    groupName?: string;
    model?: string;
    status?: DeviceStatus;
    battery?: number;
    signal?: number;
  }) {
    return prisma.device.update({ where: { id }, data });
  },
  async delete(id: number) {
    return prisma.device.delete({ where: { id } });
  },
  async getStats() {
    const [total, online, offline, lowBattery, warning] = await Promise.all([
      prisma.device.count(),
      prisma.device.count({ where: { status: 'ONLINE' } }),
      prisma.device.count({ where: { status: 'OFFLINE' } }),
      prisma.device.count({ where: { status: 'LOW_BATTERY' } }),
      prisma.device.count({ where: { status: 'WARNING' } }),
    ]);
    const groups = await prisma.device.groupBy({
      by: ['groupName'],
      _count: { id: true },
    });
    return { total, online, offline, lowBattery, warning, groups };
  },
  async assignDevice(userId: number, deviceId: number) {
    return prisma.deviceAssignment.create({
      data: { userId, deviceId },
    });
  },
  async unassignDevice(userId: number, deviceId: number) {
    return prisma.deviceAssignment.delete({
      where: { userId_deviceId: { userId, deviceId } },
    });
  },
};
