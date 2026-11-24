import { Request, Response } from 'express';
import { User } from '../models/User';
import { Customer } from '../models/Customer';
import { Staff } from '../models/Staff';
import { generateToken } from '../config/jwt';
import { AuthenticatedRequest } from '../types';

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, phone, role } = req.body;

    if (!name || !email || !password || !phone) {
      res.status(400).json({ success: false, message: 'Please provide all required fields.' });
      return;
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      res.status(400).json({ success: false, message: 'An account with this email already exists.' });
      return;
    }

    // Public self-registration is strictly restricted to CUSTOMER role.
    // Staff & admin accounts must be provisioned internally by an administrator.
    const assignedRole = 'CUSTOMER';

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      phone,
      role: assignedRole,
    });

    // If customer, auto-create customer record
    if (assignedRole === 'CUSTOMER') {
      const existingCustomer = await Customer.findOne({ email: email.toLowerCase() });
      if (!existingCustomer) {
        await Customer.create({
          userId: user._id,
          name,
          email: email.toLowerCase(),
          phone,
        });
      } else {
        existingCustomer.userId = user._id;
        await existingCustomer.save();
      }
    }

    const token = generateToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
      name: user.name,
    });

    res.status(201).json({
      success: true,
      message: 'Account registered successfully.',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        avatar: user.avatar,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ success: false, message: 'Please provide email and password.' });
      return;
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user || !user.active) {
      res.status(401).json({ success: false, message: 'Invalid email or password.' });
      return;
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      res.status(401).json({ success: false, message: 'Invalid email or password.' });
      return;
    }

    const token = generateToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
      name: user.name,
    });

    let extraData: any = {};
    if (user.role === 'STYLIST') {
      const staffDoc = await Staff.findOne({ email: user.email });
      if (staffDoc) {
        extraData.staffId = staffDoc._id;
        extraData.specialization = staffDoc.specialization;
      }
    } else if (user.role === 'CUSTOMER') {
      const custDoc = await Customer.findOne({ email: user.email });
      if (custDoc) {
        extraData.customerId = custDoc._id;
        extraData.loyaltyPoints = custDoc.loyaltyPoints;
        extraData.tier = custDoc.tier;
      }
    }

    res.json({
      success: true,
      message: 'Logged in successfully.',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        avatar: user.avatar,
        ...extraData,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getMe = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authenticated.' });
      return;
    }

    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found.' });
      return;
    }

    let extraData: any = {};
    if (user.role === 'STYLIST') {
      const staffDoc = await Staff.findOne({ email: user.email });
      if (staffDoc) {
        extraData.staffId = staffDoc._id;
        extraData.specialization = staffDoc.specialization;
      }
    } else if (user.role === 'CUSTOMER') {
      const custDoc = await Customer.findOne({ email: user.email });
      if (custDoc) {
        extraData.customerId = custDoc._id;
        extraData.loyaltyPoints = custDoc.loyaltyPoints;
        extraData.tier = custDoc.tier;
      }
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        avatar: user.avatar,
        ...extraData,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const logout = async (req: Request, res: Response): Promise<void> => {
  res.json({ success: true, message: 'Logged out successfully.' });
};

export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
  const { email } = req.body;
  if (!email) {
    res.status(400).json({ success: false, message: 'Please provide an email address.' });
    return;
  }
  // In demo mode, acknowledge request and simulate reset code dispatch
  res.json({
    success: true,
    message: `Password reset instructions have been dispatched to ${email}. Check your inbox.`,
  });
};
