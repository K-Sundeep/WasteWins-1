import { Router } from 'express';
import { RewardController } from '../controllers/reward.controller';
import { authenticate, optionalAuth } from '../middleware/auth';
import { asyncHandler } from '../middleware/errorHandler';

const router = Router();

router.get('/', optionalAuth, asyncHandler(RewardController.getAll));
router.post('/:id/redeem', authenticate, asyncHandler(RewardController.redeem));

export default router;
