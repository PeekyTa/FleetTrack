import { Response } from 'express';
import { analyticsService } from '../services/analyticsService.js';
import { AuthenticatedRequest } from '../middleware/authMiddleware.js';
export const analyticsController = {
  async getDeviceActivity(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const period = (req.query.period as string) || 'week';
      const data = await analyticsService.getDeviceActivity(period);
      res.json(data);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },
  async getAlertStats(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const stats = await analyticsService.getAlertStats();
      res.json(stats);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },
  async getDistanceStats(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const data = await analyticsService.getDistanceStats();
      res.json(data);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },
  async getCoverageByGroup(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const data = await analyticsService.getCoverageByGroup();
      res.json(data);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },
  async getSignalQuality(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const data = await analyticsService.getSignalQuality();
      res.json(data);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },
  async getDashboard(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const [devices, alerts, distance, coverage, signal] = await Promise.all([
        analyticsService.getDeviceActivity('today'),
        analyticsService.getAlertStats(),
        analyticsService.getDistanceStats(),
        analyticsService.getCoverageByGroup(),
        analyticsService.getSignalQuality(),
      ]);
      res.json({ devices, alerts, distance, coverage, signal });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },
};
