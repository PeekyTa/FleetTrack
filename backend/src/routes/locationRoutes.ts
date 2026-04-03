import { Router } from 'express';
import { locationController } from '../controllers/locationController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = Router();

/**
 * @swagger
 * /api/locations:
 *   post:
 *     summary: Enregistrer une nouvelle position GPS
 *     tags: [Positions]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [deviceId, latitude, longitude]
 *             properties:
 *               deviceId: { type: integer }
 *               latitude: { type: number, example: 48.8566 }
 *               longitude: { type: number, example: 2.3522 }
 *               speed: { type: number }
 *               altitude: { type: number }
 *               heading: { type: number }
 *     responses:
 *       201: { description: "Position enregistrée" }
 */
router.post('/', protect, locationController.addLocation);

/**
 * @swagger
 * /api/locations/all/latest:
 *   get:
 *     summary: Dernières positions de tous les appareils
 *     tags: [Positions]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: "Liste des dernières positions" }
 */
router.get('/all/latest', protect, locationController.getAllLatest);

/**
 * @swagger
 * /api/locations/{deviceId}:
 *   get:
 *     summary: Historique de positions d'un appareil
 *     tags: [Positions]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: deviceId
 *         required: true
 *         schema: { type: integer }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 100 }
 *       - in: query
 *         name: from
 *         schema: { type: string, format: date-time }
 *       - in: query
 *         name: to
 *         schema: { type: string, format: date-time }
 *     responses:
 *       200: { description: "Historique des positions" }
 */
router.get('/:deviceId', protect, locationController.getHistory);

/**
 * @swagger
 * /api/locations/latest/{deviceId}:
 *   get:
 *     summary: Dernière position d'un appareil
 *     tags: [Positions]
 *     security: [{ bearerAuth: [] }]
 */
router.get('/latest/:deviceId', protect, locationController.getLatestByDevice);

export default router;
