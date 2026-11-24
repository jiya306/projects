import mongoose, { Schema, Document } from 'mongoose';
import { CustomerTier } from '../types';

export interface ICustomer extends Document {
  userId?: mongoose.Types.ObjectId;
  name: string;
  phone: string;
  email: string;
  dateOfBirth?: string;
  address?: string;
  gender?: 'MALE' | 'FEMALE' | 'OTHER' | 'PREFER_NOT_TO_SAY';
  totalVisits: number;
  totalSpending: number;
  loyaltyPoints: number;
  tier: CustomerTier;
  preferredStylist?: mongoose.Types.ObjectId;
  notes?: string;
  lastVisitDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const CustomerSchema = new Schema<ICustomer>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, unique: true, trim: true, index: true },
    email: { type: String, required: true, lowercase: true, trim: true, index: true },
    dateOfBirth: { type: String },
    address: { type: String },
    gender: { type: String, enum: ['MALE', 'FEMALE', 'OTHER', 'PREFER_NOT_TO_SAY'], default: 'FEMALE' },
    totalVisits: { type: Number, default: 0 },
    totalSpending: { type: Number, default: 0 },
    loyaltyPoints: { type: Number, default: 0 },
    tier: {
      type: String,
      enum: ['BRONZE', 'SILVER', 'GOLD', 'PLATINUM'],
      default: 'BRONZE',
    },
    preferredStylist: { type: Schema.Types.ObjectId, ref: 'Staff' },
    notes: { type: String },
    lastVisitDate: { type: Date },
  },
  { timestamps: true }
);

export const Customer = mongoose.model<ICustomer>('Customer', CustomerSchema);
