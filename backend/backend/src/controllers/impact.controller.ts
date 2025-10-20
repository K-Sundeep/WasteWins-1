import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { UserModel } from '../models/User';
import { DonationModel } from '../models/Donation';
import { cache } from '../config/redis';
import { AppError } from '../middleware/errorHandler';

export class ImpactController {
  static async getCommunityImpact(req: AuthRequest, res: Response) {
    const cacheKey = 'impact:community';
    const cached = await cache.get<any>(cacheKey);
    
    if (cached) {
      res.json(cached);
      return;
    }

    // Get total stats
    const stats = await UserModel.getTotalStats();
    
    const totalWeight = parseFloat(String(stats.total_weight)) || 0;
    const totalDonations = parseInt(String(stats.total_donations)) || 0;
    const totalUsers = parseInt(String(stats.total_users)) || 0;

    // Calculate derived metrics
    const carbonSaved = totalWeight * 0.61; // Approx 0.61 kg CO2 per kg waste
    const treesEquivalent = Math.round(carbonSaved / 21); // 1 tree absorbs ~21kg CO2/year
    const energySaved = totalWeight * 0.0012; // ~1.2 kWh per kg

    // Get monthly data
    const monthlyStats = await DonationModel.getMonthlyStats(6);
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    const monthlyData = monthlyStats.map(stat => {
      const date = new Date(stat.month);
      return {
        name: monthNames[date.getMonth()],
        waste: Math.round(parseFloat(stat.total_weight)),
        products: Math.round(parseFloat(stat.total_weight) * 0.38), // ~38% conversion rate
      };
    });

    const communityImpact = {
      totalDonations,
      totalWeight: Math.round(totalWeight * 10) / 10,
      carbonSaved: Math.round(carbonSaved * 10) / 10,
      treesEquivalent,
      activeUsers: totalUsers,
      partnerFactories: 247,
      jobsCreated: 1340,
      energySaved: Math.round(energySaved * 10) / 10,
      monthlyData: monthlyData.length > 0 ? monthlyData : [
        { name: 'Jan', waste: 0, products: 0 }
      ],
    };

    // Cache for 5 minutes
    await cache.set(cacheKey, communityImpact, 300);

    res.json(communityImpact);
  }

  static async getPersonalImpact(req: AuthRequest, res: Response) {
    if (!req.user) {
      throw new AppError('User not authenticated', 401);
    }

    const cacheKey = `impact:personal:${req.user.id}`;
    const cached = await cache.get<any>(cacheKey);
    
    if (cached) {
      res.json(cached);
      return;
    }

    // Get user profile
    const userProfile = await UserModel.findById(req.user.id);
    
    if (!userProfile) {
      throw new AppError('User profile not found', 404);
    }

    // Get category breakdown
    const categoryBreakdown = await DonationModel.getCategoryBreakdown(req.user.id);
    
    const totalWeight = Object.values(categoryBreakdown).reduce((sum, w) => sum + w, 0);

    // Create donation breakdown with colors
    const colors: Record<string, string> = {
      clothes: '#2F8A5C',
      books: '#FFB35C',
      plastic: '#4A9B6E',
      electronics: '#6B7FD7',
      biowaste: '#8B4513',
      other: '#9CA3AF',
    };

    const donationBreakdown = Object.entries(categoryBreakdown).map(([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value: Math.round((value / totalWeight) * 100),
      color: colors[name.toLowerCase()] || colors.other,
    }));

    // Calculate impact metrics
    const carbonSaved = totalWeight * 0.61; // kg CO2
    const productsMade = Math.round(totalWeight * 0.38); // ~38% conversion rate

    const personalImpact = {
      totalWeight: Math.round(totalWeight * 10) / 10,
      pointsEarned: userProfile.points || 0,
      carbonSaved: Math.round(carbonSaved * 10) / 10,
      productsMade,
      donationBreakdown: donationBreakdown.length > 0 ? donationBreakdown : [
        { name: 'No donations yet', value: 100, color: '#9CA3AF' }
      ],
    };

    // Cache for 5 minutes
    await cache.set(cacheKey, personalImpact, 300);

    res.json(personalImpact);
  }
}
