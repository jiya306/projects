import { Router } from 'express';
import {
  getPromotions,
  getPromotionById,
  createPromotion,
  updatePromotion,
  deletePromotion,
  validatePromotion,
} from '../controllers/promotionController';
import { authenticate } from '../middleware/authMiddleware';

const router = Router();

// Public: validate promo and landing page offers
router.get('/', getPromotions);
router.post('/validate', validatePromotion);

// Authenticated management
router.get('/:id', authenticate, getPromotionById);
router.post('/', authenticate, createPromotion);
router.put('/:id', authenticate, updatePromotion);
router.delete('/:id', authenticate, deletePromotion);

export default router;
