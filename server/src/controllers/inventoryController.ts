import { Request, Response } from 'express';
import { Product } from '../models/Product';
import { InventoryTransaction } from '../models/InventoryTransaction';
import { Supplier } from '../models/Supplier';
import { Notification } from '../models/Notification';

export const getProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const { category, status, search } = req.query;
    const query: any = {};

    if (category && category !== 'ALL') query.category = category;
    if (status && status !== 'ALL') query.status = status;
    if (search) {
      query.$or = [
        { name: { $regex: search as string, $options: 'i' } },
        { sku: { $regex: search as string, $options: 'i' } },
        { supplier: { $regex: search as string, $options: 'i' } },
      ];
    }

    const products = await Product.find(query).sort('category name');
    res.json({ success: true, count: products.length, data: products });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getProductById = async (req: Request, res: Response): Promise<void> => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      res.status(404).json({ success: false, message: 'Product not found.' });
      return;
    }
    res.json({ success: true, data: product });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, sku, category, supplier, purchasePrice, sellingPrice, stockQuantity, minStockLevel, expiryDate } =
      req.body;

    if (!name || !sku || !category || !supplier || purchasePrice === undefined || sellingPrice === undefined) {
      res.status(400).json({ success: false, message: 'Please provide all mandatory product fields.' });
      return;
    }

    const existing = await Product.findOne({ sku: sku.toUpperCase() });
    if (existing) {
      res.status(400).json({ success: false, message: 'A product with this SKU already exists.' });
      return;
    }

    const product = await Product.create({
      name,
      sku: sku.toUpperCase(),
      category,
      supplier,
      purchasePrice: Number(purchasePrice),
      sellingPrice: Number(sellingPrice),
      stockQuantity: Number(stockQuantity) || 0,
      minStockLevel: Number(minStockLevel) || 5,
      expiryDate,
    });

    if (product.stockQuantity > 0) {
      await InventoryTransaction.create({
        product: product._id,
        productName: product.name,
        sku: product.sku,
        type: 'STOCK_IN',
        quantity: product.stockQuantity,
        reason: 'Initial inventory stock',
        performedBy: (req as any).user?.name || 'Admin',
      });
    }

    res.status(201).json({ success: true, data: product, message: 'Product added to inventory.' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!product) {
      res.status(404).json({ success: false, message: 'Product not found.' });
      return;
    }
    res.json({ success: true, data: product, message: 'Product updated.' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      res.status(404).json({ success: false, message: 'Product not found.' });
      return;
    }
    res.json({ success: true, message: 'Product deleted from inventory.' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const stockIn = async (req: Request, res: Response): Promise<void> => {
  try {
    const { productId, quantity, reason, supplier } = req.body;
    if (!productId || !quantity || quantity <= 0) {
      res.status(400).json({ success: false, message: 'Valid product and positive quantity required.' });
      return;
    }

    const product = await Product.findById(productId);
    if (!product) {
      res.status(404).json({ success: false, message: 'Product not found.' });
      return;
    }

    product.stockQuantity += Number(quantity);
    await product.save();

    const transaction = await InventoryTransaction.create({
      product: product._id,
      productName: product.name,
      sku: product.sku,
      type: 'STOCK_IN',
      quantity: Number(quantity),
      reason: reason || `Shipment restock from ${supplier || product.supplier}`,
      performedBy: (req as any).user?.name || 'Inventory Manager',
    });

    res.json({ success: true, data: product, transaction, message: `Successfully stocked in ${quantity} units.` });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const stockOut = async (req: Request, res: Response): Promise<void> => {
  try {
    const { productId, quantity, reason } = req.body;
    if (!productId || !quantity || quantity <= 0) {
      res.status(400).json({ success: false, message: 'Valid product and positive quantity required.' });
      return;
    }

    const product = await Product.findById(productId);
    if (!product) {
      res.status(404).json({ success: false, message: 'Product not found.' });
      return;
    }

    if (product.stockQuantity < quantity) {
      res.status(400).json({
        success: false,
        message: `Insufficient stock. Current stock is ${product.stockQuantity} units.`,
      });
      return;
    }

    product.stockQuantity -= Number(quantity);
    await product.save();

    const transaction = await InventoryTransaction.create({
      product: product._id,
      productName: product.name,
      sku: product.sku,
      type: 'STOCK_OUT',
      quantity: Number(quantity),
      reason: reason || 'Salon usage / sale',
      performedBy: (req as any).user?.name || 'Stylist / Staff',
    });

    if (product.stockQuantity <= product.minStockLevel) {
      await Notification.create({
        type: 'LOW_INVENTORY',
        title: 'Low Stock Alert',
        message: `${product.name} (SKU: ${product.sku}) is running low (${product.stockQuantity} remaining).`,
        link: '/admin/inventory',
      });
    }

    res.json({ success: true, data: product, transaction, message: `Successfully removed ${quantity} units.` });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getTransactions = async (req: Request, res: Response): Promise<void> => {
  try {
    const { productId, type } = req.query;
    const query: any = {};
    if (productId) query.product = productId;
    if (type) query.type = type;

    const transactions = await InventoryTransaction.find(query).sort('-date').limit(100);
    res.json({ success: true, data: transactions });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
