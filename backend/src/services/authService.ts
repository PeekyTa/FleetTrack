import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../config/prisma.js';
import { config } from '../config/index.js';
const generateToken = (id: number): string => {
  return jwt.sign({ id }, config.jwtSecret, { expiresIn: '30d' });
};
export const authService = {
  async login(email: string, password: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new Error('Email ou mot de passe incorrect');
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) throw new Error('Email ou mot de passe incorrect');
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() },
    });
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      token: generateToken(user.id),
    };
  },
  async register(name: string, email: string, password: string, role: string = 'VIEWER') {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) throw new Error('Un utilisateur avec cet email existe déjà');
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: role as any,
      },
    });
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user.id),
    };
  },
  async getProfile(userId: number) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true, name: true, email: true, role: true,
        status: true, lastLogin: true, createdAt: true,
      },
    });
    if (!user) throw new Error('Utilisateur introuvable');
    return user;
  },
};
