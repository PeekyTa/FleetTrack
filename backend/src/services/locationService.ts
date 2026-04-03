import prisma from '../config/prisma.js';
export const locationService = {
  async addLocation(data: {
    deviceId: number;
    latitude: number;
    longitude: number;
    speed?: number;
    altitude?: number;
    heading?: number;
  }) {
    const location = await prisma.location.create({ data });
    await prisma.device.update({
      where: { id: data.deviceId },
      data: { lastSeen: new Date(), status: 'ONLINE' },
    });
    return location;
  },
  async getHistory(deviceId: number, limit: number = 100, from?: Date, to?: Date) {
    return prisma.location.findMany({
      where: {
        deviceId,
        ...(from || to ? {
          timestamp: {
            ...(from ? { gte: from } : {}),
            ...(to ? { lte: to } : {}),
          },
        } : {}),
      },
      orderBy: { timestamp: 'desc' },
      take: limit,
    });
  },
  async getLatestByDevice(deviceId: number) {
    return prisma.location.findFirst({
      where: { deviceId },
      orderBy: { timestamp: 'desc' },
    });
  },
  async getAllLatest() {
    const devices = await prisma.device.findMany({
      include: {
        locations: {
          orderBy: { timestamp: 'desc' },
          take: 1,
        },
      },
    });
    return devices
      .filter((d) => d.locations.length > 0)
      .map((d) => ({
        deviceId: d.id,
        deviceName: d.name,
        deviceIdentifier: d.deviceIdentifier,
        groupName: d.groupName,
        status: d.status,
        battery: d.battery,
        signal: d.signal,
        location: d.locations[0],
      }));
  },
};
