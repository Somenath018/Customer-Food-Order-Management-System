import express from 'express';
import {
  getAllRestaurants,
  getRestaurantById,
  getMyRestaurant,
  updateRestaurant,
  toggleOpenStatus,
  getRestaurantAnalytics,
  updateVerificationDetails
} from '../controllers/restaurantController.js';
import { authenticate, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getAllRestaurants);
router.get('/my-restaurant', authenticate, authorize('restaurant', 'admin'), getMyRestaurant);
router.get('/:id', getRestaurantById);
router.get('/:id/analytics', getRestaurantAnalytics);
router.put('/:id', authenticate, authorize('restaurant', 'admin'), updateRestaurant);
router.put('/:id/verification', authenticate, authorize('restaurant', 'admin'), updateVerificationDetails);
router.patch('/:id/toggle-open', authenticate, authorize('restaurant', 'admin'), toggleOpenStatus);

export default router;
