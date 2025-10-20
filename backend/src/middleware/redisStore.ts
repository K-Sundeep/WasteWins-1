import { Redis } from 'ioredis';
import { getRedis } from '../config/redis';

export const createRedisRateLimiterStore = () => {
  return {
    async increment(key: string) {
      const client = getRedis();
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
      await getRedis().decr(key);
    },
    async resetKey(key: string) {
      await getRedis().del(key);
    }
  };
};
