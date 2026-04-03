import bcrypt from 'bcrypt';
import prisma from '../config/prisma.js';
import { UserRole } from '@prisma/client';
export const userService = {
  async findAll() {
    return prisma.user.findMany({
      select: {
        id: true, name: true, email: true, role: true,
        status: true, lastLogin: true, createdAt: true,
        _count: { select: { assignedDevices: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  },
  async findById(id: number) {
    return prisma.user.findUnique({
      where: { id },
      select: {
        id: true, name: true, email: true, role: true,
        status: true, lastLogin: true, createdAt: true,
        assignedDevices: {
          include: { device: { select: { id: true, name: true, deviceIdentifier: true } } },
        },
      },
    });
  },
  async create(data: { name: string; email: string; password: string; role?: UserRole }) {
    const existing = await prisma.user.findUnique({ where: { email: data.email } });
    if (existing) throw new Error('Un utilisateur avec cet email existe déjà');
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(data.password, salt);
    return prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
        role: data.role || 'VIEWER',
      },
      select: {
        id: true, name: true, email: true, role: true,
        status: true, createdAt: true,
      },
    });
  },
  async update(id: number, data: { name?: string; email?: string; role?: UserRole; status?: string }) {
    return prisma.user.update({
      where: { id },
      data,
      select: {
        id: true, name: true, email: true, role: true,
        status: true, lastLogin: true, createdAt: true,
      },
    });
  },
  async delete(id: number) {
    return prisma.user.delete({ where: { id } });
  },
  async getStats() {
    const [total, active, byRole] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { status: 'active' } }),
      prisma.user.groupBy({ by: ['role'], _count: { id: true } }),
    ]);
    return { total, active, byRole };
  },
};
