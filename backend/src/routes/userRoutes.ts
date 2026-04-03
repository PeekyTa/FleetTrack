import { Router } from 'express';
import { userController } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';
import { requireRole } from '../middleware/roleMiddleware.js';

const router = Router();

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Liste des utilisateurs (Admin uniquement)
 *     tags: [Utilisateurs]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: "Liste des utilisateurs" }
 *       403: { description: "Accès refusé" }
 */
router.get('/', protect, requireRole('ADMIN'), userController.getAll);

/**
 * @swagger
 * /api/users/stats:
 *   get:
 *     summary: Statistiques utilisateurs
 *     tags: [Utilisateurs]
 *     security: [{ bearerAuth: [] }]
 */
router.get('/stats', protect, requireRole('ADMIN'), userController.getStats);

router.get('/:id', protect, requireRole('ADMIN'), userController.getById);

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Créer un utilisateur (Admin uniquement)
 *     tags: [Utilisateurs]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, password]
 *             properties:
 *               name: { type: string }
 *               email: { type: string }
 *               password: { type: string }
 *               role: { type: string, enum: [ADMIN, SUPERVISOR, OPERATOR, VIEWER] }
 *     responses:
 *       201: { description: "Utilisateur créé" }
 */
router.post('/', protect, requireRole('ADMIN'), userController.create);
router.put('/:id', protect, requireRole('ADMIN'), userController.update);
router.delete('/:id', protect, requireRole('ADMIN'), userController.delete);

export default router;
