import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { UserModel } from '../models/User';
import { AppError } from '../middleware/errorHandler';
import { z } from 'zod';

const updateProfileSchema = z.object({
  name: z.string().min(2).optional(),
});

export class UserController {
  static async getProfile(req: AuthRequest, res: Response) {
    if (!req.user) {
      throw new AppError('User not authenticated', 401);
    }

    let profile = await UserModel.findById(req.user.id);

    if (!profile) {
      // Create profile if it doesn't exist
      profile = await UserModel.create({
        id: req.user.id,
        email: req.user.email || '',
        name: req.user.user_metadata?.name || req.user.email || 'User',
      });
    }

    res.json(profile);
  }

  static async updateProfile(req: AuthRequest, res: Response) {
    if (!req.user) {
      throw new AppError('User not authenticated', 401);
    }

    const validation = updateProfileSchema.safeParse(req.body);
    
    if (!validation.success) {
      throw new AppError(validation.error.errors[0].message, 400);
    }

    const updatedProfile = await UserModel.update(req.user.id, validation.data);

    res.json(updatedProfile);
  }
}
