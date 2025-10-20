import { Router } from 'express';
import { ImpactController } from '../controllers/impact.controller';
import { authenticate, optionalAuth } from '../middleware/auth';
import { asyncHandler } from '../middleware/errorHandler';

const router = Router();

router.get('/community', optionalAuth, asyncHandler(ImpactController.getCommunityImpact));
router.get('/personal', authenticate, asyncHandler(ImpactController.getPersonalImpact));

export default router;
