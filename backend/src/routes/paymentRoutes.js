import express from 'express';
import { processMockPayment, getPaymentReceipt } from '../controllers/paymentController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/mock-process', authenticate, processMockPayment);
router.post('/process', authenticate, processMockPayment);
router.get('/receipt/:identifier', getPaymentReceipt);

export default router;
