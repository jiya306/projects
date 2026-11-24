import { Request, Response } from 'express';
import { Review } from '../models/Review';
import { Staff } from '../models/Staff';
import { Appointment } from '../models/Appointment';
import { Customer } from '../models/Customer';
import { Notification } from '../models/Notification';

export const getReviews = async (req: Request, res: Response): Promise<void> => {
  try {
    const { stylistId, serviceId, approved, featured } = req.query;
    const query: any = {};

    if (stylistId) query.stylist = stylistId;
    if (serviceId) query.service = serviceId;
    if (approved !== undefined) query.approved = approved === 'true';
    if (featured !== undefined) query.featured = featured === 'true';

    const reviews = await Review.find(query).sort('-date');
    res.json({ success: true, count: reviews.length, data: reviews });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createReview = async (req: Request, res: Response): Promise<void> => {
  try {
    const { appointmentId, rating, reviewText } = req.body;

    if (!appointmentId || !rating || !reviewText) {
      res.status(400).json({ success: false, message: 'Appointment ID, rating and review text are required.' });
      return;
    }

    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      res.status(404).json({ success: false, message: 'Appointment not found.' });
      return;
    }

    // Only allow review for completed appointments
    if (appointment.status !== 'COMPLETED') {
      res.status(400).json({
        success: false,
        message: 'Reviews can only be submitted for completed salon appointments.',
      });
      return;
    }

    const existingReview = await Review.findOne({ appointment: appointment._id });
    if (existingReview) {
      res.status(400).json({ success: false, message: 'You have already reviewed this appointment.' });
      return;
    }

    const customer = await Customer.findById(appointment.customer);

    const review = await Review.create({
      customer: appointment.customer,
      customerName: appointment.customerName,
      customerAvatar: (customer as any)?.avatar || undefined,
      appointment: appointment._id,
      service: appointment.service,
      serviceName: appointment.serviceName,
      stylist: appointment.stylist,
      stylistName: appointment.stylistName,
      rating: Number(rating),
      reviewText,
      approved: true,
      featured: Number(rating) >= 5,
    });

    // Update Stylist average rating
    const allStylistReviews = await Review.find({ stylist: appointment.stylist });
    const totalRating = allStylistReviews.reduce((sum, r) => sum + r.rating, 0);
    const avgRating = Math.round((totalRating / allStylistReviews.length) * 10) / 10;

    await Staff.findByIdAndUpdate(appointment.stylist, {
      rating: avgRating,
      reviewCount: allStylistReviews.length,
    });

    // Notification
    await Notification.create({
      type: 'NEW_REVIEW',
      title: 'New Review Submitted',
      message: `${appointment.customerName} gave ${rating} stars for ${appointment.serviceName} with ${appointment.stylistName}.`,
      link: '/admin/reviews',
    });

    res.status(201).json({ success: true, data: review, message: 'Thank you for your review!' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateReview = async (req: Request, res: Response): Promise<void> => {
  try {
    const review = await Review.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!review) {
      res.status(404).json({ success: false, message: 'Review not found.' });
      return;
    }
    res.json({ success: true, data: review, message: 'Review updated.' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteReview = async (req: Request, res: Response): Promise<void> => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);
    if (!review) {
      res.status(404).json({ success: false, message: 'Review not found.' });
      return;
    }
    res.json({ success: true, message: 'Review removed.' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
