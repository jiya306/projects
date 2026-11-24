import { Request } from 'express';

export type UserRole = 'ADMIN' | 'SALON_OWNER' | 'RECEPTIONIST' | 'STYLIST' | 'CUSTOMER';

export interface AuthUserPayload {
  userId: string;
  email: string;
  role: UserRole;
  name: string;
}

export interface AuthenticatedRequest extends Request {
  user?: AuthUserPayload;
}

export type AppointmentStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'CHECKED_IN'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'NO_SHOW';

export type PaymentMethod = 'CASH' | 'UPI' | 'CARD' | 'ONLINE';

export type PaymentStatus = 'PENDING' | 'PAID' | 'PARTIALLY_PAID' | 'REFUNDED';

export type CustomerTier = 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM';

export type DiscountType = 'PERCENTAGE' | 'FIXED';

export type ServiceCategory = 'HAIR' | 'BEAUTY' | 'NAILS' | 'BRIDAL' | 'TREATMENT';
