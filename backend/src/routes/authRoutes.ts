import { Router } from 'express';
import { authController } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = Router();

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Connexion utilisateur
 *     tags: [Authentification]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email: { type: string, example: "admin@fleettrack.io" }
 *               password: { type: string, example: "admin123" }
 *     responses:
 *       200: { description: "Connexion réussie — retourne le token JWT" }
 *       401: { description: "Identifiants invalides" }
 */
router.post('/login', authController.login);

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Inscription d'un nouvel utilisateur
 *     tags: [Authentification]
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
 *       400: { description: "Données invalides" }
 */
router.post('/register', authController.register);

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Profil de l'utilisateur connecté
 *     tags: [Authentification]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: "Profil utilisateur" }
 *       401: { description: "Non autorisé" }
 */
router.get('/me', protect, authController.getProfile);

export default router;
