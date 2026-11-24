import mongoose, { Schema, Document } from 'mongoose';

export interface ICouponUsage extends Document {
  couponCode: string;
  customer: mongoose.Types.ObjectId;
  appointment?: mongoose.Types.ObjectId;
  discountAmount: number;
  usedAt: Date;
}

const CouponUsageSchema = new Schema<ICouponUsage>(
  {
    couponCode: { type: String, required: true, uppercase: true, index: true },
    customer: { type: Schema.Types.ObjectId, ref: 'Customer', required: true, index: true },
    appointment: { type: Schema.Types.ObjectId, ref: 'Appointment' },
    discountAmount: { type: Number, required: true },
    usedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const CouponUsage = mongoose.model<ICouponUsage>('CouponUsage', CouponUsageSchema);
