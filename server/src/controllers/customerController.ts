import { Request, Response } from 'express';
import { Customer } from '../models/Customer';
import { Appointment } from '../models/Appointment';
import { Payment } from '../models/Payment';
import { LoyaltyTransaction } from '../models/LoyaltyTransaction';

export const getCustomers = async (req: Request, res: Response): Promise<void> => {
  try {
    const { search, tier, sort = '-createdAt', page = '1', limit = '50' } = req.query;

    const query: any = {};
    if (search) {
      query.$or = [
        { name: { $regex: search as string, $options: 'i' } },
        { phone: { $regex: search as string, $options: 'i' } },
        { email: { $regex: search as string, $options: 'i' } },
      ];
    }

    if (tier && tier !== 'ALL') {
      query.tier = tier;
    }

    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);
    const skip = (pageNum - 1) * limitNum;

    const total = await Customer.countDocuments(query);
    const customers = await Customer.find(query)
      .populate('preferredStylist', 'name specialization rating')
      .sort(sort as string)
      .skip(skip)
      .limit(limitNum);

    res.json({
      success: true,
      data: customers,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getCustomerById = async (req: Request, res: Response): Promise<void> => {
  try {
    const customer = await Customer.findById(req.params.id).populate('preferredStylist', 'name specialization rating image');
    if (!customer) {
      res.status(404).json({ success: false, message: 'Customer not found.' });
      return;
    }

    const appointments = await Appointment.find({ customer: customer._id })
      .sort('-appointmentDate')
      .limit(15);

    const payments = await Payment.find({ customer: customer._id })
      .sort('-date')
      .limit(15);

    const loyaltyHistory = await LoyaltyTransaction.find({ customer: customer._id })
      .sort('-date')
      .limit(15);

    res.json({
      success: true,
      data: customer,
      appointments,
      payments,
      loyaltyHistory,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createCustomer = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, phone, email, dateOfBirth, address, gender, notes, preferredStylist } = req.body;

    if (!name || !phone || !email) {
      res.status(400).json({ success: false, message: 'Name, phone and email are required.' });
      return;
    }

    const existing = await Customer.findOne({ $or: [{ phone }, { email: email.toLowerCase() }] });
    if (existing) {
      res.status(400).json({ success: false, message: 'A customer with this phone or email already exists.' });
      return;
    }

    const customer = await Customer.create({
      name,
      phone,
      email: email.toLowerCase(),
      dateOfBirth,
      address,
      gender,
      notes,
      preferredStylist: preferredStylist || undefined,
    });

    res.status(201).json({ success: true, data: customer, message: 'Customer profile created.' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateCustomer = async (req: Request, res: Response): Promise<void> => {
  try {
    const customer = await Customer.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!customer) {
      res.status(404).json({ success: false, message: 'Customer not found.' });
      return;
    }
    res.json({ success: true, data: customer, message: 'Customer profile updated.' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteCustomer = async (req: Request, res: Response): Promise<void> => {
  try {
    const customer = await Customer.findByIdAndDelete(req.params.id);
    if (!customer) {
      res.status(404).json({ success: false, message: 'Customer not found.' });
      return;
    }
    res.json({ success: true, message: 'Customer removed successfully.' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getCustomerAppointments = async (req: Request, res: Response): Promise<void> => {
  try {
    const appointments = await Appointment.find({ customer: req.params.id })
      .populate('stylist', 'name image specialization')
      .populate('service', 'name price durationMinutes category')
      .sort('-appointmentDate');
    res.json({ success: true, data: appointments });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getCustomerPayments = async (req: Request, res: Response): Promise<void> => {
  try {
    const payments = await Payment.find({ customer: req.params.id }).sort('-date');
    res.json({ success: true, data: payments });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getCustomerLoyalty = async (req: Request, res: Response): Promise<void> => {
  try {
    const loyalty = await LoyaltyTransaction.find({ customer: req.params.id }).sort('-date');
    const customer = await Customer.findById(req.params.id).select('loyaltyPoints tier');
    res.json({
      success: true,
      currentPoints: customer?.loyaltyPoints || 0,
      tier: customer?.tier || 'BRONZE',
      data: loyalty,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
