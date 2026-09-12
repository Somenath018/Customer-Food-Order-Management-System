import express from 'express';
import {
  getAdminOverview,
  listAllUsers,
  listAllRestaurantsAdmin,
  toggleRestaurantApproval,
  listAllDriversAdmin
} from '../controllers/adminController.js';
import { authenticate, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authenticate, authorize('admin'));

router.get('/stats', getAdminOverview);
router.get('/overview', getAdminOverview);
router.get('/users', listAllUsers);
router.get('/restaurants', listAllRestaurantsAdmin);
router.patch('/restaurants/:id/toggle-approval', toggleRestaurantApproval);
router.get('/drivers', listAllDriversAdmin);

export default router;
