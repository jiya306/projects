import mongoose, { Schema, Document } from 'mongoose';

export interface INotification extends Document {
  type:
    | 'APPOINTMENT_BOOKED'
    | 'APPOINTMENT_CONFIRMED'
    | 'APPOINTMENT_CANCELLED'
    | 'APPOINTMENT_REMINDER'
    | 'PAYMENT_COMPLETED'
    | 'LOW_INVENTORY'
    | 'NEW_CUSTOMER'
    | 'NEW_REVIEW';
  title: string;
  message: string;
  read: boolean;
  link?: string;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const NotificationSchema = new Schema<INotification>(
  {
    type: {
      type: String,
      enum: [
        'APPOINTMENT_BOOKED',
        'APPOINTMENT_CONFIRMED',
        'APPOINTMENT_CANCELLED',
        'APPOINTMENT_REMINDER',
        'PAYMENT_COMPLETED',
        'LOW_INVENTORY',
        'NEW_CUSTOMER',
        'NEW_REVIEW',
      ],
      required: true,
    },
    title: { type: String, required: true },
    message: { type: String, required: true },
    read: { type: Boolean, default: false, index: true },
    link: { type: String },
    metadata: { type: Schema.Types.Mixed },
  },
  { timestamps: true }
);

export const Notification = mongoose.model<INotification>('Notification', NotificationSchema);
