import express from 'express';
import {
  addLocation,
  getLocationHistory,
  getLatestLocation,
  getAllLatestLocations,
} from '../controllers/locationController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').post(protect, addLocation);
router.route('/all/latest').get(protect, getAllLatestLocations);
router.route('/:deviceId').get(protect, getLocationHistory);
router.route('/latest/:deviceId').get(protect, getLatestLocation);

export default router;
