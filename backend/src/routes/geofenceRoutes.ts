import { Router } from 'express';
import { geofenceController } from '../controllers/geofenceController.js';
import { protect } from '../middleware/authMiddleware.js';
import { requireRole } from '../middleware/roleMiddleware.js';

const router = Router();

/**
 * @swagger
 * /api/geofences:
 *   get:
 *     summary: Liste des zones de géorepérage
 *     tags: [Géorepérage]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: "Liste des zones" }
 */
router.get('/', protect, requireRole('ADMIN', 'SUPERVISOR'), geofenceController.getAll);

/**
 * @swagger
 * /api/geofences/{id}:
 *   get:
 *     summary: Détail d'une zone
 *     tags: [Géorepérage]
 *     security: [{ bearerAuth: [] }]
 */
router.get('/:id', protect, requireRole('ADMIN', 'SUPERVISOR'), geofenceController.getById);

/**
 * @swagger
 * /api/geofences:
 *   post:
 *     summary: Créer une zone de géorepérage
 *     tags: [Géorepérage]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, coordinates]
 *             properties:
 *               name: { type: string }
 *               type: { type: string, enum: [polygon, circle] }
 *               color: { type: string }
 *               alertOnEnter: { type: boolean }
 *               alertOnExit: { type: boolean }
 *               coordinates: { type: object }
 *     responses:
 *       201: { description: "Zone créée" }
 */
router.post('/', protect, requireRole('ADMIN', 'SUPERVISOR'), geofenceController.create);

router.put('/:id', protect, requireRole('ADMIN', 'SUPERVISOR'), geofenceController.update);
router.put('/:id/toggle', protect, requireRole('ADMIN', 'SUPERVISOR'), geofenceController.toggleActive);
router.delete('/:id', protect, requireRole('ADMIN'), geofenceController.delete);

export default router;
