import mongoose, { Schema, Document } from 'mongoose';

export interface IInventoryTransaction extends Document {
  product: mongoose.Types.ObjectId;
  productName: string;
  sku: string;
  type: 'STOCK_IN' | 'STOCK_OUT' | 'ADJUSTMENT' | 'USED_IN_SERVICE';
  quantity: number;
  reason?: string;
  date: Date;
  performedBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

const InventoryTransactionSchema = new Schema<IInventoryTransaction>(
  {
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: true, index: true },
    productName: { type: String, required: true },
    sku: { type: String, required: true },
    type: {
      type: String,
      enum: ['STOCK_IN', 'STOCK_OUT', 'ADJUSTMENT', 'USED_IN_SERVICE'],
      required: true,
    },
    quantity: { type: Number, required: true },
    reason: { type: String },
    date: { type: Date, default: Date.now },
    performedBy: { type: String, default: 'Admin' },
  },
  { timestamps: true }
);

export const InventoryTransaction = mongoose.model<IInventoryTransaction>(
  'InventoryTransaction',
  InventoryTransactionSchema
);
