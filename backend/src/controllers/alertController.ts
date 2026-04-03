import { Response } from 'express';
import { alertService } from '../services/alertService.js';
import { AuthenticatedRequest } from '../middleware/authMiddleware.js';
export const alertController = {
  async getAll(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userRole = req.user?.role;
      let alerts;
      if (userRole === 'ADMIN' || userRole === 'SUPERVISOR') {
        alerts = await alertService.findAll({
          acknowledged: req.query.acknowledged === 'true' ? true :
                        req.query.acknowledged === 'false' ? false : undefined,
        });
      } else {
        alerts = await alertService.findForUserDevices(req.user!.id);
      }
      res.json(alerts);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },
  async acknowledge(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const alert = await alertService.acknowledge(parseInt(req.params.id), req.user!.id);
      res.json(alert);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },
  async acknowledgeAll(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const result = await alertService.acknowledgeAll(req.user!.id);
      res.json({ message: `${result.count} alerte(s) acquittée(s)`, count: result.count });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },
  async getStats(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const stats = await alertService.getStats();
      res.json(stats);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },
};
