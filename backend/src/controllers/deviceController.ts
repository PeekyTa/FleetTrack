import { Response } from 'express';
import { deviceService } from '../services/deviceService.js';
import { AuthenticatedRequest } from '../middleware/authMiddleware.js';
export const deviceController = {
  async getAll(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userRole = req.user?.role;
      let devices;
      if (userRole === 'ADMIN' || userRole === 'SUPERVISOR') {
        devices = await deviceService.findAll();
      } else {
        devices = await deviceService.findAssignedToUser(req.user!.id);
      }
      res.json(devices);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },
  async getById(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const device = await deviceService.findById(parseInt(req.params.id as string));
      if (!device) { res.status(404).json({ message: 'Appareil introuvable' }); return; }
      res.json(device);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },
  async create(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { name, deviceIdentifier, groupName, model, imei } = req.body;
      if (!name || !deviceIdentifier || !groupName) {
        res.status(400).json({ message: 'Nom, identifiant et groupe requis' });
        return;
      }
      const device = await deviceService.create({ name, deviceIdentifier, groupName, model, imei });
      res.status(201).json(device);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },
  async update(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const device = await deviceService.update(parseInt(req.params.id as string), req.body);
      res.json(device);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },
  async delete(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      await deviceService.delete(parseInt(req.params.id as string));
      res.json({ message: 'Appareil supprimé' });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },
  async getStats(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const stats = await deviceService.getStats();
      res.json(stats);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },
  async assignDevice(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { userId, deviceId } = req.body;
      const assignment = await deviceService.assignDevice(userId, deviceId);
      res.status(201).json(assignment);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },
};
