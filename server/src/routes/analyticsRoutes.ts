import { Router } from 'express';
import {
  getDashboardSummary,
  getRevenueAnalytics,
  getAppointmentAnalytics,
  getCustomerAnalytics,
  getServiceAnalytics,
  getStaffAnalytics,
} from '../controllers/analyticsController';
import { authenticate, requireRole } from '../middleware/authMiddleware';

const router = Router();

router.get('/dashboard', authenticate, requireRole('ADMIN', 'SALON_OWNER', 'RECEPTIONIST'), getDashboardSummary);
router.get('/revenue', authenticate, requireRole('ADMIN', 'SALON_OWNER'), getRevenueAnalytics);
router.get('/appointments', authenticate, requireRole('ADMIN', 'SALON_OWNER', 'RECEPTIONIST'), getAppointmentAnalytics);
router.get('/customers', authenticate, requireRole('ADMIN', 'SALON_OWNER', 'RECEPTIONIST'), getCustomerAnalytics);
router.get('/services', authenticate, requireRole('ADMIN', 'SALON_OWNER', 'RECEPTIONIST'), getServiceAnalytics);
router.get('/staff', authenticate, requireRole('ADMIN', 'SALON_OWNER', 'RECEPTIONIST'), getStaffAnalytics);

export default router;
