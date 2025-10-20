import Redis from 'ioredis';
import { logger } from '../utils/logger';

let redisClient: Redis | null = null;
let redisEnabled = false;

export const connectRedis = async (): Promise<Redis | null> => {
  // Check if Redis is explicitly enabled
  if (!process.env.REDIS_HOST && !process.env.REDIS_URL) {
    logger.info('Redis not configured, running without cache');
    redisEnabled = false;
    return null;
  }

  if (redisClient) {
    return redisClient;
  }

  try {
    redisClient = new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379'),
      password: process.env.REDIS_PASSWORD || undefined,
      db: parseInt(process.env.REDIS_DB || '0'),
      retryStrategy: (times) => {
        // Stop retrying after 3 attempts
        if (times > 3) {
          return null;
        }
        const delay = Math.min(times * 50, 2000);
        return delay;
      },
      maxRetriesPerRequest: 3,
      lazyConnect: true, // Don't connect immediately
    });

    redisClient.on('connect', () => {
      logger.info('Redis client connected');
      redisEnabled = true;
    });

    redisClient.on('error', (error) => {
      // Suppress repeated connection errors
      if (!error.message.includes('ECONNREFUSED')) {
        logger.error('Redis client error:', error);
      }
      redisEnabled = false;
    });

    // Test the connection
    await redisClient.connect();
    await redisClient.ping();
    logger.info('Redis connection established');
    redisEnabled = true;

    return redisClient;
  } catch (error) {
    logger.warn('Redis connection failed, continuing without cache');
    redisEnabled = false;
    redisClient = null;
    return null;
  }
};

export const getRedis = (): Redis => {
  if (!redisClient) {
    throw new Error('Redis client not initialized. Call connectRedis first.');
  }
  return redisClient;
};

// Cache helper functions
export const cache = {
  async get<T>(key: string): Promise<T | null> {
    if (!redisEnabled || !redisClient) {
      return null; // No cache available
    }
    try {
      const data = await redisClient.get(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      return null;
    }
  },

  async set(key: string, value: any, ttl: number = 3600): Promise<void> {
    if (!redisEnabled || !redisClient) {
      return; // No cache available
    }
    try {
      await redisClient.setex(key, ttl, JSON.stringify(value));
    } catch (error) {
      // Silently fail
    }
  },

  async del(key: string): Promise<void> {
    if (!redisEnabled || !redisClient) {
      return; // No cache available
    }
    try {
      await redisClient.del(key);
    } catch (error) {
      // Silently fail
    }
  },

  async delPattern(pattern: string): Promise<void> {
    if (!redisEnabled || !redisClient) {
      return; // No cache available
    }
    try {
      const keys = await redisClient.keys(pattern);
      if (keys.length > 0) {
        await redisClient.del(...keys);
      }
    } catch (error) {
      // Silently fail
    }
  },

  async exists(key: string): Promise<boolean> {
    if (!redisEnabled || !redisClient) {
      return false; // No cache available
    }
    try {
      const result = await redisClient.exists(key);
      return result === 1;
    } catch (error) {
      return false;
    }
  },
};

export const closeRedis = async (): Promise<void> => {
  if (redisClient) {
    await redisClient.quit();
    redisClient = null;
    logger.info('Redis connection closed');
  }
};
