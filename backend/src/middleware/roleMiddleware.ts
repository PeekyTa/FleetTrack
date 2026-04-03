import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './authMiddleware.js';
type Role = 'ADMIN' | 'SUPERVISOR' | 'OPERATOR' | 'VIEWER';
export const requireRole = (...allowedRoles: Role[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ message: 'Non autorisé' });
      return;
    }
    if (!allowedRoles.includes(req.user.role as Role)) {
      res.status(403).json({
        message: `Accès refusé — rôle "${req.user.role}" non autorisé pour cette ressource`,
      });
      return;
    }
    next();
  };
};
