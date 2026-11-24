import { Request, Response } from 'express';
import { Appointment } from '../models/Appointment';
import { Customer } from '../models/Customer';
import { Staff } from '../models/Staff';
import { Payment } from '../models/Payment';
import { Product } from '../models/Product';
import { Service } from '../models/Service';

export const getDashboardSummary = async (req: Request, res: Response): Promise<void> => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const currentYear = new Date().getFullYear();
    const currentMonth = (new Date().getMonth() + 1).toString().padStart(2, '0');
    const monthPrefix = `${currentYear}-${currentMonth}`;

    // 1. Appointments counts
    const todayAppointments = await Appointment.find({ appointmentDate: today });
    const pendingAppointments = await Appointment.countDocuments({ status: 'PENDING' });
    const completedAppointments = await Appointment.countDocuments({ status: 'COMPLETED' });
    const cancelledAppointments = await Appointment.countDocuments({ status: 'CANCELLED' });

    // 2. Customers
    const totalCustomers = await Customer.countDocuments();

    // 3. Revenue
    // Today's revenue from payments
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const todayPayments = await Payment.find({
      date: { $gte: todayStart, $lte: todayEnd },
      status: 'PAID',
    });
    const todayRevenue = todayPayments.reduce((sum, p) => sum + (p.amount || 0), 0);

    // Monthly revenue
    const monthStart = new Date(currentYear, new Date().getMonth(), 1);
    const monthlyPayments = await Payment.find({
      date: { $gte: monthStart },
      status: 'PAID',
    });
    const monthlyRevenue = monthlyPayments.reduce((sum, p) => sum + (p.amount || 0), 0);

    // 4. Active Staff
    const activeStaff = await Staff.countDocuments({ active: true, role: 'STYLIST' });

    // 5. Recent and upcoming appointments
    const recentAppointments = await Appointment.find()
      .populate('stylist', 'name')
      .populate('service', 'name')
      .sort('-createdAt')
      .limit(6);

    const upcomingAppointments = await Appointment.find({
      appointmentDate: { $gte: today },
      status: { $in: ['CONFIRMED', 'PENDING'] },
    })
      .populate('stylist', 'name image')
      .populate('service', 'name durationMinutes')
      .sort('appointmentDate startTime')
      .limit(6);

    // 6. Recent customers
    const recentCustomers = await Customer.find().sort('-createdAt').limit(5);

    // 7. Recent payments
    const recentPayments = await Payment.find().sort('-date').limit(5);

    // 8. Low stock products
    const lowStockProducts = await Product.find({
      $expr: { $lte: ['$stockQuantity', '$minStockLevel'] },
    }).limit(6);

    // 9. Revenue trend (past 7 days)
    const revenueTrend: { date: string; amount: number; appointments: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];

      const dayAppts = await Appointment.find({
        appointmentDate: dateStr,
        status: { $nin: ['CANCELLED'] },
      });
      const dayRev = dayAppts.reduce((sum, a) => sum + (a.finalPrice || 0), 0);

      revenueTrend.push({
        date: dateStr.slice(5), // MM-DD
        amount: dayRev,
        appointments: dayAppts.length,
      });
    }

    // 10. Status breakdown
    const statusCounts = await Appointment.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    res.json({
      success: true,
      data: {
        kpi: {
          todayAppointmentsCount: todayAppointments.length,
          totalCustomers,
          todayRevenue,
          monthlyRevenue,
          activeStaff,
          pendingAppointments,
          completedAppointments,
          cancelledAppointments,
        },
        revenueTrend,
        statusCounts,
        recentAppointments,
        upcomingAppointments,
        recentCustomers,
        recentPayments,
        lowStockProducts,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getRevenueAnalytics = async (req: Request, res: Response): Promise<void> => {
  try {
    // 30 days daily revenue
    const dailyData: { date: string; revenue: number }[] = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];

      const appts = await Appointment.find({
        appointmentDate: dateStr,
        status: { $in: ['COMPLETED', 'CONFIRMED'] },
      });
      const rev = appts.reduce((sum, a) => sum + (a.finalPrice || 0), 0);

      dailyData.push({
        date: dateStr.slice(5),
        revenue: rev,
      });
    }

    // Payment methods breakdown
    const paymentMethods = await Payment.aggregate([
      { $match: { status: 'PAID' } },
      { $group: { _id: '$method', total: { $sum: '$amount' }, count: { $sum: 1 } } },
    ]);

    // Revenue by service category
    const categoryRevenue = await Appointment.aggregate([
      { $match: { status: { $in: ['COMPLETED', 'CONFIRMED'] } } },
      {
        $lookup: {
          from: 'services',
          localField: 'service',
          foreignField: '_id',
          as: 'serviceDetails',
        },
      },
      { $unwind: '$serviceDetails' },
      {
        $group: {
          _id: '$serviceDetails.category',
          total: { $sum: '$finalPrice' },
          count: { $sum: 1 },
        },
      },
    ]);

    res.json({
      success: true,
      data: {
        dailyData,
        paymentMethods,
        categoryRevenue,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAppointmentAnalytics = async (req: Request, res: Response): Promise<void> => {
  try {
    const statusBreakdown = await Appointment.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    const sourceBreakdown = await Appointment.aggregate([
      { $group: { _id: '$bookingSource', count: { $sum: 1 } } },
    ]);

    res.json({
      success: true,
      data: {
        statusBreakdown,
        sourceBreakdown,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getCustomerAnalytics = async (req: Request, res: Response): Promise<void> => {
  try {
    const totalCustomers = await Customer.countDocuments();
    const tierBreakdown = await Customer.aggregate([
      { $group: { _id: '$tier', count: { $sum: 1 } } },
    ]);

    const customers = await Customer.find().select('totalSpending totalVisits');
    const totalSpentAll = customers.reduce((sum, c) => sum + (c.totalSpending || 0), 0);
    const avgSpending = totalCustomers > 0 ? Math.round(totalSpentAll / totalCustomers) : 0;

    const repeatCustomers = customers.filter((c) => (c.totalVisits || 0) > 1).length;
    const retentionRate = totalCustomers > 0 ? Math.round((repeatCustomers / totalCustomers) * 100) : 0;

    res.json({
      success: true,
      data: {
        totalCustomers,
        avgSpending,
        retentionRate,
        repeatCustomers,
        tierBreakdown,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getServiceAnalytics = async (req: Request, res: Response): Promise<void> => {
  try {
    const servicePopularity = await Appointment.aggregate([
      {
        $group: {
          _id: '$serviceName',
          bookings: { $sum: 1 },
          revenue: { $sum: '$finalPrice' },
        },
      },
      { $sort: { bookings: -1 } },
      { $limit: 10 },
    ]);

    res.json({
      success: true,
      data: {
        servicePopularity,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getStaffAnalytics = async (req: Request, res: Response): Promise<void> => {
  try {
    const staffPerformance = await Appointment.aggregate([
      {
        $group: {
          _id: '$stylistName',
          totalAppointments: { $sum: 1 },
          totalRevenue: { $sum: '$finalPrice' },
        },
      },
      { $sort: { totalRevenue: -1 } },
    ]);

    res.json({
      success: true,
      data: {
        staffPerformance,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
