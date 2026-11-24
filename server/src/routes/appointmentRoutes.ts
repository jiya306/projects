import { Router } from 'express';
import {
  getAppointments,
  getAppointmentById,
  createAppointment,
  updateAppointment,
  updateAppointmentStatus,
  deleteAppointment,
  getAvailability,
} from '../controllers/appointmentController';
import { authenticate } from '../middleware/authMiddleware';

const router = Router();

// Availability check is public for wizard booking
router.get('/availability', getAvailability);

// Public creation for customer wizard, or authenticated
router.post('/', createAppointment);

// Authenticated management
router.get('/', authenticate, getAppointments);
router.get('/:id', authenticate, getAppointmentById);
router.put('/:id', authenticate, updateAppointment);
router.patch('/:id/status', authenticate, updateAppointmentStatus);
router.delete('/:id', authenticate, deleteAppointment);

export default router;
