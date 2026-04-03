import { Router } from 'express';
import { authController } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';
const router = Router();
router.post('/login', authController.login);
router.post('/register', authController.register);
router.get('/me', protect, authController.getProfile);
export default router;
