import mongoose, { Schema, Document } from 'mongoose';

export interface ISalonSettings extends Document {
  salonName: string;
  tagline: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  openingHours: string; // "10:00"
  closingHours: string; // "20:00"
  workingDays: string[];
  bufferTimeMinutes: number; // e.g. 15
  advanceBookingDays: number; // e.g. 30
  cancellationPolicy: string;
  taxRatePercent: number; // e.g. 18 (GST)
  taxName: string; // e.g. "GST"
  currencySymbol: string; // e.g. "₹"
  loyaltyEarnRate: number; // e.g. 1 point per 100 spent
  loyaltyRedeemRate: number; // e.g. 100 points = 100 discount
  createdAt: Date;
  updatedAt: Date;
}

const SalonSettingsSchema = new Schema<ISalonSettings>(
  {
    salonName: { type: String, default: 'SalonFlow Luxe Studio' },
    tagline: { type: String, default: 'Your Beauty. Your Time. Your Salon.' },
    phone: { type: String, default: '+91 98765 43210' },
    email: { type: String, default: 'concierge@salonflow.demo' },
    address: { type: String, default: '42, Boulevard Promenade, Indiranagar, Bengaluru, Karnataka 560038' },
    city: { type: String, default: 'Bengaluru' },
    openingHours: { type: String, default: '10:00' },
    closingHours: { type: String, default: '20:00' },
    workingDays: {
      type: [String],
      default: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    },
    bufferTimeMinutes: { type: Number, default: 15 },
    advanceBookingDays: { type: Number, default: 30 },
    cancellationPolicy: {
      type: String,
      default: 'Free cancellation up to 4 hours before your scheduled appointment.',
    },
    taxRatePercent: { type: Number, default: 18 },
    taxName: { type: String, default: 'GST' },
    currencySymbol: { type: String, default: '₹' },
    loyaltyEarnRate: { type: Number, default: 100 }, // ₹100 = 1 point
    loyaltyRedeemRate: { type: Number, default: 1 }, // 1 point = ₹1
  },
  { timestamps: true }
);

export const SalonSettings = mongoose.model<ISalonSettings>('SalonSettings', SalonSettingsSchema);
