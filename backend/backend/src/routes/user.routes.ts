import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { authenticate } from '../middleware/auth';
import { asyncHandler } from '../middleware/errorHandler';

const router = Router();

router.get('/profile', authenticate, asyncHandler(UserController.getProfile));
router.put('/profile', authenticate, asyncHandler(UserController.updateProfile));

export default router;
