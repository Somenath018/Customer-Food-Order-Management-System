import express from 'express';
import {
  getAvailableDeliveries,
  acceptDeliveryTask,
  updateDeliveryStage,
  updateDriverLocation,
  toggleDriverStatus,
  getDriverDashboard
} from '../controllers/deliveryController.js';
import { authenticate, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/dashboard', authenticate, authorize('driver', 'admin'), getDriverDashboard);
router.get('/available', authenticate, authorize('driver', 'admin'), getAvailableDeliveries);
router.post('/accept/:orderId', authenticate, authorize('driver', 'admin'), acceptDeliveryTask);
router.patch('/stage/:orderId', authenticate, authorize('driver', 'admin'), updateDeliveryStage);
router.post('/location', authenticate, authorize('driver', 'admin'), updateDriverLocation);
router.patch('/toggle-status', authenticate, authorize('driver', 'admin'), toggleDriverStatus);

export default router;
