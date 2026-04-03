import { Response } from 'express';
import { userService } from '../services/userService.js';
import { AuthenticatedRequest } from '../middleware/authMiddleware.js';
export const userController = {
  async getAll(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const users = await userService.findAll();
      res.json(users);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },
  async getById(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const user = await userService.findById(parseInt(req.params.id));
      if (!user) { res.status(404).json({ message: 'Utilisateur introuvable' }); return; }
      res.json(user);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },
  async create(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { name, email, password, role } = req.body;
      if (!name || !email || !password) {
        res.status(400).json({ message: 'Nom, email et mot de passe requis' });
        return;
      }
      const user = await userService.create({ name, email, password, role });
      res.status(201).json(user);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  },
  async update(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const user = await userService.update(parseInt(req.params.id), req.body);
      res.json(user);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },
  async delete(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      await userService.delete(parseInt(req.params.id));
      res.json({ message: 'Utilisateur supprimé' });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },
  async getStats(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const stats = await userService.getStats();
      res.json(stats);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },
};
