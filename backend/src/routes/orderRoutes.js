import express from 'express';
import {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
  addFeedback
} from '../controllers/orderController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', authenticate, createOrder);
router.get('/', authenticate, getOrders);
router.get('/:id', authenticate, getOrderById);
router.patch('/:id/status', authenticate, updateOrderStatus);
router.post('/:id/feedback', authenticate, addFeedback);

export default router;
