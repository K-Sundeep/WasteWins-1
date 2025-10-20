import { Redis } from 'ioredis';

export const createRedisRateLimiterStore = () => {
  // Check if Redis is available
  try {
    const { getRedis } = require('../config/redis');
    const client = getRedis();
    
    return {
      async increment(key: string) {
        const current = await client.incr(key);
        if (current === 1) {
          await client.expire(key, 60); // Set TTL on first increment
        }
        return {
          totalHits: current,
          resetTime: new Date(Date.now() + 60000)
        };
      },
      async decrement(key: string) {
        await client.decr(key);
      },
      async resetKey(key: string) {
        await client.del(key);
      }
    };
  } catch (error) {
    // Redis not available, return null to use memory store
    throw new Error('Redis not available');
  }
};
