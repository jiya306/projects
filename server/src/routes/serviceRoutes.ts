import { Router } from 'express';
import {
  getServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
} from '../controllers/serviceController';
import { authenticate, requireRole } from '../middleware/authMiddleware';

const router = Router();

// Public: Landing page and Booking wizard need to list services
router.get('/', getServices);
router.get('/:id', getServiceById);

// Protected routes
router.post('/', authenticate, requireRole('ADMIN', 'SALON_OWNER'), createService);
router.put('/:id', authenticate, requireRole('ADMIN', 'SALON_OWNER'), updateService);
router.delete('/:id', authenticate, requireRole('ADMIN', 'SALON_OWNER'), deleteService);

export default router;
