import express from 'express';
import { register, login, restaurantLogin, getMe, getDemoUsers } from '../controllers/authController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/restaurant-login', restaurantLogin);
router.get('/me', authenticate, getMe);
router.get('/demo-users', getDemoUsers);

export default router;
