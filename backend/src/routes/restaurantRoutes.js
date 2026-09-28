import express from 'express';
import {
  getAllRestaurants,
  getDishes,
  getRestaurantById,
  getMyRestaurant,
  updateRestaurant,
  toggleOpenStatus
} from '../controllers/restaurantController.js';
import { authenticate, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getAllRestaurants);
router.get('/dishes', getDishes);
router.get('/my-restaurant', authenticate, authorize('restaurant', 'admin'), getMyRestaurant);
router.get('/:id', getRestaurantById);
router.put('/:id', authenticate, authorize('restaurant', 'admin'), updateRestaurant);
router.patch('/:id/toggle-open', authenticate, authorize('restaurant', 'admin'), toggleOpenStatus);

export default router;
