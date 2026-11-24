import { Request, Response } from 'express';
import { Promotion } from '../models/Promotion';

export const getPromotions = async (req: Request, res: Response): Promise<void> => {
  try {
    const { active } = req.query;
    const query: any = {};
    if (active !== undefined) query.active = active === 'true';

    const promotions = await Promotion.find(query).sort('-createdAt');
    res.json({ success: true, count: promotions.length, data: promotions });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getPromotionById = async (req: Request, res: Response): Promise<void> => {
  try {
    const promo = await Promotion.findById(req.params.id);
    if (!promo) {
      res.status(404).json({ success: false, message: 'Promotion not found.' });
      return;
    }
    res.json({ success: true, data: promo });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createPromotion = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      code,
      title,
      description,
      discountType,
      discountValue,
      minPurchase,
      maxDiscount,
      startDate,
      endDate,
      usageLimit,
      active,
    } = req.body;

    if (!code || !title || !discountType || discountValue === undefined || !startDate || !endDate) {
      res.status(400).json({ success: false, message: 'Please provide all mandatory promotion fields.' });
      return;
    }

    const existing = await Promotion.findOne({ code: code.toUpperCase() });
    if (existing) {
      res.status(400).json({ success: false, message: 'A promotion with this code already exists.' });
      return;
    }

    const promotion = await Promotion.create({
      code: code.toUpperCase(),
      title,
      description: description || `${title} promotional discount`,
      discountType,
      discountValue: Number(discountValue),
      minPurchase: Number(minPurchase) || 0,
      maxDiscount: maxDiscount ? Number(maxDiscount) : undefined,
      startDate,
      endDate,
      usageLimit: usageLimit ? Number(usageLimit) : 500,
      active: active !== false,
    });

    res.status(201).json({ success: true, data: promotion, message: 'Promotion created successfully.' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updatePromotion = async (req: Request, res: Response): Promise<void> => {
  try {
    const promotion = await Promotion.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!promotion) {
      res.status(404).json({ success: false, message: 'Promotion not found.' });
      return;
    }
    res.json({ success: true, data: promotion, message: 'Promotion updated.' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deletePromotion = async (req: Request, res: Response): Promise<void> => {
  try {
    const promo = await Promotion.findByIdAndDelete(req.params.id);
    if (!promo) {
      res.status(404).json({ success: false, message: 'Promotion not found.' });
      return;
    }
    res.json({ success: true, message: 'Promotion removed.' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const validatePromotion = async (req: Request, res: Response): Promise<void> => {
  try {
    const { code, amount } = req.body;
    if (!code) {
      res.status(400).json({ success: false, message: 'Please provide a promo code.' });
      return;
    }

    const promo = await Promotion.findOne({ code: code.toUpperCase(), active: true });
    if (!promo) {
      res.status(404).json({ success: false, message: 'Invalid or expired coupon code.' });
      return;
    }

    const todayStr = new Date().toISOString().split('T')[0];
    if (todayStr < promo.startDate) {
      res.status(400).json({ success: false, message: `Coupon is not active yet. Valid from ${promo.startDate}.` });
      return;
    }
    if (todayStr > promo.endDate) {
      res.status(400).json({ success: false, message: 'This coupon has expired.' });
      return;
    }

    if (promo.usageLimit && promo.usedCount >= promo.usageLimit) {
      res.status(400).json({ success: false, message: 'Coupon usage limit has been reached.' });
      return;
    }

    const orderAmount = Number(amount) || 0;
    if (orderAmount < promo.minPurchase) {
      res.status(400).json({
        success: false,
        message: `Minimum order amount of ₹${promo.minPurchase} required to use this coupon.`,
      });
      return;
    }

    let discount = 0;
    if (promo.discountType === 'PERCENTAGE') {
      discount = (orderAmount * promo.discountValue) / 100;
      if (promo.maxDiscount && discount > promo.maxDiscount) {
        discount = promo.maxDiscount;
      }
    } else {
      discount = Math.min(promo.discountValue, orderAmount);
    }

    res.json({
      success: true,
      valid: true,
      code: promo.code,
      title: promo.title,
      discountType: promo.discountType,
      discountValue: promo.discountValue,
      discountAmount: Math.round(discount),
      finalAmount: Math.max(0, orderAmount - Math.round(discount)),
      message: `Coupon applied: ₹${Math.round(discount)} discount!`,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
