import { Router } from 'express';
import { analyticsController } from '../controllers/analyticsController.js';
import { protect } from '../middleware/authMiddleware.js';
import { requireRole } from '../middleware/roleMiddleware.js';

const router = Router();

/**
 * @swagger
 * /api/analytics/dashboard:
 *   get:
 *     summary: Données agrégées du tableau de bord
 *     tags: [Analytique]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: "Données du tableau de bord" }
 */
router.get('/dashboard', protect, requireRole('ADMIN', 'SUPERVISOR'), analyticsController.getDashboard);

/**
 * @swagger
 * /api/analytics/devices:
 *   get:
 *     summary: Activité des appareils dans le temps
 *     tags: [Analytique]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: query
 *         name: period
 *         schema: { type: string, enum: [today, week, month] }
 */
router.get('/devices', protect, requireRole('ADMIN', 'SUPERVISOR'), analyticsController.getDeviceActivity);

/**
 * @swagger
 * /api/analytics/alerts:
 *   get:
 *     summary: Statistiques des alertes
 *     tags: [Analytique]
 *     security: [{ bearerAuth: [] }]
 */
router.get('/alerts', protect, requireRole('ADMIN', 'SUPERVISOR'), analyticsController.getAlertStats);

router.get('/distance', protect, requireRole('ADMIN', 'SUPERVISOR'), analyticsController.getDistanceStats);
router.get('/coverage', protect, requireRole('ADMIN', 'SUPERVISOR'), analyticsController.getCoverageByGroup);
router.get('/signal', protect, requireRole('ADMIN', 'SUPERVISOR'), analyticsController.getSignalQuality);

export default router;
