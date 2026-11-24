import mongoose, { Schema, Document } from 'mongoose';
import { UserRole } from '../types';

export interface IStaff extends Document {
  userId?: mongoose.Types.ObjectId;
  employeeId: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  specialization: string[];
  experienceYears: number;
  salary: number;
  commissionPercentage: number;
  workingDays: string[];
  workingHours: {
    start: string;
    end: string;
  };
  leaveStatus: boolean;
  active: boolean;
  image?: string;
  rating: number;
  reviewCount: number;
  joiningDate: Date;
  bio?: string;
  createdAt: Date;
  updatedAt: Date;
}

const StaffSchema = new Schema<IStaff>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    employeeId: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true, index: true },
    phone: { type: String, required: true, trim: true },
    role: {
      type: String,
      enum: ['ADMIN', 'SALON_OWNER', 'RECEPTIONIST', 'STYLIST'],
      default: 'STYLIST',
    },
    specialization: [{ type: String }],
    experienceYears: { type: Number, default: 2 },
    salary: { type: Number, default: 25000 },
    commissionPercentage: { type: Number, default: 10 },
    workingDays: {
      type: [String],
      default: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    },
    workingHours: {
      start: { type: String, default: '10:00' },
      end: { type: String, default: '20:00' },
    },
    leaveStatus: { type: Boolean, default: false },
    active: { type: Boolean, default: true },
    image: { type: String },
    rating: { type: Number, default: 4.8 },
    reviewCount: { type: Number, default: 0 },
    joiningDate: { type: Date, default: Date.now },
    bio: { type: String },
  },
  { timestamps: true }
);

export const Staff = mongoose.model<IStaff>('Staff', StaffSchema);
