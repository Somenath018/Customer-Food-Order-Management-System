import express from 'express';
import {
  getMenuByRestaurant,
  addMenuItem,
  updateMenuItem,
  toggleItemAvailability,
  deleteMenuItem
} from '../controllers/menuController.js';
import { authenticate, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/:restaurantId', getMenuByRestaurant);
router.post('/:restaurantId', authenticate, authorize('restaurant', 'admin'), addMenuItem);
router.put('/:restaurantId/:itemId', authenticate, authorize('restaurant', 'admin'), updateMenuItem);
router.patch('/:restaurantId/:itemId/toggle', authenticate, authorize('restaurant', 'admin'), toggleItemAvailability);
router.delete('/:restaurantId/:itemId', authenticate, authorize('restaurant', 'admin'), deleteMenuItem);

export default router;
