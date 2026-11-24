import { Request, Response } from 'express';
import { Service } from '../models/Service';

export const getServices = async (req: Request, res: Response): Promise<void> => {
  try {
    const { category, popular, active, search } = req.query;

    const query: any = {};
    if (category && category !== 'ALL') {
      query.category = category;
    }
    if (popular !== undefined) {
      query.popular = popular === 'true';
    }
    if (active !== undefined) {
      query.active = active === 'true';
    }
    if (search) {
      query.$or = [
        { name: { $regex: search as string, $options: 'i' } },
        { description: { $regex: search as string, $options: 'i' } },
      ];
    }

    const services = await Service.find(query).sort('category name');
    res.json({ success: true, data: services });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getServiceById = async (req: Request, res: Response): Promise<void> => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      res.status(404).json({ success: false, message: 'Service not found.' });
      return;
    }
    res.json({ success: true, data: service });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createService = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, category, description, price, durationMinutes, image, popular, active } = req.body;

    if (!name || !category || !price) {
      res.status(400).json({ success: false, message: 'Name, category, and price are required.' });
      return;
    }

    const service = await Service.create({
      name,
      category,
      description: description || `${name} premium salon service`,
      price: Number(price),
      durationMinutes: Number(durationMinutes) || 45,
      image,
      popular: popular === true,
      active: active !== false,
    });

    res.status(201).json({ success: true, data: service, message: 'Service created successfully.' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateService = async (req: Request, res: Response): Promise<void> => {
  try {
    const service = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!service) {
      res.status(404).json({ success: false, message: 'Service not found.' });
      return;
    }
    res.json({ success: true, data: service, message: 'Service updated successfully.' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteService = async (req: Request, res: Response): Promise<void> => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);
    if (!service) {
      res.status(404).json({ success: false, message: 'Service not found.' });
      return;
    }
    res.json({ success: true, message: 'Service removed successfully.' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
