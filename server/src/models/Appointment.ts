import mongoose, { Schema, Document } from 'mongoose';
import { AppointmentStatus, PaymentStatus } from '../types';

export interface IAppointment extends Document {
  appointmentId: string;
  customer: mongoose.Types.ObjectId;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  service: mongoose.Types.ObjectId;
  serviceName: string;
  stylist: mongoose.Types.ObjectId;
  stylistName: string;
  appointmentDate: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  durationMinutes: number;
  price: number;
  discount: number;
  finalPrice: number;
  couponCode?: string;
  status: AppointmentStatus;
  paymentStatus: PaymentStatus;
  notes?: string;
  bookingSource: 'ONLINE_WIZARD' | 'WALK_IN' | 'PHONE' | 'ADMIN';
  createdAt: Date;
  updatedAt: Date;
}

const AppointmentSchema = new Schema<IAppointment>(
  {
    appointmentId: { type: String, required: true, unique: true, index: true },
    customer: { type: Schema.Types.ObjectId, ref: 'Customer', required: true, index: true },
    customerName: { type: String, required: true },
    customerPhone: { type: String, required: true },
    customerEmail: { type: String, required: true },
    service: { type: Schema.Types.ObjectId, ref: 'Service', required: true },
    serviceName: { type: String, required: true },
    stylist: { type: Schema.Types.ObjectId, ref: 'Staff', required: true, index: true },
    stylistName: { type: String, required: true },
    appointmentDate: { type: String, required: true, index: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    durationMinutes: { type: Number, required: true },
    price: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    finalPrice: { type: Number, required: true },
    couponCode: { type: String },
    status: {
      type: String,
      enum: ['PENDING', 'CONFIRMED', 'CHECKED_IN', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'NO_SHOW'],
      default: 'PENDING',
      index: true,
    },
    paymentStatus: {
      type: String,
      enum: ['PENDING', 'PAID', 'PARTIALLY_PAID', 'REFUNDED'],
      default: 'PENDING',
    },
    notes: { type: String },
    bookingSource: {
      type: String,
      enum: ['ONLINE_WIZARD', 'WALK_IN', 'PHONE', 'ADMIN'],
      default: 'ONLINE_WIZARD',
    },
  },
  { timestamps: true }
);

// Compound index for fast conflict detection:
AppointmentSchema.index({ stylist: 1, appointmentDate: 1, startTime: 1 });

export const Appointment = mongoose.model<IAppointment>('Appointment', AppointmentSchema);
