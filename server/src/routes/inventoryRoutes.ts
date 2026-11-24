import { Router } from 'express';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  stockIn,
  stockOut,
  getTransactions,
} from '../controllers/inventoryController';
import { authenticate } from '../middleware/authMiddleware';

const router = Router();

router.get('/', authenticate, getProducts);
router.get('/transactions', authenticate, getTransactions);
router.get('/:id', authenticate, getProductById);
router.post('/', authenticate, createProduct);
router.put('/:id', authenticate, updateProduct);
router.delete('/:id', authenticate, deleteProduct);
router.post('/stock-in', authenticate, stockIn);
router.post('/stock-out', authenticate, stockOut);

export default router;
