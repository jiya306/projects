import { Router } from 'express';
import {
  getPayments,
  getPaymentById,
  createPayment,
  getInvoices,
  getInvoiceById,
} from '../controllers/paymentController';
import { authenticate } from '../middleware/authMiddleware';

const router = Router();

router.get('/', authenticate, getPayments);
router.get('/invoices', authenticate, getInvoices);
router.get('/invoices/:id', authenticate, getInvoiceById);
router.get('/:id', authenticate, getPaymentById);
router.post('/', authenticate, createPayment);

export default router;
