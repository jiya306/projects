import mongoose, { Schema, Document } from 'mongoose';

export interface IReview extends Document {
  customer: mongoose.Types.ObjectId;
  customerName: string;
  customerAvatar?: string;
  appointment?: mongoose.Types.ObjectId;
  service: mongoose.Types.ObjectId;
  serviceName: string;
  stylist: mongoose.Types.ObjectId;
  stylistName: string;
  rating: number; // 1 - 5
  reviewText: string;
  date: Date;
  approved: boolean;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ReviewSchema = new Schema<IReview>(
  {
    customer: { type: Schema.Types.ObjectId, ref: 'Customer', required: true },
    customerName: { type: String, required: true },
    customerAvatar: { type: String },
    appointment: { type: Schema.Types.ObjectId, ref: 'Appointment' },
    service: { type: Schema.Types.ObjectId, ref: 'Service', required: true, index: true },
    serviceName: { type: String, required: true },
    stylist: { type: Schema.Types.ObjectId, ref: 'Staff', required: true, index: true },
    stylistName: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    reviewText: { type: String, required: true },
    date: { type: Date, default: Date.now },
    approved: { type: Boolean, default: true },
    featured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Review = mongoose.model<IReview>('Review', ReviewSchema);
