import mongoose, { Schema, Document } from 'mongoose';

export interface ILoyaltyTransaction extends Document {
  customer: mongoose.Types.ObjectId;
  type: 'EARNED' | 'REDEEMED' | 'EXPIRED' | 'ADJUSTMENT' | 'REFERRAL';
  points: number;
  reason: string;
  balanceAfter: number;
  appointment?: mongoose.Types.ObjectId;
  date: Date;
}

const LoyaltyTransactionSchema = new Schema<ILoyaltyTransaction>(
  {
    customer: { type: Schema.Types.ObjectId, ref: 'Customer', required: true, index: true },
    type: {
      type: String,
      enum: ['EARNED', 'REDEEMED', 'EXPIRED', 'ADJUSTMENT', 'REFERRAL'],
      required: true,
    },
    points: { type: Number, required: true },
    reason: { type: String, required: true },
    balanceAfter: { type: Number, required: true },
    appointment: { type: Schema.Types.ObjectId, ref: 'Appointment' },
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const LoyaltyTransaction = mongoose.model<ILoyaltyTransaction>(
  'LoyaltyTransaction',
  LoyaltyTransactionSchema
);
