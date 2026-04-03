import prisma from '../config/prisma.js';
export const geofenceService = {
  async findAll() {
    return prisma.geofenceZone.findMany({
      orderBy: { createdAt: 'desc' },
    });
  },
  async findById(id: number) {
    return prisma.geofenceZone.findUnique({ where: { id } });
  },
  async create(data: {
    name: string;
    type?: string;
    color?: string;
    alertOnEnter?: boolean;
    alertOnExit?: boolean;
    coordinates: any;
  }) {
    return prisma.geofenceZone.create({ data });
  },
  async update(id: number, data: {
    name?: string;
    type?: string;
    color?: string;
    active?: boolean;
    alertOnEnter?: boolean;
    alertOnExit?: boolean;
    coordinates?: any;
  }) {
    return prisma.geofenceZone.update({ where: { id }, data });
  },
  async delete(id: number) {
    return prisma.geofenceZone.delete({ where: { id } });
  },
  async toggleActive(id: number) {
    const zone = await prisma.geofenceZone.findUnique({ where: { id } });
    if (!zone) throw new Error('Zone introuvable');
    return prisma.geofenceZone.update({
      where: { id },
      data: { active: !zone.active },
    });
  },
};
