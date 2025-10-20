import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { UserModel } from '../models/User';
import { query } from '../config/database';
import { cache } from '../config/redis';
import { AppError } from '../middleware/errorHandler';
import { v4 as uuidv4 } from 'uuid';

export class RewardController {
  static async getAll(req: AuthRequest, res: Response) {
    const cacheKey = 'rewards:all';
    const cached = await cache.get<any[]>(cacheKey);
    
    if (cached) {
      res.json(cached);
      return;
    }

    // Mock rewards data - in production, this would come from database
    const rewards = [
      {
        id: 1,
        name: 'Recycled Tote Bag',
        points: 150,
        originalPrice: '$25',
        category: 'products',
        sustainability: 'Made from 5 donated t-shirts',
        rating: 4.8,
        available: true,
      },
      {
        id: 2,
        name: 'Upcycled Notebook Set',
        points: 80,
        originalPrice: '$12',
        category: 'products',
        sustainability: 'Made from recycled paper',
        rating: 4.9,
        available: true,
      },
      {
        id: 3,
        name: 'Eco-Friendly Purse',
        points: 300,
        originalPrice: '$45',
        category: 'products',
        sustainability: 'Handcrafted from textile waste',
        rating: 4.7,
        available: true,
      },
      {
        id: 4,
        name: '20% Off Organic Groceries',
        points: 200,
        originalPrice: '$10 value',
        category: 'vouchers',
        partner: 'GreenMart',
        validUntil: '30 days',
        available: true,
      },
      {
        id: 5,
        name: 'Free Coffee for a Week',
        points: 120,
        originalPrice: '$35 value',
        category: 'vouchers',
        partner: 'EcoCafe',
        validUntil: '7 days',
        available: true,
      },
    ];

    // Cache for 1 hour
    await cache.set(cacheKey, rewards, 3600);

    res.json(rewards);
  }

  static async redeem(req: AuthRequest, res: Response) {
    if (!req.user) {
      throw new AppError('User not authenticated', 401);
    }

    const rewardId = parseInt(req.params.id);
    
    if (isNaN(rewardId)) {
      throw new AppError('Invalid reward ID', 400);
    }

    // Get user profile
    const userProfile = await UserModel.findById(req.user.id);
    
    if (!userProfile) {
      throw new AppError('User profile not found', 404);
    }

    // Get reward details (mock data)
    const rewards = await this.getRewardsList();
    const reward = rewards.find(r => r.id === rewardId);
    
    if (!reward) {
      throw new AppError('Reward not found', 404);
    }

    if (userProfile.points < reward.points) {
      throw new AppError('Insufficient points', 400);
    }

    // Create redemption record
    const redemptionId = `RED-${Date.now()}-${uuidv4().substring(0, 8)}`;
    
    await query(
      `INSERT INTO redemptions (id, user_id, reward_id, reward_name, points_used, redeemed_at, status)
       VALUES ($1, $2, $3, $4, $5, NOW(), $6)`,
      [redemptionId, req.user.id, reward.id, reward.name, reward.points, 'confirmed']
    );

    // Deduct points from user
    await UserModel.update(req.user.id, {
      points: userProfile.points - reward.points,
    });

    // Invalidate cache
    await cache.del(`user:${req.user.id}`);

    res.json({
      id: redemptionId,
      userId: req.user.id,
      rewardId: reward.id,
      rewardName: reward.name,
      pointsUsed: reward.points,
      redeemedAt: new Date().toISOString(),
      status: 'confirmed',
    });
  }

  private static async getRewardsList() {
    return [
      { id: 1, name: 'Recycled Tote Bag', points: 150 },
      { id: 2, name: 'Upcycled Notebook Set', points: 80 },
      { id: 3, name: 'Eco-Friendly Purse', points: 300 },
      { id: 4, name: '20% Off Organic Groceries', points: 200 },
      { id: 5, name: 'Free Coffee for a Week', points: 120 },
    ];
  }
}
