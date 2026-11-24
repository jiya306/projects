import { Router } from 'express';
import { getSettings, updateSettings } from '../controllers/settingsController';
import { authenticate, requireRole } from '../middleware/authMiddleware';

const router = Router();

// Public: allows landing page and wizard to fetch salon hours, buffer time, policies
router.get('/', getSettings);
router.put('/', authenticate, requireRole('ADMIN', 'SALON_OWNER'), updateSettings);

export default router;
