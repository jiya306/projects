import mongoose, { Schema, Document } from 'mongoose';
import { ServiceCategory } from '../types';

export interface IService extends Document {
  name: string;
  category: ServiceCategory;
  description: string;
  price: number;
  durationMinutes: number;
  image?: string;
  active: boolean;
  popular: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ServiceSchema = new Schema<IService>(
  {
    name: { type: String, required: true, trim: true },
    category: {
      type: String,
      enum: ['HAIR', 'BEAUTY', 'NAILS', 'BRIDAL', 'TREATMENT'],
      required: true,
      index: true,
    },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    durationMinutes: { type: Number, required: true, default: 45 },
    image: { type: String },
    active: { type: Boolean, default: true },
    popular: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Service = mongoose.model<IService>('Service', ServiceSchema);
