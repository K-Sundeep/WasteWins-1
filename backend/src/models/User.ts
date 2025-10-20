import { query, transaction } from '../config/database';
import { cache } from '../config/redis';
import { PoolClient } from 'pg';

export interface User {
  id: string;
  email: string;
  name: string;
  points: number;
  total_donations: number;
  total_weight: number;
  joined_at: Date;
  updated_at?: Date;
  password?: string; // Only included when explicitly requested
}

export class UserModel {
  private static readonly CACHE_TTL = 3600; // 1 hour
  private static readonly CACHE_PREFIX = 'user:';

  static async findById(userId: string): Promise<User | null> {
    // Try cache first
    const cacheKey = `${this.CACHE_PREFIX}${userId}`;
    const cached = await cache.get<User>(cacheKey);
    
    if (cached) {
      return cached;
    }

    // Query database
    const result = await query(
      'SELECT * FROM users WHERE id = $1',
      [userId]
    );

    if (result.rows.length === 0) {
      return null;
    }

    const user = result.rows[0];
    
    // Cache the result
    await cache.set(cacheKey, user, this.CACHE_TTL);
    
    return user;
  }

  static async findByEmail(email: string): Promise<User | null> {
    const result = await query(
      'SELECT id, email, name, points, total_donations, total_weight, joined_at, updated_at FROM users WHERE email = $1',
      [email]
    );

    return result.rows.length > 0 ? result.rows[0] : null;
  }

  static async findByEmailWithPassword(email: string): Promise<User | null> {
    const result = await query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    return result.rows.length > 0 ? result.rows[0] : null;
  }

  static async createWithPassword(userData: {
    email: string;
    password: string;
    name: string;
  }): Promise<User> {
    const { v4: uuidv4 } = await import('uuid');
    const userId = uuidv4();
    
    const result = await query(
      `INSERT INTO users (id, email, password, name, points, total_donations, total_weight, joined_at)
       VALUES ($1, $2, $3, $4, 0, 0, 0, NOW())
       RETURNING id, email, name, points, total_donations, total_weight, joined_at`,
      [userId, userData.email, userData.password, userData.name]
    );

    const user = result.rows[0];
    
    // Cache the new user
    const cacheKey = `${this.CACHE_PREFIX}${user.id}`;
    await cache.set(cacheKey, user, this.CACHE_TTL);
    
    return user;
  }

  static async create(userData: {
    id: string;
    email: string;
    name: string;
  }): Promise<User> {
    const result = await query(
      `INSERT INTO users (id, email, name, points, total_donations, total_weight, joined_at)
       VALUES ($1, $2, $3, 0, 0, 0, NOW())
       RETURNING *`,
      [userData.id, userData.email, userData.name]
    );

    const user = result.rows[0];
    
    // Cache the new user
    const cacheKey = `${this.CACHE_PREFIX}${user.id}`;
    await cache.set(cacheKey, user, this.CACHE_TTL);
    
    return user;
  }

  static async update(userId: string, updates: Partial<User>): Promise<User> {
    const allowedFields = ['name', 'points', 'total_donations', 'total_weight'];
    const fields = Object.keys(updates).filter(key => allowedFields.includes(key));
    
    if (fields.length === 0) {
      throw new Error('No valid fields to update');
    }

    const setClause = fields.map((field, index) => `${field} = $${index + 2}`).join(', ');
    const values = [userId, ...fields.map(field => updates[field as keyof User])];

    const result = await query(
      `UPDATE users SET ${setClause}, updated_at = NOW() WHERE id = $1 RETURNING *`,
      values
    );

    if (result.rows.length === 0) {
      throw new Error('User not found');
    }

    const user = result.rows[0];
    
    // Invalidate cache
    const cacheKey = `${this.CACHE_PREFIX}${userId}`;
    await cache.del(cacheKey);
    
    return user;
  }

  static async incrementPoints(userId: string, points: number): Promise<User> {
    const result = await query(
      `UPDATE users 
       SET points = points + $2, updated_at = NOW()
       WHERE id = $1 
       RETURNING *`,
      [userId, points]
    );

    if (result.rows.length === 0) {
      throw new Error('User not found');
    }

    const user = result.rows[0];
    
    // Invalidate cache
    const cacheKey = `${this.CACHE_PREFIX}${userId}`;
    await cache.del(cacheKey);
    
    return user;
  }

  static async updateStats(
    userId: string,
    pointsToAdd: number,
    weightToAdd: number
  ): Promise<User> {
    const result = await query(
      `UPDATE users 
       SET points = points + $2,
           total_donations = total_donations + 1,
           total_weight = total_weight + $3,
           updated_at = NOW()
       WHERE id = $1 
       RETURNING *`,
      [userId, pointsToAdd, weightToAdd]
    );

    if (result.rows.length === 0) {
      throw new Error('User not found');
    }

    const user = result.rows[0];
    
    // Invalidate cache
    const cacheKey = `${this.CACHE_PREFIX}${userId}`;
    await cache.del(cacheKey);
    
    return user;
  }

  static async getTotalStats(): Promise<{
    total_users: number;
    total_weight: number;
    total_donations: number;
  }> {
    const cacheKey = 'stats:total';
    const cached = await cache.get<any>(cacheKey);
    
    if (cached) {
      return cached;
    }

    const result = await query(
      `SELECT 
        COUNT(*) as total_users,
        COALESCE(SUM(total_weight), 0) as total_weight,
        COALESCE(SUM(total_donations), 0) as total_donations
       FROM users`
    );

    const stats = result.rows[0];
    
    // Cache for 5 minutes
    await cache.set(cacheKey, stats, 300);
    
    return stats;
  }
}
