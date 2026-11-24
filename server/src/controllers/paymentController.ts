import { Request, Response } from 'express';
import { Payment } from '../models/Payment';
import { Invoice } from '../models/Invoice';
import { Appointment } from '../models/Appointment';
import { Customer } from '../models/Customer';
import { Notification } from '../models/Notification';

export const getPayments = async (req: Request, res: Response): Promise<void> => {
  try {
    const { status, method, search } = req.query;
    const query: any = {};

    if (status && status !== 'ALL') query.status = status;
    if (method && method !== 'ALL') query.method = method;
    if (search) {
      query.$or = [
        { customerName: { $regex: search as string, $options: 'i' } },
        { paymentId: { $regex: search as string, $options: 'i' } },
        { transactionRef: { $regex: search as string, $options: 'i' } },
      ];
    }

    const payments = await Payment.find(query)
      .populate('appointment')
      .populate('invoice')
      .sort('-date');

    res.json({ success: true, count: payments.length, data: payments });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getPaymentById = async (req: Request, res: Response): Promise<void> => {
  try {
    const payment = await Payment.findById(req.params.id)
      .populate('appointment')
      .populate('customer')
      .populate('invoice');

    if (!payment) {
      res.status(404).json({ success: false, message: 'Payment record not found.' });
      return;
    }
    res.json({ success: true, data: payment });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createPayment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { appointmentId, customerId, amount, method, status = 'PAID', transactionRef, notes } = req.body;

    if (!customerId || !amount || !method) {
      res.status(400).json({ success: false, message: 'Customer, amount, and payment method are required.' });
      return;
    }

    const customer = await Customer.findById(customerId);
    if (!customer) {
      res.status(404).json({ success: false, message: 'Customer not found.' });
      return;
    }

    let appointment: any = null;
    if (appointmentId) {
      appointment = await Appointment.findById(appointmentId);
    }

    const count = await Payment.countDocuments();
    const paymentId = `PAY-${new Date().getFullYear()}-${(count + 1).toString().padStart(4, '0')}`;

    // Create Invoice if appointment exists
    const invCount = await Invoice.countDocuments();
    const invoiceNumber = `INV-${new Date().getFullYear()}-${(invCount + 1).toString().padStart(4, '0')}`;

    const items = appointment
      ? [
          {
            name: appointment.serviceName,
            quantity: 1,
            unitPrice: appointment.price,
            totalPrice: appointment.price,
          },
        ]
      : [
          {
            name: 'Salon Service / Product',
            quantity: 1,
            unitPrice: Number(amount),
            totalPrice: Number(amount),
          },
        ];

    const invoice = await Invoice.create({
      invoiceNumber,
      customer: customer._id,
      customerName: customer.name,
      customerPhone: customer.phone,
      appointment: appointment?._id,
      items,
      subtotal: Number(amount),
      discount: appointment?.discount || 0,
      tax: Math.round(Number(amount) * 0.18),
      finalAmount: Number(amount),
      paymentMethod: method,
      paymentStatus: status,
      paidDate: status === 'PAID' ? new Date() : undefined,
      notes,
    });

    const payment = await Payment.create({
      paymentId,
      appointment: appointment?._id,
      customer: customer._id,
      customerName: customer.name,
      invoice: invoice._id,
      amount: Number(amount),
      method,
      status,
      transactionRef: transactionRef || `TXN-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      notes,
    });

    // Update appointment paymentStatus
    if (appointment) {
      appointment.paymentStatus = status;
      await appointment.save();
    }

    // Notification
    await Notification.create({
      type: 'PAYMENT_COMPLETED',
      title: 'Payment Received',
      message: `Received ₹${amount} via ${method} from ${customer.name} (${paymentId}).`,
      link: '/admin/billing',
    });

    res.status(201).json({
      success: true,
      data: payment,
      invoice,
      message: 'Payment recorded and invoice generated.',
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getInvoices = async (req: Request, res: Response): Promise<void> => {
  try {
    const { status, search } = req.query;
    const query: any = {};

    if (status && status !== 'ALL') query.paymentStatus = status;
    if (search) {
      query.$or = [
        { customerName: { $regex: search as string, $options: 'i' } },
        { invoiceNumber: { $regex: search as string, $options: 'i' } },
      ];
    }

    const invoices = await Invoice.find(query).populate('appointment').sort('-issuedDate');
    res.json({ success: true, count: invoices.length, data: invoices });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getInvoiceById = async (req: Request, res: Response): Promise<void> => {
  try {
    const invoice = await Invoice.findById(req.params.id)
      .populate('customer')
      .populate('appointment');

    if (!invoice) {
      res.status(404).json({ success: false, message: 'Invoice not found.' });
      return;
    }
    res.json({ success: true, data: invoice });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
