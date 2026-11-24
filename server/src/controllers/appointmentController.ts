import { Request, Response } from 'express';
import { AuthenticatedRequest } from '../types';
import { Appointment } from '../models/Appointment';
import { Customer } from '../models/Customer';
import { Staff } from '../models/Staff';
import { Service } from '../models/Service';
import { Promotion } from '../models/Promotion';
import { Notification } from '../models/Notification';
import { LoyaltyTransaction } from '../models/LoyaltyTransaction';
import { SalonSettings } from '../models/SalonSettings';
import { AvailabilityService, minutesToTime, timeToMinutes } from '../services/availabilityService';

export const getAppointments = async (req: Request, res: Response): Promise<void> => {
  try {
    const authReq = req as AuthenticatedRequest;
    const { date, startDate, endDate, stylistId, customerId, status, search } = req.query;

    const query: any = {};

    // Role-based scoping: Customers can only access their own appointments, Stylists their own schedule
    if (authReq.user && authReq.user.role === 'CUSTOMER') {
      const cust = await Customer.findOne({
        $or: [{ userId: authReq.user.userId }, { email: authReq.user.email.toLowerCase() }],
      });
      if (cust) {
        query.$or = [{ customer: cust._id }, { customerEmail: authReq.user.email.toLowerCase() }];
      } else {
        query.customerEmail = authReq.user.email.toLowerCase();
      }
    } else if (authReq.user && authReq.user.role === 'STYLIST') {
      const staffMember = await Staff.findOne({ email: authReq.user.email.toLowerCase() });
      if (staffMember) {
        query.stylist = staffMember._id;
      }
    } else {
      if (stylistId && stylistId !== 'ALL') {
        query.stylist = stylistId;
      }
      if (customerId) {
        query.customer = customerId;
      }
    }

    if (date) {
      query.appointmentDate = date;
    } else if (startDate && endDate) {
      query.appointmentDate = { $gte: startDate, $lte: endDate };
    }

    if (status && status !== 'ALL') {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { customerName: { $regex: search as string, $options: 'i' } },
        { customerPhone: { $regex: search as string, $options: 'i' } },
        { appointmentId: { $regex: search as string, $options: 'i' } },
        { serviceName: { $regex: search as string, $options: 'i' } },
      ];
    }

    const appointments = await Appointment.find(query)
      .populate('stylist', 'name image specialization rating phone')
      .populate('service', 'name category price durationMinutes')
      .populate('customer', 'name phone email loyaltyPoints tier')
      .sort('-appointmentDate startTime');

    res.json({ success: true, count: appointments.length, data: appointments });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAppointmentById = async (req: Request, res: Response): Promise<void> => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('stylist')
      .populate('service')
      .populate('customer');

    if (!appointment) {
      res.status(404).json({ success: false, message: 'Appointment not found.' });
      return;
    }

    res.json({ success: true, data: appointment });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createAppointment = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      serviceId,
      stylistId,
      date,
      startTime,
      customerName,
      customerPhone,
      customerEmail,
      notes,
      couponCode,
      bookingSource = 'ONLINE_WIZARD',
    } = req.body;

    if (!serviceId || !date || !startTime || !customerName || !customerPhone) {
      res.status(400).json({
        success: false,
        message: 'Service, date, start time, customer name, and customer phone are required.',
      });
      return;
    }

    // 1. Fetch Service
    const service = await Service.findById(serviceId);
    if (!service || !service.active) {
      res.status(400).json({ success: false, message: 'Selected service is unavailable.' });
      return;
    }

    // 2. Determine Stylist
    let chosenStylist: any = null;
    if (stylistId && stylistId !== 'any') {
      chosenStylist = await Staff.findById(stylistId);
      if (!chosenStylist || !chosenStylist.active || chosenStylist.leaveStatus) {
        res.status(400).json({ success: false, message: 'Selected stylist is unavailable.' });
        return;
      }
    } else {
      // Find an available stylist for this slot
      const dateObj = new Date(date + 'T00:00:00Z');
      const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      const dayName = days[dateObj.getUTCDay()];

      const availableStylists = await Staff.find({
        role: 'STYLIST',
        active: true,
        leaveStatus: false,
        workingDays: dayName,
      });

      const slotDuration = service.durationMinutes;
      const startMinutes = timeToMinutes(startTime);
      const endMinutes = startMinutes + slotDuration;
      const endTimeStr = minutesToTime(endMinutes);

      for (const stf of availableStylists) {
        const conflict = await AvailabilityService.hasConflict(stf._id.toString(), date, startTime, endTimeStr);
        if (!conflict) {
          chosenStylist = stf;
          break;
        }
      }

      if (!chosenStylist) {
        res.status(400).json({
          success: false,
          message: 'No stylists are available at this chosen date and time. Please pick another slot.',
        });
        return;
      }
    }

    // 3. Calculate End Time
    const startMinutes = timeToMinutes(startTime);
    const endMinutes = startMinutes + service.durationMinutes;
    const endTime = minutesToTime(endMinutes);

    // 4. Validate stylist conflict
    const conflict = await AvailabilityService.hasConflict(chosenStylist._id.toString(), date, startTime, endTime);
    if (conflict) {
      res.status(400).json({
        success: false,
        message: `Stylist ${chosenStylist.name} already has a booking during ${startTime} - ${endTime}. Please select another slot.`,
      });
      return;
    }

    // 5. Find or Create Customer
    let customer = await Customer.findOne({ phone: customerPhone });
    if (!customer) {
      customer = await Customer.create({
        name: customerName,
        phone: customerPhone,
        email: customerEmail ? customerEmail.toLowerCase() : `${customerPhone}@salonflow.demo`,
        preferredStylist: chosenStylist._id,
      });
    } else {
      if (customerEmail && !customer.email) {
        customer.email = customerEmail.toLowerCase();
        await customer.save();
      }
    }

    // 6. Handle Coupon Discount
    let discount = 0;
    let appliedCoupon = '';
    if (couponCode) {
      const promo = await Promotion.findOne({ code: couponCode.toUpperCase(), active: true });
      if (promo) {
        const todayStr = new Date().toISOString().split('T')[0];
        if (todayStr >= promo.startDate && todayStr <= promo.endDate) {
          if (service.price >= promo.minPurchase) {
            if (promo.discountType === 'PERCENTAGE') {
              discount = (service.price * promo.discountValue) / 100;
              if (promo.maxDiscount && discount > promo.maxDiscount) {
                discount = promo.maxDiscount;
              }
            } else {
              discount = Math.min(promo.discountValue, service.price);
            }
            appliedCoupon = promo.code;
            promo.usedCount = (promo.usedCount || 0) + 1;
            await promo.save();
          }
        }
      }
    }

    const finalPrice = Math.max(0, service.price - discount);

    // 7. Generate Appointment ID (SF-YYYYMMDD-XXXX)
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const dateTag = date.replace(/-/g, '');
    const appointmentId = `SF-${dateTag}-${randomSuffix}`;

    const appointment = await Appointment.create({
      appointmentId,
      customer: customer._id,
      customerName,
      customerPhone,
      customerEmail: customer.email,
      service: service._id,
      serviceName: service.name,
      stylist: chosenStylist._id,
      stylistName: chosenStylist.name,
      appointmentDate: date,
      startTime,
      endTime,
      durationMinutes: service.durationMinutes,
      price: service.price,
      discount,
      finalPrice,
      couponCode: appliedCoupon || undefined,
      status: 'CONFIRMED',
      paymentStatus: 'PENDING',
      notes,
      bookingSource,
    });

    // 8. Create internal notification
    await Notification.create({
      type: 'APPOINTMENT_BOOKED',
      title: 'New Appointment Booked',
      message: `${customerName} booked ${service.name} with ${chosenStylist.name} on ${date} at ${startTime}.`,
      link: `/admin/appointments`,
      metadata: { appointmentId: appointment._id },
    });

    res.status(201).json({
      success: true,
      data: appointment,
      message: 'Appointment successfully confirmed!',
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateAppointment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { stylistId, date, startTime, notes, serviceId } = req.body;
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      res.status(404).json({ success: false, message: 'Appointment not found.' });
      return;
    }

    let updatedStylist = appointment.stylist;
    let updatedStylistName = appointment.stylistName;
    let updatedDate = date || appointment.appointmentDate;
    let updatedStartTime = startTime || appointment.startTime;
    let duration = appointment.durationMinutes;

    if (serviceId && serviceId !== appointment.service.toString()) {
      const srv = await Service.findById(serviceId);
      if (srv) {
        appointment.service = srv._id as any;
        appointment.serviceName = srv.name;
        duration = srv.durationMinutes;
        appointment.durationMinutes = duration;
        appointment.price = srv.price;
        appointment.finalPrice = Math.max(0, srv.price - (appointment.discount || 0));
      }
    }

    if (stylistId && stylistId !== appointment.stylist.toString()) {
      const stf = await Staff.findById(stylistId);
      if (stf) {
        updatedStylist = stf._id as any;
        updatedStylistName = stf.name;
      }
    }

    const startMinutes = timeToMinutes(updatedStartTime);
    const endMinutes = startMinutes + duration;
    const updatedEndTime = minutesToTime(endMinutes);

    // Conflict check excluding current appointment
    const conflict = await AvailabilityService.hasConflict(
      updatedStylist.toString(),
      updatedDate,
      updatedStartTime,
      updatedEndTime,
      appointment._id.toString()
    );

    if (conflict) {
      res.status(400).json({
        success: false,
        message: 'Stylist has a conflicting appointment at this time slot.',
      });
      return;
    }

    appointment.stylist = updatedStylist;
    appointment.stylistName = updatedStylistName;
    appointment.appointmentDate = updatedDate;
    appointment.startTime = updatedStartTime;
    appointment.endTime = updatedEndTime;
    if (notes !== undefined) appointment.notes = notes;

    await appointment.save();

    res.json({ success: true, data: appointment, message: 'Appointment updated successfully.' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateAppointmentStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { status, paymentStatus } = req.body;
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      res.status(404).json({ success: false, message: 'Appointment not found.' });
      return;
    }

    const oldStatus = appointment.status;
    if (status) appointment.status = status;
    if (paymentStatus) appointment.paymentStatus = paymentStatus;

    // When transitioning to COMPLETED, credit loyalty and customer stats
    if (status === 'COMPLETED' && oldStatus !== 'COMPLETED') {
      const customer = await Customer.findById(appointment.customer);
      if (customer) {
        customer.totalVisits = (customer.totalVisits || 0) + 1;
        customer.totalSpending = (customer.totalSpending || 0) + appointment.finalPrice;
        customer.lastVisitDate = new Date();

        // Calculate loyalty points
        const settings = (await SalonSettings.findOne()) || { loyaltyEarnRate: 100 };
        const earnRate = settings.loyaltyEarnRate || 100;
        const pointsEarned = Math.floor(appointment.finalPrice / earnRate);

        if (pointsEarned > 0) {
          customer.loyaltyPoints = (customer.loyaltyPoints || 0) + pointsEarned;
          await LoyaltyTransaction.create({
            customer: customer._id,
            type: 'EARNED',
            points: pointsEarned,
            reason: `Service completed: ${appointment.serviceName} (${appointment.appointmentId})`,
            balanceAfter: customer.loyaltyPoints,
            appointment: appointment._id,
          });
        }

        // Tier update
        if (customer.totalSpending >= 30000) customer.tier = 'PLATINUM';
        else if (customer.totalSpending >= 15000) customer.tier = 'GOLD';
        else if (customer.totalSpending >= 5000) customer.tier = 'SILVER';
        else customer.tier = 'BRONZE';

        await customer.save();
      }

      // Notification
      await Notification.create({
        type: 'APPOINTMENT_CONFIRMED',
        title: 'Service Completed',
        message: `Appointment ${appointment.appointmentId} for ${appointment.customerName} completed by ${appointment.stylistName}.`,
        link: `/admin/appointments`,
      });
    }

    await appointment.save();

    res.json({
      success: true,
      data: appointment,
      message: `Appointment status updated to ${status}.`,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteAppointment = async (req: Request, res: Response): Promise<void> => {
  try {
    const appointment = await Appointment.findByIdAndDelete(req.params.id);
    if (!appointment) {
      res.status(404).json({ success: false, message: 'Appointment not found.' });
      return;
    }
    res.json({ success: true, message: 'Appointment cancelled and removed.' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAvailability = async (req: Request, res: Response): Promise<void> => {
  try {
    const { stylistId, date, duration } = req.query;

    if (!date) {
      res.status(400).json({ success: false, message: 'Date is required (YYYY-MM-DD).' });
      return;
    }

    const durationMinutes = duration ? parseInt(duration as string, 10) : 45;

    const result = await AvailabilityService.getAvailableSlots({
      stylistId: stylistId as string | undefined,
      date: date as string,
      durationMinutes,
    });

    res.json({ success: true, ...result });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
