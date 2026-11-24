import mongoose, { Schema, Document } from 'mongoose';
import { PaymentMethod, PaymentStatus } from '../types';

export interface IPayment extends Document {
  paymentId: string;
  appointment?: mongoose.Types.ObjectId;
  customer: mongoose.Types.ObjectId;
  customerName: string;
  invoice?: mongoose.Types.ObjectId;
  amount: number;
  method: PaymentMethod;
  status: PaymentStatus;
  date: Date;
  transactionRef?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const PaymentSchema = new Schema<IPayment>(
  {
    paymentId: { type: String, required: true, unique: true, index: true },
    appointment: { type: Schema.Types.ObjectId, ref: 'Appointment' },
    customer: { type: Schema.Types.ObjectId, ref: 'Customer', required: true, index: true },
    customerName: { type: String, required: true },
    invoice: { type: Schema.Types.ObjectId, ref: 'Invoice' },
    amount: { type: Number, required: true },
    method: {
      type: String,
      enum: ['CASH', 'UPI', 'CARD', 'ONLINE'],
      required: true,
    },
    status: {
      type: String,
      enum: ['PENDING', 'PAID', 'PARTIALLY_PAID', 'REFUNDED'],
      default: 'PAID',
    },
    date: { type: Date, default: Date.now },
    transactionRef: { type: String },
    notes: { type: String },
  },
  { timestamps: true }
);

export const Payment = mongoose.model<IPayment>('Payment', PaymentSchema);
