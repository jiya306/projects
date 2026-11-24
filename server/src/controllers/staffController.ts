import { Request, Response } from 'express';
import { Staff } from '../models/Staff';
import { Appointment } from '../models/Appointment';
import { User } from '../models/User';

export const getStaff = async (req: Request, res: Response): Promise<void> => {
  try {
    const { active, role, specialization, search } = req.query;

    const query: any = {};
    if (active !== undefined) {
      query.active = active === 'true';
    }
    if (role) {
      query.role = role;
    }
    if (specialization) {
      query.specialization = { $in: [specialization] };
    }
    if (search) {
      query.$or = [
        { name: { $regex: search as string, $options: 'i' } },
        { email: { $regex: search as string, $options: 'i' } },
        { phone: { $regex: search as string, $options: 'i' } },
      ];
    }

    const staffList = await Staff.find(query).sort('employeeId');
    res.json({ success: true, data: staffList });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getStaffById = async (req: Request, res: Response): Promise<void> => {
  try {
    const staff = await Staff.findById(req.params.id);
    if (!staff) {
      res.status(404).json({ success: false, message: 'Staff member not found.' });
      return;
    }
    res.json({ success: true, data: staff });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createStaff = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      name,
      email,
      phone,
      role = 'STYLIST',
      specialization = [],
      experienceYears = 2,
      salary = 30000,
      commissionPercentage = 10,
      workingDays,
      workingHours,
      image,
      bio,
    } = req.body;

    const existing = await Staff.findOne({ email: email.toLowerCase() });
    if (existing) {
      res.status(400).json({ success: false, message: 'Staff with this email already exists.' });
      return;
    }

    // Auto-generate employee ID
    const count = await Staff.countDocuments();
    const employeeId = `SF-STF-${(count + 1).toString().padStart(3, '0')}`;

    // Ensure User record exists
    let user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      user = await User.create({
        name,
        email: email.toLowerCase(),
        password: 'Password@123',
        phone,
        role: role as any,
        avatar: image,
      });
    }

    const staff = await Staff.create({
      userId: user._id,
      employeeId,
      name,
      email: email.toLowerCase(),
      phone,
      role,
      specialization: Array.isArray(specialization) ? specialization : [specialization],
      experienceYears,
      salary,
      commissionPercentage,
      workingDays: workingDays || ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      workingHours: workingHours || { start: '10:00', end: '20:00' },
      image,
      bio,
    });

    res.status(201).json({ success: true, data: staff, message: 'Staff member added successfully.' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateStaff = async (req: Request, res: Response): Promise<void> => {
  try {
    const staff = await Staff.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!staff) {
      res.status(404).json({ success: false, message: 'Staff member not found.' });
      return;
    }
    res.json({ success: true, data: staff, message: 'Staff profile updated.' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteStaff = async (req: Request, res: Response): Promise<void> => {
  try {
    const staff = await Staff.findByIdAndDelete(req.params.id);
    if (!staff) {
      res.status(404).json({ success: false, message: 'Staff member not found.' });
      return;
    }
    res.json({ success: true, message: 'Staff member deleted.' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getStaffAppointments = async (req: Request, res: Response): Promise<void> => {
  try {
    const { date, status } = req.query;
    const query: any = { stylist: req.params.id };

    if (date) query.appointmentDate = date;
    if (status) query.status = status;

    const appointments = await Appointment.find(query).sort('-appointmentDate startTime');
    res.json({ success: true, data: appointments });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getStaffPerformance = async (req: Request, res: Response): Promise<void> => {
  try {
    const staffId = req.params.id;
    const staff = await Staff.findById(staffId);
    if (!staff) {
      res.status(404).json({ success: false, message: 'Staff not found.' });
      return;
    }

    const appointments = await Appointment.find({ stylist: staffId });
    const completedAppointments = appointments.filter((a) => a.status === 'COMPLETED');

    const totalRevenueGenerated = completedAppointments.reduce((sum, a) => sum + (a.finalPrice || 0), 0);
    const estimatedCommission = (totalRevenueGenerated * (staff.commissionPercentage || 10)) / 100;

    res.json({
      success: true,
      data: {
        staffId: staff._id,
        name: staff.name,
        role: staff.role,
        rating: staff.rating,
        reviewCount: staff.reviewCount,
        totalAppointments: appointments.length,
        completedAppointments: completedAppointments.length,
        cancelledAppointments: appointments.filter((a) => a.status === 'CANCELLED').length,
        totalRevenueGenerated,
        estimatedCommission,
        commissionPercentage: staff.commissionPercentage,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
