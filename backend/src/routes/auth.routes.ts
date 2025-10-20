import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { asyncHandler } from '../middleware/errorHandler';
import { rateLimiter } from '../middleware/rateLimiter';

const router = Router();

// Apply strict rate limiting to auth routes
router.use(rateLimiter);

router.post('/signup', asyncHandler(AuthController.signup));
router.post('/signin', asyncHandler(AuthController.signin));
router.post('/login', asyncHandler(AuthController.signin)); // Alias for signin

export default router;
