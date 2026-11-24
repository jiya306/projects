export type UserRole = 'ADMIN' | 'SALON_OWNER' | 'RECEPTIONIST' | 'STYLIST' | 'CUSTOMER';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatar?: string;
  staffId?: string;
  customerId?: string;
  loyaltyPoints?: number;
  tier?: string;
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
export type ServiceCategory = 'HAIR' | 'BEAUTY' | 'NAILS' | 'BRIDAL' | 'TREATMENT';

export interface Customer {
  _id: string;
  name: string;
  phone: string;
  email: string;
  dateOfBirth?: string;
  address?: string;
  gender?: string;
  totalVisits: number;
  totalSpending: number;
  loyaltyPoints: number;
  tier: CustomerTier;
  preferredStylist?: any;
  notes?: string;
  lastVisitDate?: string;
  createdAt: string;
}

export interface Staff {
  _id: string;
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
  workingHours: { start: string; end: string };
  leaveStatus: boolean;
  active: boolean;
  image?: string;
  rating: number;
  reviewCount: number;
  bio?: string;
}

export interface Service {
  _id: string;
  name: string;
  category: ServiceCategory;
  description: string;
  price: number;
  durationMinutes: number;
  image?: string;
  active: boolean;
  popular: boolean;
}

export interface Appointment {
  _id: string;
  appointmentId: string;
  customer: any;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  service: any;
  serviceName: string;
  stylist: any;
  stylistName: string;
  appointmentDate: string;
  startTime: string;
  endTime: string;
  durationMinutes: number;
  price: number;
  discount: number;
  finalPrice: number;
  couponCode?: string;
  status: AppointmentStatus;
  paymentStatus: PaymentStatus;
  notes?: string;
  bookingSource: string;
  createdAt: string;
}

export interface Invoice {
  _id: string;
  invoiceNumber: string;
  customer: any;
  customerName: string;
  customerPhone?: string;
  appointment?: any;
  items: {
    name: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }[];
  subtotal: number;
  discount: number;
  tax: number;
  finalAmount: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  issuedDate: string;
  notes?: string;
}

export interface Payment {
  _id: string;
  paymentId: string;
  appointment?: any;
  customer: any;
  customerName: string;
  invoice?: any;
  amount: number;
  method: PaymentMethod;
  status: PaymentStatus;
  date: string;
  transactionRef?: string;
  notes?: string;
}

export interface Product {
  _id: string;
  name: string;
  sku: string;
  category: string;
  supplier: string;
  purchasePrice: number;
  sellingPrice: number;
  stockQuantity: number;
  minStockLevel: number;
  expiryDate?: string;
  status: 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK';
}

export interface Promotion {
  _id: string;
  code: string;
  title: string;
  description: string;
  discountType: 'PERCENTAGE' | 'FIXED';
  discountValue: number;
  minPurchase: number;
  maxDiscount?: number;
  startDate: string;
  endDate: string;
  usageLimit?: number;
  usedCount: number;
  active: boolean;
}

export interface Review {
  _id: string;
  customer: any;
  customerName: string;
  customerAvatar?: string;
  appointment?: any;
  service: any;
  serviceName: string;
  stylist: any;
  stylistName: string;
  rating: number;
  reviewText: string;
  date: string;
  approved: boolean;
  featured: boolean;
}

export interface NotificationItem {
  _id: string;
  type: string;
  title: string;
  message: string;
  read: boolean;
  link?: string;
  createdAt: string;
}

export interface SalonSettings {
  salonName: string;
  tagline: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  openingHours: string;
  closingHours: string;
  workingDays: string[];
  bufferTimeMinutes: number;
  advanceBookingDays: number;
  cancellationPolicy: string;
  taxRatePercent: number;
  taxName: string;
  currencySymbol: string;
  loyaltyEarnRate: number;
  loyaltyRedeemRate: number;
}
