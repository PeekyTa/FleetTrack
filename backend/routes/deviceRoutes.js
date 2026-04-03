import express from 'express';
import {
  getDevices,
  createDevice,
  updateDevice,
  deleteDevice,
  getDeviceStats,
} from '../controllers/deviceController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(protect, getDevices).post(protect, createDevice);
router.route('/stats').get(protect, getDeviceStats);
router.route('/:id').put(protect, updateDevice).delete(protect, deleteDevice);

export default router;
