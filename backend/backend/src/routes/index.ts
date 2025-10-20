import { Router } from 'express';
import authRoutes from './auth.routes';
import userRoutes from './user.routes';
import donationRoutes from './donation.routes';
import rewardRoutes from './reward.routes';
import impactRoutes from './impact.routes';
import locationRoutes from './location.routes';

const router = Router();

// API base route
router.get('/', (req, res) => {
  res.json({
    message: 'WasteWins API v1',
    status: 'active',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    endpoints: {
      auth: '/api/v1/auth',
      users: '/api/v1/users',
      donations: '/api/v1/donations',
      rewards: '/api/v1/rewards',
      impact: '/api/v1/impact',
      location: '/api/v1/location'
    },
    documentation: 'https://wastewins-1.onrender.com/health'
  });
});

// Mount routes
router.use('/auth', authRoutes);
router.use('/user', userRoutes);
router.use('/users', userRoutes); // Alias for user
router.use('/donations', donationRoutes);
router.use('/rewards', rewardRoutes);
router.use('/impact', impactRoutes);
router.use('/location', locationRoutes);

export default router;
