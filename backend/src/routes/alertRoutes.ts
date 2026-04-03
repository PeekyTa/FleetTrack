import { Router } from 'express';
import { alertController } from '../controllers/alertController.js';
import { protect } from '../middleware/authMiddleware.js';
import { requireRole } from '../middleware/roleMiddleware.js';

const router = Router();

/**
 * @swagger
 * /api/alerts:
 *   get:
 *     summary: Liste des alertes (filtré par rôle)
 *     tags: [Alertes]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: query
 *         name: acknowledged
 *         schema: { type: boolean }
 *         description: Filtrer par statut d'acquittement
 *     responses:
 *       200: { description: "Liste des alertes" }
 */
router.get('/', protect, alertController.getAll);

/**
 * @swagger
 * /api/alerts/stats:
 *   get:
 *     summary: Statistiques des alertes
 *     tags: [Alertes]
 *     security: [{ bearerAuth: [] }]
 */
router.get('/stats', protect, requireRole('ADMIN', 'SUPERVISOR'), alertController.getStats);

/**
 * @swagger
 * /api/alerts/{id}/acknowledge:
 *   put:
 *     summary: Acquitter une alerte
 *     tags: [Alertes]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: "Alerte acquittée" }
 */
router.put('/:id/acknowledge', protect, requireRole('ADMIN', 'SUPERVISOR', 'OPERATOR'), alertController.acknowledge);

/**
 * @swagger
 * /api/alerts/acknowledge-all:
 *   put:
 *     summary: Acquitter toutes les alertes
 *     tags: [Alertes]
 *     security: [{ bearerAuth: [] }]
 */
router.put('/acknowledge-all', protect, requireRole('ADMIN', 'SUPERVISOR'), alertController.acknowledgeAll);

export default router;
