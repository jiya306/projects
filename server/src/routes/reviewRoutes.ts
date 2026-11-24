import { Router } from 'express';
import {
  getReviews,
  createReview,
  updateReview,
  deleteReview,
} from '../controllers/reviewController';
import { authenticate } from '../middleware/authMiddleware';

const router = Router();

// Public: landing page testimonials
router.get('/', getReviews);
router.post('/', authenticate, createReview);
router.put('/:id', authenticate, updateReview);
router.delete('/:id', authenticate, deleteReview);

export default router;
