import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { DonationModel } from '../models/Donation';
import { UserModel } from '../models/User';
import { AppError } from '../middleware/errorHandler';
import { z } from 'zod';

const createDonationSchema = z.object({
  category: z.enum(['books', 'clothes', 'plastic', 'electronics', 'biowaste', 'other']),
  weight: z.number().positive('Weight must be positive'),
  items: z.string().min(1, 'Items description is required'),
  pickupType: z.string().optional(),
  address: z.string().optional(),
  timeSlot: z.string().optional(),
  donationLocation: z.string().optional(),
  distanceKm: z.number().optional(),
});

export class DonationController {
  static async create(req: AuthRequest, res: Response) {
    if (!req.user) {
      throw new AppError('User not authenticated', 401);
    }

    const validation = createDonationSchema.safeParse(req.body);
    
    if (!validation.success) {
      throw new AppError(validation.error.errors[0].message, 400);
    }

    const { category, weight, items, pickupType, address, timeSlot, donationLocation, distanceKm } = validation.data;

    // Create donation
    const donation = await DonationModel.create({
      user_id: req.user.id,
      category,
      weight,
      items,
      pickup_type: pickupType,
      address,
      time_slot: timeSlot,
      donation_location: donationLocation,
      distance_km: distanceKm,
    });

    // Update user stats
    await UserModel.updateStats(req.user.id, donation.points_earned, weight);

    res.status(201).json(donation);
  }

  static async getUserDonations(req: AuthRequest, res: Response) {
    if (!req.user) {
      throw new AppError('User not authenticated', 401);
    }

    const donations = await DonationModel.findByUserId(req.user.id);

    res.json(donations);
  }

  static async getById(req: AuthRequest, res: Response) {
    if (!req.user) {
      throw new AppError('User not authenticated', 401);
    }

    const { id } = req.params;
    const donation = await DonationModel.findById(id);

    if (!donation) {
      throw new AppError('Donation not found', 404);
    }

    if (donation.user_id !== req.user.id) {
      throw new AppError('Unauthorized access to donation', 403);
    }

    res.json(donation);
  }
}
