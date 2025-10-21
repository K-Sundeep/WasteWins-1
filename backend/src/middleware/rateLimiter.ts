import { Request } from 'express';
import rateLimit from 'express-rate-limit';
import { createRedisRateLimiterStore } from './redisStore';

const getStore = () => {
  try {
    return createRedisRateLimiterStore();
  } catch {
    return undefined; // Fall back to memory store
  }
};

export const rateLimiter = rateLimit({
  windowMs: 60000, // 1 minute
  max: 100, // Increased from 5 to 100 for testing
  message: 'Too many requests, please slow down.',
  standardHeaders: true,
  legacyHeaders: false,
  store: getStore(),
  skip: (req: Request): boolean => {
    const trustedIps = ['127.0.0.1', '::1'];
    // Skip rate limiting for health checks and testing
    const skipPaths = ['/health', '/api/v1/auth/signin', '/api/v1/auth/signup'];
    const isSkipPath = skipPaths.some(path => req.path.includes(path));
    
    return (
      process.env.NODE_ENV === 'development' || 
      isSkipPath ||
      (req.ip ? trustedIps.includes(req.ip) : false)
    );
  },
  handler: (req, res) => {
    res.status(429).json({
      error: 'rate_limited',
      message: 'Too many requests from this IP. Wait 1 minute before trying again.',
      retryAfter: 60
    });
  }
});
