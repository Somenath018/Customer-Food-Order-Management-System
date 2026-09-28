import express from 'express';
import {
  getAdminOverview,
  listAllCustomers,
  toggleCustomerRestriction,
  listAllDriversAdmin,
  addDeliveryPartnerAdmin,
  deleteDeliveryPartnerAdmin
} from '../controllers/adminController.js';
import { authenticate, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authenticate, authorize('admin'));

// Platform KPI overview (orders count, revenue, customer/fleet totals)
router.get('/stats', getAdminOverview);
router.get('/overview', getAdminOverview);

// Customer Governance (View customers, Restrict / Unrestrict account)
router.get('/customers', listAllCustomers);
router.get('/users', listAllCustomers); // alias for backwards compatibility
router.patch('/customers/:id/toggle-restriction', toggleCustomerRestriction);

// Delivery Fleet Governance (View drivers, Add delivery partner, Delete delivery partner)
router.get('/drivers', listAllDriversAdmin);
router.post('/drivers', addDeliveryPartnerAdmin);
router.delete('/drivers/:id', deleteDeliveryPartnerAdmin);

export default router;
