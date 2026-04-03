import { Router } from 'express';
import { locationController } from '../controllers/locationController.js';
import { protect } from '../middleware/authMiddleware.js';
const router = Router();
router.post('/', protect, locationController.addLocation);
router.get('/all/latest', protect, locationController.getAllLatest);
router.get('/:deviceId', protect, locationController.getHistory);
router.get('/latest/:deviceId', protect, locationController.getLatestByDevice);
export default router;
