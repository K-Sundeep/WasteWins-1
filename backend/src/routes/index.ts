import { Router } from 'express';
import authRoutes from './auth.routes';
import userRoutes from './user.routes';
import donationRoutes from './donation.routes';
import rewardRoutes from './reward.routes';
import impactRoutes from './impact.routes';

const router = Router();

// Import analytics routes (JavaScript file)
const analyticsRoutes = require('./analytics');

// Mount routes
router.use('/auth', authRoutes);
router.use('/user', userRoutes);
router.use('/users', userRoutes); // Alias for user
router.use('/donations', donationRoutes);
router.use('/rewards', rewardRoutes);
router.use('/impact', impactRoutes);
router.use('/analytics', analyticsRoutes);

export default router;
