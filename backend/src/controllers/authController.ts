import { Request, Response } from 'express';
import { authService } from '../services/authService.js';
import { AuthenticatedRequest } from '../middleware/authMiddleware.js';
export const authController = {
  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        res.status(400).json({ message: 'Email et mot de passe requis' });
        return;
      }
      const user = await authService.login(email, password);
      res.json(user);
    } catch (error: any) {
      res.status(401).json({ message: error.message });
    }
  },
  async register(req: Request, res: Response): Promise<void> {
    try {
      const { name, email, password, role } = req.body;
      if (!name || !email || !password) {
        res.status(400).json({ message: 'Nom, email et mot de passe requis' });
        return;
      }
      const user = await authService.register(name, email, password, role);
      res.status(201).json(user);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  },
  async getProfile(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) { res.status(401).json({ message: 'Non autorisé' }); return; }
      const profile = await authService.getProfile(req.user.id);
      res.json(profile);
    } catch (error: any) {
      res.status(404).json({ message: error.message });
    }
  },
};
