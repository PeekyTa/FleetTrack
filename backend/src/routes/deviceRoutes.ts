import { Router } from 'express';
import { deviceController } from '../controllers/deviceController.js';
import { protect } from '../middleware/authMiddleware.js';
import { requireRole } from '../middleware/roleMiddleware.js';

const router = Router();

/**
 * @swagger
 * /api/devices:
 *   get:
 *     summary: Liste des appareils (filtré par rôle)
 *     tags: [Appareils]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: "Liste des appareils" }
 */
router.get('/', protect, deviceController.getAll);

/**
 * @swagger
 * /api/devices/stats:
 *   get:
 *     summary: Statistiques des appareils
 *     tags: [Appareils]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: "Statistiques agrégées" }
 */
router.get('/stats', protect, requireRole('ADMIN', 'SUPERVISOR'), deviceController.getStats);

/**
 * @swagger
 * /api/devices/{id}:
 *   get:
 *     summary: Détail d'un appareil
 *     tags: [Appareils]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: "Détail de l'appareil" }
 *       404: { description: "Appareil introuvable" }
 */
router.get('/:id', protect, deviceController.getById);

/**
 * @swagger
 * /api/devices:
 *   post:
 *     summary: Créer un appareil (Admin uniquement)
 *     tags: [Appareils]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, deviceIdentifier, groupName]
 *             properties:
 *               name: { type: string }
 *               deviceIdentifier: { type: string }
 *               groupName: { type: string }
 *               model: { type: string }
 *               imei: { type: string }
 *     responses:
 *       201: { description: "Appareil créé" }
 */
router.post('/', protect, requireRole('ADMIN'), deviceController.create);

/**
 * @swagger
 * /api/devices/{id}:
 *   put:
 *     summary: Modifier un appareil (Admin uniquement)
 *     tags: [Appareils]
 *     security: [{ bearerAuth: [] }]
 */
router.put('/:id', protect, requireRole('ADMIN'), deviceController.update);

/**
 * @swagger
 * /api/devices/{id}:
 *   delete:
 *     summary: Supprimer un appareil (Admin uniquement)
 *     tags: [Appareils]
 *     security: [{ bearerAuth: [] }]
 */
router.delete('/:id', protect, requireRole('ADMIN'), deviceController.delete);

/**
 * @swagger
 * /api/devices/assign:
 *   post:
 *     summary: Assigner un appareil à un utilisateur
 *     tags: [Appareils]
 *     security: [{ bearerAuth: [] }]
 */
router.post('/assign', protect, requireRole('ADMIN'), deviceController.assignDevice);

export default router;
