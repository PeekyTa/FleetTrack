import { Response } from 'express';
import { geofenceService } from '../services/geofenceService.js';
import { AuthenticatedRequest } from '../middleware/authMiddleware.js';
export const geofenceController = {
  async getAll(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const zones = await geofenceService.findAll();
      res.json(zones);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },
  async getById(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const zone = await geofenceService.findById(parseInt(req.params.id as string));
      if (!zone) { res.status(404).json({ message: 'Zone introuvable' }); return; }
      res.json(zone);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },
  async create(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { name, type, color, alertOnEnter, alertOnExit, coordinates } = req.body;
      if (!name || !coordinates) {
        res.status(400).json({ message: 'Nom et coordonnées requis' });
        return;
      }
      const zone = await geofenceService.create({
        name, type, color, alertOnEnter, alertOnExit, coordinates,
      });
      res.status(201).json(zone);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },
  async update(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const zone = await geofenceService.update(parseInt(req.params.id as string), req.body);
      res.json(zone);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },
  async delete(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      await geofenceService.delete(parseInt(req.params.id as string));
      res.json({ message: 'Zone supprimée' });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },
  async toggleActive(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const zone = await geofenceService.toggleActive(parseInt(req.params.id as string));
      res.json(zone);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },
};
