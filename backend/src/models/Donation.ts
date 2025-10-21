import { query } from '../config/database';
import { cache } from '../config/redis';
import { v4 as uuidv4 } from 'uuid';

export interface Donation {
  id: string;
  user_id: string;
  category: string;
  weight: number;
  items: string;
  pickup_type?: string;
  address?: string;
  time_slot?: string;
  status: string;
  current_step: number;
  points_earned: number;
  created_at: Date;
  updated_at?: Date;
  estimated_completion: Date;
  tracking_steps: any[];
}

export class DonationModel {
  private static readonly CACHE_TTL = 1800; // 30 minutes
  private static readonly CACHE_PREFIX = 'donation:';
  private static readonly USER_DONATIONS_PREFIX = 'user_donations:';

  static async create(donationData: {
    user_id: string;
    category: string;
    weight: number;
    items: string;
    pickup_type?: string;
    address?: string;
    time_slot?: string;
    donation_location?: string;
    distance_km?: number;
  }): Promise<Donation> {
    const id = uuidv4(); // Use proper UUID format
    
    // Calculate points based on category
    const pointsPerKg: Record<string, number> = {
      books: 25,
      clothes: 20,
      plastic: 15,
      electronics: 30,
      biowaste: 10,
    };
    
    const pointsEarned = Math.round(
      donationData.weight * (pointsPerKg[donationData.category] || 15)
    );

    const trackingSteps = [
      { title: 'Collected', completed: true, date: new Date().toISOString() },
      { title: 'In Transit', completed: false, date: null },
      { title: 'Processing', completed: false, date: null },
      { title: 'Manufactured', completed: false, date: null },
      { title: 'Available for Redemption', completed: false, date: null },
    ];

    const estimatedCompletion = new Date();
    estimatedCompletion.setDate(estimatedCompletion.getDate() + 14); // 14 days

    const result = await query(
      `INSERT INTO donations (
        id, user_id, category, weight, items, pickup_type, address, 
        time_slot, donation_location, distance_km, status, current_step, 
        points_earned, created_at, estimated_completion, tracking_steps
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, NOW(), $14, $15)
      RETURNING *`,
      [
        id,
        donationData.user_id,
        donationData.category,
        donationData.weight,
        donationData.items,
        donationData.pickup_type,
        donationData.address,
        donationData.time_slot,
        donationData.donation_location,
        donationData.distance_km,
        'collected',
        0,
        pointsEarned,
        estimatedCompletion,
        JSON.stringify(trackingSteps),
      ]
    );

    const donation = result.rows[0];
    
    // Cache the donation
    const cacheKey = `${this.CACHE_PREFIX}${id}`;
    await cache.set(cacheKey, donation, this.CACHE_TTL);
    
    // Invalidate user donations cache
    await cache.del(`${this.USER_DONATIONS_PREFIX}${donationData.user_id}`);
    
    return donation;
  }

  static async findById(donationId: string): Promise<Donation | null> {
    // Try cache first
    const cacheKey = `${this.CACHE_PREFIX}${donationId}`;
    const cached = await cache.get<Donation>(cacheKey);
    
    if (cached) {
      return cached;
    }

    const result = await query(
      'SELECT * FROM donations WHERE id = $1',
      [donationId]
    );

    if (result.rows.length === 0) {
      return null;
    }

    const donation = result.rows[0];
    
    // Cache the result
    await cache.set(cacheKey, donation, this.CACHE_TTL);
    
    return donation;
  }

  static async findByUserId(userId: string): Promise<Donation[]> {
    // Try cache first
    const cacheKey = `${this.USER_DONATIONS_PREFIX}${userId}`;
    const cached = await cache.get<Donation[]>(cacheKey);
    
    if (cached) {
      return cached;
    }

    const result = await query(
      'SELECT * FROM donations WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );

    const donations = result.rows;
    
    // Cache the result
    await cache.set(cacheKey, donations, this.CACHE_TTL);
    
    return donations;
  }

  static async updateStatus(
    donationId: string,
    status: string,
    currentStep: number
  ): Promise<Donation> {
    const result = await query(
      `UPDATE donations 
       SET status = $2, current_step = $3, updated_at = NOW()
       WHERE id = $1 
       RETURNING *`,
      [donationId, status, currentStep]
    );

    if (result.rows.length === 0) {
      throw new Error('Donation not found');
    }

    const donation = result.rows[0];
    
    // Invalidate caches
    await cache.del(`${this.CACHE_PREFIX}${donationId}`);
    await cache.del(`${this.USER_DONATIONS_PREFIX}${donation.user_id}`);
    
    return donation;
  }

  static async getCategoryBreakdown(userId: string): Promise<Record<string, number>> {
    const cacheKey = `category_breakdown:${userId}`;
    const cached = await cache.get<Record<string, number>>(cacheKey);
    
    if (cached) {
      return cached;
    }

    const result = await query(
      `SELECT category, SUM(weight) as total_weight
       FROM donations
       WHERE user_id = $1
       GROUP BY category`,
      [userId]
    );

    const breakdown: Record<string, number> = {};
    result.rows.forEach((row: any) => {
      breakdown[row.category] = parseFloat(row.total_weight);
    });
    
    // Cache for 10 minutes
    await cache.set(cacheKey, breakdown, 600);
    
    return breakdown;
  }

  static async getMonthlyStats(months: number = 6): Promise<any[]> {
    const cacheKey = `monthly_stats:${months}`;
    const cached = await cache.get<any[]>(cacheKey);
    
    if (cached) {
      return cached;
    }

    const result = await query(
      `SELECT 
        DATE_TRUNC('month', created_at) as month,
        SUM(weight) as total_weight,
        COUNT(*) as total_donations
       FROM donations
       WHERE created_at >= NOW() - INTERVAL '${months} months'
       GROUP BY DATE_TRUNC('month', created_at)
       ORDER BY month ASC`
    );

    const stats = result.rows;
    
    // Cache for 1 hour
    await cache.set(cacheKey, stats, 3600);
    
    return stats;
  }
}
