import { Router } from 'express';
import {
  getCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  getCustomerAppointments,
  getCustomerPayments,
  getCustomerLoyalty,
} from '../controllers/customerController';
import { authenticate, requireRole } from '../middleware/authMiddleware';

const router = Router();

router.get('/', authenticate, requireRole('ADMIN', 'SALON_OWNER', 'RECEPTIONIST'), getCustomers);
router.get('/:id', authenticate, getCustomerById);
router.post('/', authenticate, requireRole('ADMIN', 'SALON_OWNER', 'RECEPTIONIST'), createCustomer);
router.put('/:id', authenticate, requireRole('ADMIN', 'SALON_OWNER', 'RECEPTIONIST'), updateCustomer);
router.delete('/:id', authenticate, requireRole('ADMIN', 'SALON_OWNER'), deleteCustomer);
router.get('/:id/appointments', authenticate, getCustomerAppointments);
router.get('/:id/payments', authenticate, getCustomerPayments);
router.get('/:id/loyalty', authenticate, getCustomerLoyalty);

export default router;
