import { Router } from 'express';
import {
  getStaff,
  getStaffById,
  createStaff,
  updateStaff,
  deleteStaff,
  getStaffAppointments,
  getStaffPerformance,
} from '../controllers/staffController';
import { authenticate, requireRole } from '../middleware/authMiddleware';

const router = Router();

// Public: Landing page needs to display stylists list and their profiles
router.get('/', getStaff);
router.get('/:id', getStaffById);

// Protected routes
router.post('/', authenticate, requireRole('ADMIN', 'SALON_OWNER'), createStaff);
router.put('/:id', authenticate, requireRole('ADMIN', 'SALON_OWNER'), updateStaff);
router.delete('/:id', authenticate, requireRole('ADMIN', 'SALON_OWNER'), deleteStaff);
router.get('/:id/appointments', authenticate, getStaffAppointments);
router.get('/:id/performance', authenticate, getStaffPerformance);

export default router;
