import { Request, Response } from 'express';
import { SalonSettings } from '../models/SalonSettings';

export const getSettings = async (req: Request, res: Response): Promise<void> => {
  try {
    let settings = await SalonSettings.findOne();
    if (!settings) {
      settings = await SalonSettings.create({});
    }
    res.json({ success: true, data: settings });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateSettings = async (req: Request, res: Response): Promise<void> => {
  try {
    let settings = await SalonSettings.findOne();
    if (!settings) {
      settings = await SalonSettings.create(req.body);
    } else {
      settings = await SalonSettings.findByIdAndUpdate(settings._id, req.body, { new: true });
    }
    res.json({ success: true, data: settings, message: 'Settings saved successfully.' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
