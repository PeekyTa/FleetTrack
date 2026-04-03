import { Request, Response } from 'express';
import { locationService } from '../services/locationService.js';
import { AuthenticatedRequest } from '../middleware/authMiddleware.js';
export const locationController = {
  async addLocation(req: Request, res: Response): Promise<void> {
    try {
      const { deviceId, latitude, longitude, speed, altitude, heading } = req.body;
      if (!deviceId || latitude === undefined || longitude === undefined) {
        res.status(400).json({ message: 'deviceId, latitude et longitude requis' });
        return;
      }
      const location = await locationService.addLocation({
        deviceId, latitude, longitude, speed, altitude, heading,
      });
      res.status(201).json(location);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },
  async getHistory(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const deviceId = parseInt(req.params.deviceId);
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 100;
      const from = req.query.from ? new Date(req.query.from as string) : undefined;
      const to = req.query.to ? new Date(req.query.to as string) : undefined;
      const history = await locationService.getHistory(deviceId, limit, from, to);
      res.json(history);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },
  async getLatestByDevice(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const deviceId = parseInt(req.params.deviceId);
      const location = await locationService.getLatestByDevice(deviceId);
      if (!location) {
        res.status(404).json({ message: 'Aucune position trouvée pour cet appareil' });
        return;
      }
      res.json(location);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },
  async getAllLatest(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const locations = await locationService.getAllLatest();
      res.json(locations);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },
};
