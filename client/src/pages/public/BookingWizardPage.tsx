import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../../services/api';
import { Service, Staff, Appointment } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import { formatCurrency, formatTime, formatDate } from '../../utils/formatters';
import {
  Scissors,
  UserCheck,
  Calendar as CalendarIcon,
  Clock,
  User,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Star,
  Tag,
  Sparkles,
  Phone,
  Mail,
  ShieldCheck,
  Receipt,
  FileCheck,
} from 'lucide-react';

interface Slot {
  startTime: string;
  endTime: string;
  available: boolean;
}

export const BookingWizardPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  // Wizard state (Steps 1 to 6)
  const [step, setStep] = useState<number>(1);
  const [services, setServices] = useState<Service[]>([]);
  const [stylists, setStylists] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);

  // Selections
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedStylistId, setSelectedStylistId] = useState<string>('any');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [availableSlots, setAvailableSlots] = useState<Slot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<string>('');
  const [loadingSlots, setLoadingSlots] = useState<boolean>(false);

  // Customer Form
  const [customerName, setCustomerName] = useState(user?.name || '');
  const [customerPhone, setCustomerPhone] = useState(user?.phone || '');
  const [customerEmail, setCustomerEmail] = useState(user?.email || '');
  const [notes, setNotes] = useState('');
  const [couponCode, setCouponCode] = useState(searchParams.get('coupon') || '');
  const [appliedPromo, setAppliedPromo] = useState<{
    code: string;
    discountAmount: number;
    finalAmount: number;
  } | null>(null);
  const [promoError, setPromoError] = useState('');
  const [isValidatingPromo, setIsValidatingPromo] = useState(false);

  // Booking result
  const [bookingConfirmed, setBookingConfirmed] = useState<Appointment | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Initial data load
  useEffect(() => {
    const initData = async () => {
      try {
        setLoading(true);
        const [servicesRes, staffRes] = await Promise.all([
          api.get<{ success: boolean; data: Service[] }>('/services?active=true'),
          api.get<{ success: boolean; data: Staff[] }>('/staff?active=true'),
        ]);

        if (servicesRes.success) {
          setServices(servicesRes.data);

          // Preselect from URL query param
          const preselectedServiceId = searchParams.get('serviceId');
          if (preselectedServiceId) {
            const found = servicesRes.data.find((s) => s._id === preselectedServiceId);
            if (found) setSelectedService(found);
          }
        }

        if (staffRes.success) {
          setStylists(staffRes.data);
          const preselectedStylistId = searchParams.get('stylistId');
          if (preselectedStylistId) {
            setSelectedStylistId(preselectedStylistId);
          }
        }

        // Set default date to today
        const todayStr = new Date().toISOString().split('T')[0];
        setSelectedDate(todayStr);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    initData();
  }, [searchParams]);

  // Sync with auth user
  useEffect(() => {
    if (user) {
      if (!customerName) setCustomerName(user.name);
      if (!customerPhone) setCustomerPhone(user.phone);
      if (!customerEmail) setCustomerEmail(user.email);
    }
  }, [user]);

  // Fetch slots whenever service, stylist, or date changes
  useEffect(() => {
    if (!selectedService || !selectedDate) return;

    const fetchSlots = async () => {
      try {
        setLoadingSlots(true);
        setSelectedSlot('');
        const res = await api.get<{ success: boolean; slots: Slot[] }>(
          `/appointments/availability?date=${selectedDate}&stylistId=${selectedStylistId}&duration=${selectedService.durationMinutes}`
        );
        if (res.success) {
          setAvailableSlots(res.slots || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingSlots(false);
      }
    };

    fetchSlots();
  }, [selectedService, selectedStylistId, selectedDate]);

  // Validate Promo Code
  const handleValidatePromo = async () => {
    if (!couponCode || !selectedService) return;
    try {
      setIsValidatingPromo(true);
      setPromoError('');
      const res = await api.post<{
        success: boolean;
        valid: boolean;
        code: string;
        discountAmount: number;
        finalAmount: number;
        message: string;
      }>('/promotions/validate', {
        code: couponCode,
        amount: selectedService.price,
      });

      if (res.valid) {
        setAppliedPromo({
          code: res.code,
          discountAmount: res.discountAmount,
          finalAmount: res.finalAmount,
        });
      }
    } catch (err: any) {
      setAppliedPromo(null);
      setPromoError(err.message || 'Invalid promotion code.');
    } finally {
      setIsValidatingPromo(false);
    }
  };

  // Submit appointment
  const handleConfirmBooking = async () => {
    if (!selectedService || !selectedDate || !selectedSlot || !customerName || !customerPhone) {
      setErrorMsg('Please complete all required fields.');
      return;
    }

    try {
      setSubmitting(true);
      setErrorMsg('');

      const res = await api.post<{ success: boolean; data: Appointment; message: string }>(
        '/appointments',
        {
          serviceId: selectedService._id,
          stylistId: selectedStylistId === 'any' ? undefined : selectedStylistId,
          date: selectedDate,
          startTime: selectedSlot,
          customerName,
          customerPhone,
          customerEmail,
          notes,
          couponCode: appliedPromo?.code || couponCode || undefined,
          bookingSource: 'ONLINE_WIZARD',
        }
      );

      if (res.success) {
        setBookingConfirmed(res.data);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to complete booking. Please try another slot.');
    } finally {
      setSubmitting(false);
    }
  };

  // Generate next 14 dates for quick date picker
  const upcomingDates = Array.from({ length: 14 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    const dateStr = d.toISOString().split('T')[0];
    const dayName = d.toLocaleDateString('en-IN', { weekday: 'short' });
    const dayNumber = d.getDate();
    const month = d.toLocaleDateString('en-IN', { month: 'short' });
    return { dateStr, dayName, dayNumber, month };
  });

  const selectedStylistObj = stylists.find((s) => s._id === selectedStylistId);

  // Steps definition
  const stepsTitles = [
    'Service',
    'Stylist',
    'Date & Time',
    'Your Details',
    'Review & Confirm',
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
      {/* Wizard Header */}
      <div className="text-center max-w-xl mx-auto mb-10 space-y-3">
        <Badge variant="brand" size="sm">
          Concierge Booking Engine
        </Badge>
        <h1 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-text-primary">
          Reserve Your Salon Flow
        </h1>
        <p className="text-xs sm:text-sm text-text-secondary">
          Step-by-step reservation with real-time stylist availability and instant confirmation.
        </p>
      </div>

      {/* Progress Step Bar */}
      {!bookingConfirmed && (
        <div className="mb-10">
          <div className="flex items-center justify-between max-w-3xl mx-auto relative">
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-salon-border -translate-y-1/2 z-0" />
            {stepsTitles.map((title, idx) => {
              const stepNumber = idx + 1;
              const isPast = step > stepNumber;
              const isCurrent = step === stepNumber;

              return (
                <div key={title} className="relative z-10 flex flex-col items-center">
                  <button
                    onClick={() => {
                      if (isPast) setStep(stepNumber);
                    }}
                    disabled={!isPast}
                    className={`w-9 h-9 rounded-full flex items-center justify-center font-mono text-xs font-bold transition-all ${
                      isPast
                        ? 'bg-brand text-text-primary hover:scale-105 cursor-pointer'
                        : isCurrent
                        ? 'bg-surface-dark text-white ring-4 ring-brand/30 shadow-subtle'
                        : 'bg-white border border-salon-border text-text-muted cursor-not-allowed'
                    }`}
                  >
                    {isPast ? <CheckCircle className="w-4 h-4 text-text-primary" /> : stepNumber}
                  </button>
                  <span
                    className={`text-[11px] font-medium mt-1.5 hidden sm:block ${
                      isCurrent ? 'text-text-primary font-bold' : 'text-text-muted'
                    }`}
                  >
                    {title}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Confirmation View */}
      {bookingConfirmed ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-xl mx-auto"
        >
          <Card variant="white" className="p-8 text-center border-2 border-brand/50 shadow-card">
            <div className="w-16 h-16 rounded-full bg-brand-light/60 text-brand-deep flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8" />
            </div>

            <span className="text-xs font-mono uppercase text-brand-deep font-bold tracking-widest">
              Booking Confirmed
            </span>
            <h2 className="font-display text-2xl font-bold text-text-primary mt-1">
              We look forward to welcoming you!
            </h2>
            <p className="text-xs text-text-muted mt-1">
              Your appointment has been registered in the salon calendar.
            </p>

            {/* Receipt Summary Box */}
            <div className="mt-6 p-6 rounded-card bg-surface-bone text-left space-y-3 border border-salon-border">
              <div className="flex items-center justify-between pb-3 border-b border-salon-border">
                <span className="text-xs text-text-muted uppercase font-mono">Appointment ID</span>
                <span className="font-mono text-xs font-bold text-text-primary bg-white px-2 py-1 rounded border border-salon-border">
                  {bookingConfirmed.appointmentId}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-text-secondary">Service:</span>
                <span className="font-bold text-text-primary">{bookingConfirmed.serviceName}</span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-text-secondary">Stylist:</span>
                <span className="font-bold text-text-primary">{bookingConfirmed.stylistName}</span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-text-secondary">Date & Time:</span>
                <span className="font-bold text-text-primary">
                  {formatDate(bookingConfirmed.appointmentDate)} at {formatTime(bookingConfirmed.startTime)}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-text-secondary">Guest Name:</span>
                <span className="font-bold text-text-primary">{bookingConfirmed.customerName}</span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-text-secondary">Contact:</span>
                <span className="font-mono text-text-primary">{bookingConfirmed.customerPhone}</span>
              </div>

              <div className="pt-3 border-t border-salon-border flex items-center justify-between">
                <span className="text-xs font-bold text-text-primary">Total to Pay at Salon:</span>
                <span className="font-display text-xl font-bold text-text-primary">
                  {formatCurrency(bookingConfirmed.finalPrice)}
                </span>
              </div>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Button
                variant="primary"
                size="md"
                className="flex-1"
                onClick={() => navigate('/dashboard/appointments')}
              >
                View in Dashboard
              </Button>
              <Button
                variant="outline"
                size="md"
                className="flex-1"
                onClick={() => {
                  setBookingConfirmed(null);
                  setStep(1);
                  setSelectedService(null);
                  setSelectedSlot('');
                }}
              >
                Book Another Service
              </Button>
            </div>
          </Card>
        </motion.div>
      ) : (
        /* WIZARD STEPS */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Step Area */}
          <div className="lg:col-span-8 space-y-6">
            {/* STEP 1: SELECT SERVICE */}
            {step === 1 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-xl font-bold text-text-primary">
                    Step 1: Choose Your Service
                  </h3>
                  <span className="text-xs text-text-muted font-mono">
                    {services.length} services available
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[500px] overflow-y-auto pr-1">
                  {services.map((srv) => {
                    const isSelected = selectedService?._id === srv._id;
                    return (
                      <div
                        key={srv._id}
                        onClick={() => setSelectedService(srv)}
                        className={`p-4 rounded-card border transition-all cursor-pointer flex flex-col justify-between ${
                          isSelected
                            ? 'bg-brand-light/30 border-brand shadow-card ring-2 ring-brand'
                            : 'bg-white border-salon-border hover:border-brand/50'
                        }`}
                      >
                        <div className="flex items-start gap-3 mb-3">
                          <img
                            src={srv.image || 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=150'}
                            alt={srv.name}
                            className="w-14 h-14 rounded-xl object-cover border border-salon-border shrink-0"
                          />
                          <div>
                            <span className="text-[10px] font-mono uppercase tracking-wider text-text-muted">
                              {srv.category}
                            </span>
                            <h4 className="font-display text-sm font-bold text-text-primary leading-snug">
                              {srv.name}
                            </h4>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-salon-border/60 text-xs">
                          <span className="text-text-muted flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {srv.durationMinutes}m
                          </span>
                          <span className="font-display text-base font-bold text-text-primary">
                            {formatCurrency(srv.price)}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="pt-4 flex justify-end">
                  <Button
                    variant="primary"
                    disabled={!selectedService}
                    onClick={() => setStep(2)}
                    rightIcon={<ArrowRight className="w-4 h-4" />}
                  >
                    Continue to Stylist
                  </Button>
                </div>
              </motion.div>
            )}

            {/* STEP 2: SELECT STYLIST */}
            {step === 2 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-xl font-bold text-text-primary">
                    Step 2: Select Your Preferred Stylist
                  </h3>
                  <span className="text-xs text-text-muted">Any available or specific master artist</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[500px] overflow-y-auto pr-1">
                  {/* Any Available Stylist Card */}
                  <div
                    onClick={() => setSelectedStylistId('any')}
                    className={`p-5 rounded-card border transition-all cursor-pointer flex items-center gap-4 ${
                      selectedStylistId === 'any'
                        ? 'bg-brand-light/30 border-brand shadow-card ring-2 ring-brand'
                        : 'bg-white border-salon-border hover:border-brand/50'
                    }`}
                  >
                    <div className="w-12 h-12 rounded-full bg-surface-dark text-brand flex items-center justify-center shrink-0">
                      <Sparkles className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-display text-sm font-bold text-text-primary">
                        Any Available Stylist
                      </h4>
                      <p className="text-xs text-text-muted mt-0.5">
                        Matches you with the next available master artist for maximum flexibility.
                      </p>
                    </div>
                  </div>

                  {/* Stylists List */}
                  {stylists.map((stf) => {
                    const isSelected = selectedStylistId === stf._id;
                    return (
                      <div
                        key={stf._id}
                        onClick={() => setSelectedStylistId(stf._id)}
                        className={`p-4 rounded-card border transition-all cursor-pointer flex items-center gap-3 ${
                          isSelected
                            ? 'bg-brand-light/30 border-brand shadow-card ring-2 ring-brand'
                            : 'bg-white border-salon-border hover:border-brand/50'
                        }`}
                      >
                        <img
                          src={stf.image || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120'}
                          alt={stf.name}
                          className="w-12 h-12 rounded-full object-cover border border-salon-border shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h4 className="font-display text-sm font-bold text-text-primary truncate">
                              {stf.name}
                            </h4>
                            <span className="text-xs text-amber-500 font-bold flex items-center gap-0.5">
                              <Star className="w-3 h-3 fill-amber-400 text-amber-400" /> {stf.rating}
                            </span>
                          </div>
                          <p className="text-xs text-brand-deep font-medium truncate">
                            {stf.specialization?.[0] || 'Stylist'}
                          </p>
                          <p className="text-[10px] text-text-muted font-mono">
                            {stf.experienceYears}+ yrs exp
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="pt-4 flex items-center justify-between">
                  <Button variant="outline" onClick={() => setStep(1)} leftIcon={<ArrowLeft className="w-4 h-4" />}>
                    Back
                  </Button>
                  <Button variant="primary" onClick={() => setStep(3)} rightIcon={<ArrowRight className="w-4 h-4" />}>
                    Continue to Date & Time
                  </Button>
                </div>
              </motion.div>
            )}

            {/* STEP 3: DATE & TIME */}
            {step === 3 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <div>
                  <h3 className="font-display text-xl font-bold text-text-primary mb-3">
                    Step 3: Select Date & Time
                  </h3>
                  <p className="text-xs text-text-muted mb-4">
                    Showing real-time availability for{' '}
                    <strong className="text-text-primary">
                      {selectedStylistId === 'any' ? 'Any Available Stylist' : selectedStylistObj?.name}
                    </strong>
                  </p>

                  {/* Horizontal Date Picker */}
                  <div className="flex items-center gap-2 overflow-x-auto pb-3 scrollbar-none">
                    {upcomingDates.map((item) => {
                      const isSelected = selectedDate === item.dateStr;
                      return (
                        <button
                          key={item.dateStr}
                          onClick={() => setSelectedDate(item.dateStr)}
                          className={`p-3 rounded-2xl min-w-[70px] text-center border transition-all ${
                            isSelected
                              ? 'bg-brand text-text-primary font-bold shadow-subtle border-brand'
                              : 'bg-white border-salon-border text-text-secondary hover:bg-surface-bone'
                          }`}
                        >
                          <span className="text-[10px] uppercase font-mono block">{item.dayName}</span>
                          <span className="text-lg font-display font-extrabold block my-0.5">{item.dayNumber}</span>
                          <span className="text-[10px] uppercase font-mono block">{item.month}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Available Slots Grid */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-xs font-mono uppercase tracking-wider text-text-secondary font-semibold">
                      Available Time Slots on {formatDate(selectedDate)}
                    </h4>
                    {loadingSlots && <span className="text-xs text-brand-deep">Checking slots...</span>}
                  </div>

                  {loadingSlots ? (
                    <div className="p-8 text-center text-xs text-text-muted">Loading schedule...</div>
                  ) : availableSlots.length === 0 ? (
                    <div className="p-8 text-center text-xs text-text-muted border rounded-card bg-surface-bone">
                      No slots available on this date. Please select another date.
                    </div>
                  ) : (
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 max-h-60 overflow-y-auto p-1">
                      {availableSlots.map((slot) => {
                        const isSelected = selectedSlot === slot.startTime;
                        return (
                          <button
                            key={slot.startTime}
                            disabled={!slot.available}
                            onClick={() => setSelectedSlot(slot.startTime)}
                            className={`py-3 px-2 rounded-xl text-xs font-mono font-medium border text-center transition-all ${
                              !slot.available
                                ? 'bg-zinc-100 text-zinc-400 border-zinc-200 cursor-not-allowed line-through'
                                : isSelected
                                ? 'bg-brand text-text-primary font-bold shadow-subtle border-brand ring-2 ring-brand'
                                : 'bg-white border-salon-border text-text-primary hover:border-brand'
                            }`}
                          >
                            {formatTime(slot.startTime)}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                <div className="pt-4 flex items-center justify-between">
                  <Button variant="outline" onClick={() => setStep(2)} leftIcon={<ArrowLeft className="w-4 h-4" />}>
                    Back
                  </Button>
                  <Button
                    variant="primary"
                    disabled={!selectedSlot}
                    onClick={() => setStep(4)}
                    rightIcon={<ArrowRight className="w-4 h-4" />}
                  >
                    Enter Guest Details
                  </Button>
                </div>
              </motion.div>
            )}

            {/* STEP 4: GUEST DETAILS & COUPON */}
            {step === 4 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                <h3 className="font-display text-xl font-bold text-text-primary">
                  Step 4: Your Contact Information
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Full Name *"
                    required
                    placeholder="e.g. Meera Nambiar"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    leftIcon={<User className="w-4 h-4" />}
                  />
                  <Input
                    label="Phone Number *"
                    required
                    placeholder="+91 98765 43210"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    leftIcon={<Phone className="w-4 h-4" />}
                  />
                </div>

                <Input
                  label="Email Address (for appointment confirmation & receipt)"
                  type="email"
                  placeholder="meera@example.com"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  leftIcon={<Mail className="w-4 h-4" />}
                />

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-text-secondary">
                    Special Notes or Preferences
                  </label>
                  <textarea
                    rows={2}
                    placeholder="e.g., scalp sensitivity, warm water preference, beverage choice..."
                    className="w-full rounded-2xl bg-white border border-salon-border px-4 py-2.5 text-xs text-text-primary focus:outline-none focus:ring-2 focus:ring-brand"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>

                {/* Promo Code Input */}
                <div className="p-4 rounded-card bg-surface-bone border border-salon-border space-y-3">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-text-secondary">
                    Have a Promotion or Coupon Code?
                  </label>
                  <div className="flex gap-2">
                    <input
                      placeholder="e.g. FIRSTVISIT15 or HAIRSPA"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      className="flex-1 rounded-full bg-white border border-salon-border px-4 py-2 text-xs font-mono uppercase focus:outline-none focus:ring-2 focus:ring-brand"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleValidatePromo}
                      isLoading={isValidatingPromo}
                    >
                      Apply
                    </Button>
                  </div>
                  {appliedPromo && (
                    <p className="text-xs text-emerald-700 font-medium">
                      ✓ Coupon {appliedPromo.code} applied: Save {formatCurrency(appliedPromo.discountAmount)}!
                    </p>
                  )}
                  {promoError && <p className="text-xs text-rose-500">{promoError}</p>}
                </div>

                <div className="pt-4 flex items-center justify-between">
                  <Button variant="outline" onClick={() => setStep(3)} leftIcon={<ArrowLeft className="w-4 h-4" />}>
                    Back
                  </Button>
                  <Button
                    variant="primary"
                    disabled={!customerName || !customerPhone}
                    onClick={() => setStep(5)}
                    rightIcon={<ArrowRight className="w-4 h-4" />}
                  >
                    Review & Confirm
                  </Button>
                </div>
              </motion.div>
            )}

            {/* STEP 5: REVIEW & CONFIRM */}
            {step === 5 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <h3 className="font-display text-xl font-bold text-text-primary">
                  Step 5: Review & Finalize Booking
                </h3>

                <Card variant="white" className="p-6 space-y-4 border border-salon-border">
                  <div className="flex items-center justify-between pb-3 border-b border-salon-border">
                    <span className="text-xs text-text-muted uppercase font-mono">Service Details</span>
                    <Badge variant="muted" size="sm">{selectedService?.category}</Badge>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="font-bold text-text-primary">{selectedService?.name}</span>
                    <span className="font-mono text-text-muted">{selectedService?.durationMinutes} mins</span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-text-secondary">
                    <span>Stylist:</span>
                    <strong className="text-text-primary">
                      {selectedStylistId === 'any' ? 'Any Available Stylist' : selectedStylistObj?.name}
                    </strong>
                  </div>

                  <div className="flex items-center justify-between text-xs text-text-secondary">
                    <span>Date & Slot:</span>
                    <strong className="text-text-primary">
                      {formatDate(selectedDate)} at {formatTime(selectedSlot)}
                    </strong>
                  </div>

                  <div className="flex items-center justify-between text-xs text-text-secondary">
                    <span>Guest:</span>
                    <strong className="text-text-primary">
                      {customerName} ({customerPhone})
                    </strong>
                  </div>

                  {notes && (
                    <div className="text-xs text-text-muted bg-surface-bone p-3 rounded-lg">
                      Note: "{notes}"
                    </div>
                  )}

                  {/* Pricing Breakdown */}
                  <div className="pt-4 border-t border-salon-border space-y-2 text-xs">
                    <div className="flex items-center justify-between text-text-secondary">
                      <span>Service Subtotal:</span>
                      <span>{formatCurrency(selectedService?.price || 0)}</span>
                    </div>

                    {appliedPromo && (
                      <div className="flex items-center justify-between text-emerald-700 font-medium">
                        <span>Coupon Discount ({appliedPromo.code}):</span>
                        <span>-{formatCurrency(appliedPromo.discountAmount)}</span>
                      </div>
                    )}

                    <div className="flex items-center justify-between text-text-muted text-[11px]">
                      <span>GST (18% inclusive):</span>
                      <span>Included</span>
                    </div>

                    <div className="pt-2 border-t border-salon-border flex items-center justify-between text-base font-bold text-text-primary">
                      <span>Total Due at Studio:</span>
                      <span className="font-display text-2xl text-text-primary">
                        {formatCurrency(
                          appliedPromo ? appliedPromo.finalAmount : selectedService?.price || 0
                        )}
                      </span>
                    </div>
                  </div>
                </Card>

                {errorMsg && (
                  <p className="text-xs text-rose-500 bg-rose-50 p-3 rounded-lg border border-rose-200">
                    {errorMsg}
                  </p>
                )}

                <div className="pt-4 flex items-center justify-between">
                  <Button variant="outline" onClick={() => setStep(4)} leftIcon={<ArrowLeft className="w-4 h-4" />}>
                    Back
                  </Button>
                  <Button
                    variant="primary"
                    size="lg"
                    isLoading={submitting}
                    onClick={handleConfirmBooking}
                    rightIcon={<CheckCircle className="w-5 h-5" />}
                  >
                    Confirm Appointment
                  </Button>
                </div>
              </motion.div>
            )}
          </div>

          {/* Right Summary Sidebar Card */}
          <div className="lg:col-span-4">
            <Card variant="bone" className="p-6 sticky top-28 space-y-4">
              <h4 className="font-display text-base font-bold text-text-primary pb-3 border-b border-salon-border flex items-center gap-2">
                <Receipt className="w-4 h-4 text-brand-deep" />
                <span>Booking Summary</span>
              </h4>

              {selectedService ? (
                <div className="space-y-3 text-xs">
                  <div>
                    <span className="text-[10px] text-text-muted uppercase font-mono block">Selected Service</span>
                    <p className="font-bold text-text-primary text-sm">{selectedService.name}</p>
                    <p className="text-text-muted">{selectedService.durationMinutes} mins • {formatCurrency(selectedService.price)}</p>
                  </div>

                  <div>
                    <span className="text-[10px] text-text-muted uppercase font-mono block">Stylist</span>
                    <p className="font-bold text-text-primary">
                      {selectedStylistId === 'any' ? 'Any Available Stylist' : selectedStylistObj?.name}
                    </p>
                  </div>

                  {selectedDate && (
                    <div>
                      <span className="text-[10px] text-text-muted uppercase font-mono block">Scheduled Date</span>
                      <p className="font-bold text-text-primary">{formatDate(selectedDate)}</p>
                    </div>
                  )}

                  {selectedSlot && (
                    <div>
                      <span className="text-[10px] text-text-muted uppercase font-mono block">Time Slot</span>
                      <p className="font-bold text-brand-deep font-mono">{formatTime(selectedSlot)}</p>
                    </div>
                  )}

                  <div className="pt-3 border-t border-salon-border flex items-center justify-between">
                    <span className="font-bold text-text-primary">Payable Amount:</span>
                    <span className="font-display text-lg font-bold text-text-primary">
                      {formatCurrency(appliedPromo ? appliedPromo.finalAmount : selectedService.price)}
                    </span>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-text-muted py-4 text-center">
                  Select a service to start viewing your booking summary.
                </p>
              )}

              <div className="pt-4 border-t border-salon-border text-[11px] text-text-muted flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-brand-deep shrink-0 mt-0.5" />
                <span>Free cancellation up to 4 hours prior. Pay at salon via Cash, UPI, or Card.</span>
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};
